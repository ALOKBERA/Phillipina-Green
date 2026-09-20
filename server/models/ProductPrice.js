const mongoose = require('mongoose');

const ProductPriceSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[a-zA-Z0-9_-]{1,50}$/,
    },
    nameGu: {
      type: String,
      default: '',
      trim: true,
    },
    nameEn: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: '',
      trim: true,
    },
    pouch: {
      type: Number,
      default: null,
      min: 0,
      max: 1000000,
    },
    bottle: {
      type: Number,
      default: null,
      min: 0,
      max: 1000000,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProductPrice', ProductPriceSchema);
