const express = require('express');
const router = express.Router();
const { addFarm, getMyFarms } = require('../controllers/farmController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addFarm);
router.get('/', authMiddleware, getMyFarms);

module.exports = router;
