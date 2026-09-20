const ProductPrice = require('../models/ProductPrice');
const { DEFAULT_PRODUCTS } = require('../data/products.data');

// Helper to sanitize and validate price values
const validatePrice = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num) || !isFinite(num) || num < 0 || num > 1000000) {
    return null;
  }
  return Math.round(num * 100) / 100; // Round to 2 decimal places
};

// Ensure all products exist in MongoDB collection with human-readable names and default prices
const syncDefaultPrices = async () => {
  try {
    const existingRecords = await ProductPrice.find({}).lean();
    const existingMap = new Map();
    existingRecords.forEach((r) => {
      if (r && r.productId) {
        existingMap.set(r.productId, r);
      }
    });

    const bulkOps = [];

    for (const def of DEFAULT_PRODUCTS) {
      const existing = existingMap.get(def.id);

      if (!existing) {
        // Product is completely missing in database: insert with full details and default prices
        bulkOps.push({
          updateOne: {
            filter: { productId: def.id },
            update: {
              $setOnInsert: {
                productId: def.id,
                nameGu: def.gu || '',
                nameEn: def.en || '',
                category: def.category || '',
                pouch: def.pouch !== undefined ? def.pouch : null,
                bottle: def.bottle !== undefined ? def.bottle : null,
              },
            },
            upsert: true,
          },
        });
      } else if (!existing.nameGu || !existing.nameEn || !existing.category) {
        // Product exists but lacks readable names/category: update metadata only, preserve existing custom prices
        bulkOps.push({
          updateOne: {
            filter: { productId: def.id },
            update: {
              $set: {
                nameGu: def.gu || existing.nameGu || '',
                nameEn: def.en || existing.nameEn || '',
                category: def.category || existing.category || '',
              },
            },
          },
        });
      }
    }

    if (bulkOps.length > 0) {
      await ProductPrice.bulkWrite(bulkOps);
      console.log(`✔ Synced ${bulkOps.length} product records in MongoDB productprices collection.`);
    }
  } catch (err) {
    console.error('Error syncing default product prices:', err.message);
  }
};

// @desc    Get all current product price overrides from database
// @route   GET /api/prices
// @access  Public
const getPrices = async (req, res) => {
  try {
    // Ensure all products exist in database
    await syncDefaultPrices();

    const records = await ProductPrice.find({}).lean();
    const prices = {};

    records.forEach((rec) => {
      if (rec && rec.productId) {
        prices[rec.productId] = {
          pouch: rec.pouch !== undefined ? rec.pouch : null,
          bottle: rec.bottle !== undefined ? rec.bottle : null,
          nameGu: rec.nameGu || '',
          nameEn: rec.nameEn || '',
          category: rec.category || '',
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

    // Map default products for metadata enrichment
    const defaultMap = new Map();
    DEFAULT_PRODUCTS.forEach((p) => defaultMap.set(p.id, p));

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

      const def = defaultMap.get(productId) || {};

      const $set = {
        productId,
        nameGu: priceData.nameGu || def.gu || '',
        nameEn: priceData.nameEn || def.en || '',
        category: priceData.category || def.category || '',
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
          nameGu: rec.nameGu || '',
          nameEn: rec.nameEn || '',
          category: rec.category || '',
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
  syncDefaultPrices,
  getPrices,
  updatePrices,
};
