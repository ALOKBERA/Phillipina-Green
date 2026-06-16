const mongoose = require('mongoose');

const SalesItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  nameGu: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    enum: ['pouch', 'bottle'],
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  morningQty: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  eveningQty: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  session: {
    type: String,
    enum: ['morning', 'evening'],
    required: true,
  },
});

const SalesRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // format: YYYY-MM-DD
    required: true,
  },
  items: [SalesItemSchema],
  morningTotal: {
    type: Number,
    required: true,
    default: 0,
  },
  eveningTotal: {
    type: Number,
    required: true,
    default: 0,
  },
  grandTotal: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound unique index to restrict to one record per date per user
SalesRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('SalesRecord', SalesRecordSchema);
