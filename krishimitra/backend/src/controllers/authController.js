const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');

// Register new farmer
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, phone, password } = req.body;

        // Validation
        if (!firstName || !lastName || !phone || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if phone already exists
        const existingFarmer = await Farmer.findOne({ where: { phone } });
        if (existingFarmer) {
            return res.status(400).json({ error: 'Mobile number already registered' });
        }

        // Create farmer (password will be hashed by model hook)
        const farmer = await Farmer.create({
            firstName,
            lastName,
            phone,
            password
        });

        // Generate token
        const token = jwt.sign(
            { id: farmer.id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            token,
            farmer: {
                id: farmer.id,
                firstName: farmer.firstName,
                lastName: farmer.lastName,
                phone: farmer.phone
            }
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

// Login farmer
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validation
        if (!phone || !password) {
            return res.status(400).json({ error: 'Phone and password are required' });
        }

        // Find farmer
        const farmer = await Farmer.findOne({ where: { phone } });
        if (!farmer) {
            return res.status(401).json({ error: 'Invalid mobile number or password' });
        }

        // Check password
        const isMatch = await farmer.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid mobile number or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: farmer.id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            token,
            farmer: {
                id: farmer.id,
                firstName: farmer.firstName,
                lastName: farmer.lastName,
                phone: farmer.phone
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

// Get current user
exports.getMe = async (req, res) => {
    try {
        const farmer = await Farmer.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json({ success: true, farmer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
