const express = require('express');
const router = express.Router();
const { getPrices, updatePrices } = require('../controllers/price.controller');
const { protect } = require('../middleware/auth.middleware');

// Routes for getting and updating prices
router.get('/', protect, getPrices);
router.put('/', protect, updatePrices);

module.exports = router;
