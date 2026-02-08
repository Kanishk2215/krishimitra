const jwt = require('jsonwebtoken');
const User = require('../models/sql/User');

// Mock OTP Storage (In production, use Redis)
const otpStore = new Map();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOTP = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    try {
        // Generate OTP
        const otp = generateOTP();

        // Store OTP (expires in 5 minutes) - Simplified for MVP
        otpStore.set(phone, { otp, expires: Date.now() + 300000 });

        // TODO: Integrate Twilio here
        console.log(`[DEV MODE] OTP for ${phone}: ${otp}`);

        // Check if user exists, if not create placeholder
        let user = await User.findOne({ where: { phone } });
        if (!user) {
            // We don't create the full user yet, just verify existence intention
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            debug_otp: otp // REMOVE IN PRODUCTION
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    try {
        const record = otpStore.get(phone);

        if (!record) {
            return res.status(400).json({ success: false, message: 'OTP expired or request not found' });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (Date.now() > record.expires) {
            otpStore.delete(phone);
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }

        // OTP Verified - Find or Create User
        let user = await User.findOne({ where: { phone } });
        let isNewUser = false;

        if (!user) {
            user = await User.create({ phone, isVerified: true });
            isNewUser = true;
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '7d' }
        );

        // Clear OTP
        otpStore.delete(phone);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                language: user.language
            },
            isNewUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMe = async (req, res) => {
    // This would use middleware to attach user to req
    // For now returning mock
    res.json({ message: "Protected Profile Route" });
};
