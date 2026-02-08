const express = require('express');
const router = express.Router();
const { getLiveWeather, getAgriNews } = require('../controllers/onlineController');

router.get('/weather', getLiveWeather);
router.get('/news', getAgriNews);

module.exports = router;
