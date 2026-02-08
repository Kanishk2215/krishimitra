const axios = require('axios');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');

// Calls Python ML Service
exports.getRecommendations = async (req, res) => {
    try {
        const { farmId } = req.body;
        const farm = await Farm.findByPk(farmId);

        if (!farm) return res.status(404).json({ error: 'Farm not found' });

        // Call ML Service (Flask)
        // Try/Catch for ML service specifically to handle offline ml-service gracefully
        let recommendations = [];
        try {
            const mlResponse = await axios.post('http://ml-service:5001/recommend', {
                soil_type: farm.soil_type,
                district: farm.district,
                season: 'Kharif' // TODO: Detect current season dynamically
            });
            recommendations = mlResponse.data.recommendations; // Expecting list of crop names
        } catch (mlError) {
            console.error("ML Service Unavailable, using fallback logic");
            // Fallback: Return crops matching soil type from DB
            const crops = await Crop.findAll(); // Simplified fallback
            recommendations = crops.filter(c => c.soil_suitability.includes(farm.soil_type)).map(c => c.name).slice(0, 3);
        }

        // Enrich data from DB
        const enrichedRecs = await Promise.all(recommendations.map(async (cropName) => {
            const cropData = await Crop.findOne({ where: { name: cropName } });
            return cropData || { name: cropName, avg_profit_per_acre: 0 };
        }));

        res.json(enrichedRecs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
