const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, getMe } = require('../controllers/authController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', getMe); // TODO: Add auth middleware

module.exports = router;
