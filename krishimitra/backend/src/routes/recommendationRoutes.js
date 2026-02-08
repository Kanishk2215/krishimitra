const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, getRecommendations);

module.exports = router;
