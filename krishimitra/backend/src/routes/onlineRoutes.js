const express = require('express');
const router = express.Router();
const { getLiveWeather, getAgriNews, getMandiPrices, getNearbyWarehouses } = require('../controllers/onlineController');

router.get('/weather', getLiveWeather);
router.get('/news', getAgriNews);
router.get('/prices', getMandiPrices);
router.get('/warehouses', getNearbyWarehouses);

module.exports = router;
