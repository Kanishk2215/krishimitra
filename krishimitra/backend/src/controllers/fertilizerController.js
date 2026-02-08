const Fertilizer = require('../models/Fertilizer');
const SoilNutrient = require('../models/SoilNutrient');
const FertilizerRecommendation = require('../models/FertilizerRecommendation');
const FertilizerApplicationLog = require('../models/FertilizerApplicationLog');
const Crop = require('../models/Crop');
const Farm = require('../models/Farm');
const axios = require('axios');
const { Op } = require('sequelize');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001';

// Get fertilizer recommendations
exports.getRecommendations = async (req, res) => {
    try {
        const { farmId, cropId, growthStage, budget, preferOrganic } = req.body;
        const farmerId = req.user.id; // From authMiddleware

        // Fetch farm details
        const farm = await Farm.findOne({
            where: { id: farmId, FarmerId: farmerId }
        });

        if (!farm) {
            return res.status(404).json({ error: 'Farm not found' });
        }

        // Fetch crop details
        const crop = await Crop.findByPk(cropId);

        if (!crop) {
            return res.status(404).json({ error: 'Crop not found' });
        }

        // Fetch latest soil test (if available)
        const soilTest = await SoilNutrient.findOne({
            where: { farm_id: farmId },
            order: [['test_date', 'DESC']]
        });

        // Call ML service for intelligent recommendation
        // Using crop.name because Crop model has 'name', not 'crop_name'
        const payload = {
            crop_name: crop.name,
            soil_type: farm.soil_type,
            land_size: farm.land_size,
            growth_stage: growthStage,
            soil_test: soilTest ? {
                nitrogen: soilTest.nitrogen_level,
                phosphorus: soilTest.phosphorus_level,
                potassium: soilTest.potassium_level,
                ph: soilTest.ph_level
            } : null,
            prefer_organic: preferOrganic || false,
            budget: budget || null,
            season: crop.season
        };

        const mlResponse = await axios.post(
            `${ML_SERVICE_URL}/fertilizer/recommend`,
            payload
        );

        const recommendations = mlResponse.data;

        // Fetch detailed fertilizer information
        // Extract definitions from the plan
        const fertilizerNames = [...new Set(recommendations.fertilizer_plan.map(f => f.fertilizer))];

        // Find fertilizer records by name (since the ML service returns names like 'Urea', 'DAP')
        // The prompt assumed ML service returns IDs, but the ML python code returns names.
        // So we match by name.
        const fertilizers = await Fertilizer.findAll({
            where: { fertilizer_name: fertilizerNames }
        });

        // Enrich recommendations with product details from DB
        const enrichedPlan = recommendations.fertilizer_plan.map(plan => {
            const fertilizer = fertilizers.find(f => f.fertilizer_name === plan.fertilizer);
            return {
                ...plan,
                fertilizer_id: fertilizer ? fertilizer.fertilizer_id : null,
                fertilizer_details: fertilizer || {}
            };
        });

        // Save recommendation to database
        // Note: The prompt used 'FertilizerRecommendation.create', I must import it.
        const recommendation = await FertilizerRecommendation.create({
            farmer_id: farmerId,
            farm_id: farmId,
            crop_id: cropId,
            growth_stage: growthStage,
            soil_test_id: soilTest ? soilTest.soil_test_id : null,
            fertilizer_plan: enrichedPlan,
            total_cost: recommendations.total_cost,
            expected_yield_increase: recommendations.expected_yield_increase
        });

        res.json({
            success: true,
            recommendation: {
                id: recommendation.recommendation_id,
                fertilizer_plan: enrichedPlan,
                total_cost: recommendations.total_cost,
                expected_yield_increase: recommendations.expected_yield_increase,
                application_schedule: recommendations.schedule,
                tips: recommendations.tips,
                nutrient_summary: recommendations.nutrient_summary
            }
        });

    } catch (error) {
        console.error('Fertilizer recommendation error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Upload soil test report
exports.uploadSoilTest = async (req, res) => {
    try {
        const { farmId } = req.params;
        const farmerId = req.user.id;

        const {
            nitrogen_level,
            phosphorus_level,
            potassium_level,
            ph_level,
            organic_carbon,
            ec_level
        } = req.body;

        // Verify farm ownership
        const farm = await Farm.findOne({
            where: { id: farmId, FarmerId: farmerId }
        });

        if (!farm) {
            return res.status(404).json({ error: 'Farm not found' });
        }

        // Calculate soil health score
        const healthScore = calculateSoilHealthScore({
            nitrogen_level,
            phosphorus_level,
            potassium_level,
            ph_level,
            organic_carbon
        });

        // Create soil test record
        const soilTest = await SoilNutrient.create({
            farm_id: farmId,
            nitrogen_level,
            phosphorus_level,
            potassium_level,
            ph_level,
            organic_carbon,
            ec_level,
            soil_health_score: healthScore,
            test_date: new Date()
        });

        res.json({
            success: true,
            soil_test: soilTest,
            interpretation: interpretSoilTest(soilTest)
        });

    } catch (error) {
        console.error('Soil test upload error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get fertilizer recommendation history
exports.getRecommendationHistory = async (req, res) => {
    try {
        const farmerId = req.user.id;
        const { farmId } = req.params;

        const where = { farmer_id: farmerId };
        if (farmId) where.farm_id = farmId;

        const recommendations = await FertilizerRecommendation.findAll({
            where,
            // include model associations if defined, but simple fetch is fine for now
            // or manual fetch
            order: [['recommendation_date', 'DESC']],
            limit: 20
        });

        // Manually enriching with Crop and Farm names if needed, 
        // but simplified since associations might not be set up in models/index.js
        // If needed I can fetch them. For now returning raw recommendations.

        res.json({
            success: true,
            recommendations
        });

    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Log fertilizer application
exports.logApplication = async (req, res) => {
    try {
        const farmerId = req.user.id;
        const {
            farmId,
            fertilizerId,
            quantity,
            applicationMethod,
            growthStage,
            cost,
            notes
        } = req.body;

        const log = await FertilizerApplicationLog.create({
            farmer_id: farmerId,
            farm_id: farmId,
            fertilizer_id: fertilizerId,
            application_date: new Date(),
            quantity_applied: quantity,
            application_method: applicationMethod,
            growth_stage: growthStage,
            cost,
            notes
        });

        res.json({
            success: true,
            log,
            message: 'Application logged successfully'
        });

    } catch (error) {
        console.error('Log application error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Search fertilizers
exports.searchFertilizers = async (req, res) => {
    try {
        const {
            type,
            crop,
            npk_ratio,
            max_price,
            organic_only
        } = req.query;

        const where = {};

        if (type) where.fertilizer_type = type;
        if (npk_ratio) where.npk_ratio = npk_ratio;
        if (max_price) where.price_per_kg = { [Op.lte]: max_price };
        if (organic_only === 'true') where.fertilizer_type = 'Organic';

        // Simple filter for crop compatible for SQLite
        const fertilizers = await Fertilizer.findAll({
            where,
            order: [['price_per_kg', 'ASC']]
        });

        // Manual filtering for crop
        let results = fertilizers;
        if (crop) {
            results = results.filter(f => {
                if (Array.isArray(f.suitable_crops)) {
                    return f.suitable_crops.includes(crop) || f.suitable_crops.includes('All crops');
                }
                return false;
            });
        }

        res.json({
            success: true,
            fertilizers: results
        });

    } catch (error) {
        console.error('Search fertilizers error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Helper functions (kept as is from prompt)
function calculateSoilHealthScore(soilData) {
    let score = 0;
    if (!soilData) return 50;

    // Nitrogen scoring (optimal: 280-560 kg/ha)
    const n = parseFloat(soilData.nitrogen_level) || 0;
    if (n >= 280 && n <= 560) score += 25;
    else if (n > 560) score += 15;
    else score += 10;

    // Phosphorus (optimal: 11-25 kg/ha)
    const p = parseFloat(soilData.phosphorus_level) || 0;
    if (p >= 11 && p <= 25) score += 25;
    else if (p > 25) score += 15;
    else score += 10;

    // Potassium (optimal: 110-280 kg/ha)
    const k = parseFloat(soilData.potassium_level) || 0;
    if (k >= 110 && k <= 280) score += 25;
    else if (k > 280) score += 15;
    else score += 10;

    // pH (optimal: 6.5-7.5)
    const ph = parseFloat(soilData.ph_level) || 7;
    if (ph >= 6.5 && ph <= 7.5) score += 25;
    else if (ph >= 6.0 && ph < 8.0) score += 15;
    else score += 5;

    return score;
}

function interpretSoilTest(soilTest) {
    const interpretation = {
        overall_health: '',
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        ph: '',
        recommendations: []
    };

    const score = soilTest.soil_health_score;
    const n = parseFloat(soilTest.nitrogen_level);
    const p = parseFloat(soilTest.phosphorus_level);
    const k = parseFloat(soilTest.potassium_level);
    const ph = parseFloat(soilTest.ph_level);

    // Overall health
    if (score >= 80) interpretation.overall_health = 'Excellent';
    else if (score >= 60) interpretation.overall_health = 'Good';
    else if (score >= 40) interpretation.overall_health = 'Fair';
    else interpretation.overall_health = 'Poor';

    // Nitrogen
    if (n < 280) {
        interpretation.nitrogen = 'Low - Apply Urea or DAP';
        interpretation.recommendations.push('Apply 50 kg/acre Urea during vegetative stage');
    } else if (n > 560) {
        interpretation.nitrogen = 'High - Reduce nitrogen fertilizers';
    } else {
        interpretation.nitrogen = 'Optimal';
    }

    // Phosphorus
    if (p < 11) {
        interpretation.phosphorus = 'Low - Apply DAP or SSP';
        interpretation.recommendations.push('Apply 25 kg/acre DAP as basal dose');
    } else if (p > 25) {
        interpretation.phosphorus = 'High - Skip phosphatic fertilizers';
    } else {
        interpretation.phosphorus = 'Optimal';
    }

    // Potassium
    if (k < 110) {
        interpretation.potassium = 'Low - Apply MOP';
        interpretation.recommendations.push('Apply 15 kg/acre MOP');
    } else if (k > 280) {
        interpretation.potassium = 'High - Maintain current levels';
    } else {
        interpretation.potassium = 'Optimal';
    }

    // pH
    if (ph < 6.0) {
        interpretation.ph = 'Acidic - Apply lime';
        interpretation.recommendations.push('Apply agricultural lime 200 kg/acre');
    } else if (ph > 8.0) {
        interpretation.ph = 'Alkaline - Apply gypsum';
        interpretation.recommendations.push('Apply gypsum 250 kg/acre');
    } else {
        interpretation.ph = 'Optimal';
    }

    return interpretation;
}
