const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createFarm, getMyFarms } = require('../controllers/farmController');

router.route('/')
    .get(protect, getMyFarms)
    .post(protect, createFarm);

module.exports = router;
