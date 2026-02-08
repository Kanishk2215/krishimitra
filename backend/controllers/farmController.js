const Farm = require('../models/sql/Farm');

exports.createFarm = async (req, res) => {
    try {
        const { name, location, soil_type, size_acres } = req.body;
        const farm = await Farm.create({
            userId: req.user.id,
            name,
            location,
            soil_type,
            size_acres
        });
        res.status(201).json({ success: true, count: 1, data: farm });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getMyFarms = async (req, res) => {
    try {
        const farms = await Farm.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ success: true, count: farms.length, data: farms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
