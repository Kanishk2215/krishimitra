const express = require('express');
const router = express.Router();
const fertilizerController = require('../controllers/fertilizerController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get fertilizer recommendations
router.post('/recommendations', fertilizerController.getRecommendations);

// Upload soil test report
router.post('/soil-test/:farmId', fertilizerController.uploadSoilTest);

// Get recommendation history
router.get('/recommendations/history/:farmId?', fertilizerController.getRecommendationHistory);

// Log fertilizer application
router.post('/application/log', fertilizerController.logApplication);

// Search fertilizers
router.get('/search', fertilizerController.searchFertilizers);

module.exports = router;
