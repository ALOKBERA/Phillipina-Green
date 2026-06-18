const SalesRecord = require('../models/SalesRecord');
const { generatePdf } = require('../utils/pdfGenerator');

// Helpers for IST date and session type
const getIstDate = () => {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (3600000 * 5.5)); // UTC+5:30
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const date = String(istDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

const getSessionType = () => {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (3600000 * 5.5));
  const h = istDate.getHours();
  const m = istDate.getMinutes();
  const totalMins = h * 60 + m;

  const OPEN_START = 8 * 60; // 8:00 AM
  const OPEN_END = 21 * 60;  // 9:00 PM

  if (totalMins >= OPEN_START && totalMins < OPEN_END) {
    return totalMins < 13 * 60 ? 'morning' : 'evening';
  }
  return null; // closed
};

const cleanOldHistory = async (userId, today) => {
  try {
    const currentMonthPrefix = today.substring(0, 7); // YYYY-MM
    // Delete any record that doesn't start with the current YYYY-MM
    await SalesRecord.deleteMany({
      userId,
      date: { $not: new RegExp(`^${currentMonthPrefix}`) }
    });
  } catch (error) {
    console.error('Error cleaning old history:', error.message);
  }
};

// @desc    Get today's sales record
// @route   GET /api/sales/today
// @access  Private
const getTodayRecord = async (req, res) => {
  const today = getIstDate();
  await cleanOldHistory(req.user._id, today);

  try {
    let record = await SalesRecord.findOne({ userId: req.user._id, date: today });

    if (!record) {
      record = await SalesRecord.create({
        userId: req.user._id,
        date: today,
        items: [],
        morningTotal: 0,
        eveningTotal: 0,
        grandTotal: 0,
      });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quantity of product in today's record
// @route   PATCH /api/sales/today
// @access  Private
const updateTodayRecord = async (req, res) => {
  const { productId, nameGu, nameEn, variant, unitPrice, quantity, session, flavour } = req.body;
  const today = getIstDate();

  // Validate session (allow override from request body for testing/flexibility)
  const activeSession = session || getSessionType();

  if (!activeSession) {
    return res.status(400).json({
      message: 'Shop is currently closed. Updates are only allowed during session hours.',
    });
  }

  try {
    let record = await SalesRecord.findOne({ userId: req.user._id, date: today });

    if (!record) {
      record = new SalesRecord({
        userId: req.user._id,
        date: today,
        items: [],
        morningTotal: 0,
        eveningTotal: 0,
        grandTotal: 0,
      });
    }

    // Find if item already exists
    const itemIndex = record.items.findIndex(
      (item) => item.productId === productId && item.variant === variant && (item.flavour || '') === (flavour || '')
    );

    if (itemIndex >= 0) {
      const item = record.items[itemIndex];

      if (activeSession === 'morning') {
        item.morningQty = quantity;
      } else if (activeSession === 'evening') {
        if (quantity < item.morningQty) {
          // If total count is corrected below what was sold in the morning
          item.morningQty = quantity;
          item.eveningQty = 0;
        } else {
          item.eveningQty = quantity - item.morningQty;
        }
      }

      item.quantity = item.morningQty + item.eveningQty;
      item.unitPrice = unitPrice;
      item.session = activeSession;

      // Remove from list if total quantity is 0
      if (item.quantity === 0) {
        record.items.splice(itemIndex, 1);
      }
    } else {
      // Create new item if quantity > 0
      if (quantity > 0) {
        const newItem = {
          productId,
          nameGu,
          nameEn,
          variant,
          flavour: flavour || '',
          unitPrice,
          morningQty: activeSession === 'morning' ? quantity : 0,
          eveningQty: activeSession === 'evening' ? quantity : 0,
          quantity,
          session: activeSession,
        };
        record.items.push(newItem);
      }
    }

    // Recalculate session and grand totals
    let morningTotal = 0;
    let eveningTotal = 0;

    record.items.forEach((item) => {
      morningTotal += item.morningQty * item.unitPrice;
      eveningTotal += item.eveningQty * item.unitPrice;
    });

    record.morningTotal = morningTotal;
    record.eveningTotal = eveningTotal;
    record.grandTotal = morningTotal + eveningTotal;

    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download PDF for today's or a specific date's sales record
// @route   GET /api/sales/pdf
// @access  Private
const downloadPdf = async (req, res) => {
  const dateStr = req.query.date || getIstDate();
  const today = getIstDate();
  const currentMonthPrefix = today.substring(0, 7);

  if (!dateStr.startsWith(currentMonthPrefix)) {
    return res.status(403).json({ message: 'Access denied: PDF download is restricted to the current month only.' });
  }

  try {
    const record = await SalesRecord.findOne({ userId: req.user._id, date: dateStr });

    if (!record) {
      return res.status(404).json({ message: `Sales record not found for date ${dateStr}` });
    }

    const doc = generatePdf(record);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=sales-${dateStr}.pdf`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error('PDF Generation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get list of all past sales dates
// @route   GET /api/sales/history
// @access  Private
const getHistory = async (req, res) => {
  const today = getIstDate();
  await cleanOldHistory(req.user._id, today);

  try {
    const records = await SalesRecord.find({ userId: req.user._id })
      .select('date grandTotal morningTotal eveningTotal')
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific date's sales record
// @route   GET /api/sales/:date
// @access  Private
const getDateRecord = async (req, res) => {
  const { date } = req.params;
  const today = getIstDate();
  const currentMonthPrefix = today.substring(0, 7);

  if (!date.startsWith(currentMonthPrefix)) {
    return res.status(403).json({ message: 'Access denied: Historical details are restricted to the current month only.' });
  }

  try {
    const record = await SalesRecord.findOne({ userId: req.user._id, date });

    if (!record) {
      return res.status(404).json({ message: `Sales record not found for ${date}` });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTodayRecord,
  updateTodayRecord,
  downloadPdf,
  getHistory,
  getDateRecord,
};
