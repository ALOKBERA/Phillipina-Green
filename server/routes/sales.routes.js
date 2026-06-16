const express = require('express');
const router = express.Router();
const {
  getTodayRecord,
  updateTodayRecord,
  downloadPdf,
  getHistory,
  getDateRecord,
} = require('../controllers/sales.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/today', protect, getTodayRecord);
router.patch('/today', protect, updateTodayRecord);
router.get('/pdf', protect, downloadPdf);
router.get('/history', protect, getHistory);
router.get('/:date', protect, getDateRecord);

module.exports = router;
