const Farm = require('../models/Farm');

exports.addFarm = async (req, res) => {
    try {
        const { land_size, soil_type, irrigation_source, district } = req.body;
        const farm = await Farm.create({
            FarmerId: req.user.id,
            land_size,
            soil_type,
            irrigation_source,
            district
        });
        res.status(201).json(farm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyFarms = async (req, res) => {
    try {
        const farms = await Farm.findAll({ where: { FarmerId: req.user.id } });
        res.json(farms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
