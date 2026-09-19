const ProductPrice = require('../models/ProductPrice');

// Helper to sanitize and validate price values
const validatePrice = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num) || !isFinite(num) || num < 0 || num > 1000000) {
    return null;
  }
  return Math.round(num * 100) / 100; // Round to 2 decimal places
};

// @desc    Get all current product price overrides from database
// @route   GET /api/prices
// @access  Private
const getPrices = async (req, res) => {
  try {
    const records = await ProductPrice.find({}).lean();
    const prices = {};

    records.forEach((rec) => {
      if (rec && rec.productId) {
        prices[rec.productId] = {
          pouch: rec.pouch !== undefined ? rec.pouch : null,
          bottle: rec.bottle !== undefined ? rec.bottle : null,
        };
      }
    });

    return res.status(200).json({
      success: true,
      prices,
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product prices',
      error: error.message,
    });
  }
};

// @desc    Save/update product prices permanently in database
// @route   PUT /api/prices
// @access  Private
const updatePrices = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body. "updates" object is required.',
      });
    }

    const bulkOps = [];
    const sanitizedResponses = {};
    const disallowedKeys = ['__proto__', 'constructor', 'prototype'];

    for (const [rawKey, priceData] of Object.entries(updates)) {
      // Prototype pollution & injection guard
      if (disallowedKeys.includes(rawKey) || !Object.prototype.hasOwnProperty.call(updates, rawKey)) {
        continue;
      }

      const productId = String(rawKey).trim();
      // Strict product ID regex check
      if (!/^[a-zA-Z0-9_-]{1,50}$/.test(productId)) {
        continue;
      }

      if (!priceData || typeof priceData !== 'object' || Array.isArray(priceData)) {
        continue;
      }

      const $set = {
        productId,
        updatedBy: req.user ? req.user._id : null,
      };

      const productResponse = {};

      if ('pouch' in priceData) {
        const validatedPouch = validatePrice(priceData.pouch);
        $set.pouch = validatedPouch;
        productResponse.pouch = validatedPouch;
      }

      if ('bottle' in priceData) {
        const validatedBottle = validatePrice(priceData.bottle);
        $set.bottle = validatedBottle;
        productResponse.bottle = validatedBottle;
      }

      if (Object.keys($set).length > 2) {
        bulkOps.push({
          updateOne: {
            filter: { productId },
            update: { $set },
            upsert: true,
          },
        });
        sanitizedResponses[productId] = productResponse;
      }
    }

    if (bulkOps.length > 0) {
      await ProductPrice.bulkWrite(bulkOps);
    }

    // Retrieve all active prices to return complete state
    const allRecords = await ProductPrice.find({}).lean();
    const finalPrices = {};
    allRecords.forEach((rec) => {
      if (rec && rec.productId) {
        finalPrices[rec.productId] = {
          pouch: rec.pouch !== undefined ? rec.pouch : null,
          bottle: rec.bottle !== undefined ? rec.bottle : null,
        };
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Prices permanently updated',
      prices: finalPrices,
    });
  } catch (error) {
    console.error('Error updating prices:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update prices',
      error: error.message,
    });
  }
};

module.exports = {
  getPrices,
  updatePrices,
};
