const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a daily sales PDF report using pdfkit.
 * @param {Object} record - The SalesRecord database document.
 * @returns {PDFDocument} - The pdfkit document object.
 */
const generatePdf = (record) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  
  const fontPath = path.join(__dirname, '..', 'assets', 'fonts', 'NotoSansGujarati-Regular.ttf');
  const hasFont = fs.existsSync(fontPath);

  if (hasFont) {
    doc.registerFont('Gujarati', fontPath);
  } else {
    console.warn('Gujarati font file not found. Falling back to Helvetica.');
  }

  const guFont = hasFont ? 'Gujarati' : 'Helvetica';
  const enFont = 'Helvetica';
  const enFontBold = 'Helvetica-Bold';

  // --- HEADER SECTION ---
  doc.fillColor('#1a6b2f').fontSize(22).font(guFont).text('અલોક લીક્વિડ શોપ', { align: 'center' });
  
  doc.fillColor('#3a5c44').fontSize(12);
  doc.font(guFont).text('દૈનિક વેચાણ અહેવાલ / ', { align: 'center', continued: true })
     .font(enFontBold).text('Daily Sales Report', { paragraphGap: 10 });
  
  // Decorative separator
  doc.strokeColor('#d4e8da').lineWidth(2).moveTo(50, 105).lineTo(545, 105).stroke();

  // Date Metadata
  doc.fillColor('#0f2d18').fontSize(10);
  const formattedDate = record.date.split('-').reverse().join('/'); // DD/MM/YYYY
  doc.font(guFont).text('તારીખ / ', 50, 120, { continued: true })
     .font(enFont).text(`Date: ${formattedDate}`);
  
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  doc.font(guFont).text('અહેવાલ સમય / ', 380, 120, { continued: true })
     .font(enFont).text(`Generated: ${timeStr}`);

  // --- TABLE HEADER ---
  const tableTop = 150;
  
  // Draw table header background
  doc.rect(50, tableTop, 495, 25).fill('#1a6b2f');
  
  // Header text
  doc.fillColor('#ffffff').fontSize(9);
  doc.font(enFontBold).text('#', 60, tableTop + 8);
  
  doc.font(guFont).text('ઉત્પાદન નામ / ', 90, tableTop + 8, { continued: true })
     .font(enFontBold).text('Product Description');
     
  doc.font(guFont).text('પ્રકાર / ', 310, tableTop + 8, { continued: true })
     .font(enFontBold).text('Type');
     
  doc.font(guFont).text('નંગ / ', 370, tableTop + 8, { continued: true })
     .font(enFontBold).text('Qty');
     
  doc.font(guFont).text('ભાવ / ', 420, tableTop + 8, { continued: true })
     .font(enFontBold).text('Rate');
     
  doc.font(guFont).text('કુલ / ', 490, tableTop + 8, { continued: true })
     .font(enFontBold).text('Total');

  // --- TABLE ROWS ---
  let yPosition = tableTop + 25;

  record.items.forEach((item, index) => {
    // Draw subtle row bottom border
    doc.strokeColor('#f0f0f0').lineWidth(1).moveTo(50, yPosition + 25).lineTo(545, yPosition + 25).stroke();
    
    // Alt row background
    if (index % 2 === 1) {
      doc.rect(50, yPosition + 1, 495, 23).fill('#f9fbf9');
    }

    doc.fillColor('#0f2d18').fontSize(9);
    
    // Row Index
    doc.font(guFont).text(index + 1, 60, yPosition + 8);
    
    // Product Name (Gujarati + English translation for clarity)
    doc.font(guFont).text(item.nameGu + ' ', 90, yPosition + 8, { width: 210, height: 16, ellipsis: true, continued: true })
       .font(enFont).text(`(${item.nameEn})`);
    
    // Variant Label
    if (item.variant === 'pouch') {
      doc.font(guFont).text('પાઉચ ', 310, yPosition + 8, { continued: true })
         .font(enFont).text('(Pouch)');
    } else {
      doc.font(guFont).text('બોટલ ', 310, yPosition + 8, { continued: true })
         .font(enFont).text('(Bottle)');
    }
    
    // Qty
    doc.font(guFont).text(item.quantity.toString(), 370, yPosition + 8, { width: 30, align: 'center' });
    
    // Rate
    doc.font(guFont).text(`₹${item.unitPrice}`, 420, yPosition + 8);
    
    // Subtotal
    const itemSubtotal = item.quantity * item.unitPrice;
    doc.font(guFont).text(`₹${itemSubtotal}`, 490, yPosition + 8);

    yPosition += 25;
  });

  // --- SESSION BREAKDOWNS ---
  yPosition += 15;
  doc.strokeColor('#1a6b2f').lineWidth(1.5).moveTo(50, yPosition).lineTo(545, yPosition).stroke();
  yPosition += 10;

  // Morning Total Row
  doc.fillColor('#3a5c44').fontSize(10);
  doc.font(guFont).text('સવારનું સત્ર વેચાણ / ', 260, yPosition, { continued: true })
     .font(enFont).text('Morning Session Total:');
  doc.font(guFont).fontSize(11).text(`₹${record.morningTotal}`, 480, yPosition, { align: 'right', width: 65 });

  yPosition += 20;

  // Evening Total Row
  doc.fillColor('#3a5c44').fontSize(10);
  doc.font(guFont).text('સાંજનું સત્ર વેચાણ / ', 260, yPosition, { continued: true })
     .font(enFont).text('Evening Session Total:');
  doc.font(guFont).fontSize(11).text(`₹${record.eveningTotal}`, 480, yPosition, { align: 'right', width: 65 });

  yPosition += 25;

  // --- GRAND TOTAL BOX ---
  doc.rect(250, yPosition, 295, 35).fill('#e8f5ec');
  doc.strokeColor('#1a6b2f').lineWidth(1.5).rect(250, yPosition, 295, 35).stroke();

  doc.fillColor('#1a6b2f').fontSize(11);
  doc.font(guFont).text('ગ્રાન્ડ ટોટલ / ', 265, yPosition + 12, { continued: true })
     .font(enFontBold).text('GRAND TOTAL:');
  doc.font(guFont).fontSize(14).text(`₹${record.grandTotal}`, 450, yPosition + 10, { align: 'right', width: 85 });

  // --- FOOTER SECTION ---
  doc.fillColor('#6b8f77').fontSize(8);
  doc.font(guFont).text('આ અહેવાલ કોમ્પ્યુટર દ્વારા જનરેટ કરવામાં આવ્યો છે.', 50, 750, { align: 'center' });
  doc.font(enFont).text('Powered by Alok Liquid Shop Daily Sales Tracker.', 50, 762, { align: 'center' });

  return doc;
};

module.exports = { generatePdf };
