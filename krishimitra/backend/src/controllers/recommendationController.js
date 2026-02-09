const axios = require('axios');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');

// Get current season based on month
function getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 6 && month <= 10) return 'Kharif'; // June-Oct
    if (month >= 11 || month <= 3) return 'Rabi'; // Nov-Mar
    return 'Summer'; // Apr-May
}

// Calls Python ML Service
exports.getRecommendations = async (req, res) => {
    try {
        const { farmId, soil_type, district, land_size } = req.body;

        let farm = null;
        let soilType = soil_type;
        let location = district;

        if (farmId) {
            farm = await Farm.findByPk(farmId);
            if (!farm) return res.status(404).json({ error: 'Farm not found' });
            soilType = farm.soil_type;
            location = farm.district;
        }

        const season = getCurrentSeason();
        let recommendations = [];

        // Try ML Service first
        try {
            const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
            const mlResponse = await axios.post(`${ML_URL}/recommend`, {
                soil_type: soilType,
                season: season,
                rainfall: 800,
                land_size: land_size || 2
            }, { timeout: 5000 });

            if (mlResponse.data.success) {
                recommendations = mlResponse.data.recommendations;
            }
        } catch (mlError) {
            console.log("ML Service unavailable, using database fallback");
        }

        // Fallback: Use database crops
        if (recommendations.length === 0) {
            const allCrops = await Crop.findAll();
            const suitableCrops = allCrops.filter(c =>
                c.soil_suitability.includes(soilType) &&
                (c.season === season || c.season === 'Year-round')
            );

            recommendations = suitableCrops.slice(0, 5).map(c => ({
                name: c.name,
                confidence: "85%",
                income: `₹${Math.round(c.avg_profit_per_acre / 1000)}K`,
                investment: `₹${Math.round(c.avg_profit_per_acre * 0.3 / 1000)}K`,
                profit: `₹${Math.round(c.avg_profit_per_acre * 0.7 / 1000)}K`,
                risk: "Low",
                explanation: `Suitable for ${soilType} soil in ${season} season.`,
                timeline: [
                    { week: 1, task: "Soil Preparation" },
                    { week: 4, task: "Fertilization" },
                    { week: Math.round(c.duration_days / 14), task: "Harvesting" }
                ]
            }));
        }

        res.json({ success: true, recommendations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
