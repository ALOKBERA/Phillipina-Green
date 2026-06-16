const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function testApi() {
  console.log('--- Verification Script Started ---');
  try {
    // 1. Login
    console.log('Testing Authentication / Login...');
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'yogesh',
      password: 'yogesh@6283'
    });
    
    const token = loginRes.data.token;
    console.log('✔ Login successful. Token received:', token.substring(0, 15) + '...');

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Fetch today's sales record
    console.log('\nFetching today\'s sales record...');
    const todayRes = await axios.get(`${BASE_URL}/api/sales/today`, { headers });
    console.log('✔ Today\'s record retrieved successfully.');
    console.log('Date:', todayRes.data.date);
    console.log('Morning Total:', todayRes.data.morningTotal);
    console.log('Evening Total:', todayRes.data.eveningTotal);
    console.log('Grand Total:', todayRes.data.grandTotal);

    // 3. Update product quantity (Dish Wash - 1 Pouch, price: 30)
    console.log('\nUpdating quantity for dw1 pouch...');
    const patchRes = await axios.patch(`${BASE_URL}/api/sales/today`, {
      productId: 'dw1',
      nameGu: 'ડીશ વોશ - ૧',
      nameEn: 'Dish Wash - 1',
      variant: 'pouch',
      unitPrice: 30,
      quantity: 5,
      session: 'morning' // Force morning session
    }, { headers });
    
    console.log('✔ PATCH update successful.');
    console.log('Updated Morning Total:', patchRes.data.morningTotal);
    console.log('Updated Grand Total:', patchRes.data.grandTotal);
    console.log('Items Count:', patchRes.data.items.length);

    // 4. Update product quantity (Cloth Wash - 1 Pouch, price: 70)
    console.log('\nUpdating quantity for cw1 pouch...');
    const patchRes2 = await axios.patch(`${BASE_URL}/api/sales/today`, {
      productId: 'cw1',
      nameGu: 'કલોથ વોશ - ૧',
      nameEn: 'Cloth Wash - 1',
      variant: 'pouch',
      unitPrice: 70,
      quantity: 3,
      session: 'evening' // Force evening session
    }, { headers });
    
    console.log('✔ PATCH update successful.');
    console.log('Updated Evening Total:', patchRes2.data.eveningTotal);
    console.log('Updated Grand Total:', patchRes2.data.grandTotal);
    console.log('Items Count:', patchRes2.data.items.length);

    // 5. Download EOD PDF Report
    console.log('\nDownloading sales PDF report...');
    const pdfRes = await axios.get(`${BASE_URL}/api/sales/pdf`, {
      headers,
      responseType: 'arraybuffer'
    });
    
    console.log('✔ PDF retrieved. Buffer length:', pdfRes.data.length);
    const pdfPath = path.join(__dirname, 'test-report.pdf');
    fs.writeFileSync(pdfPath, pdfRes.data);
    console.log('✔ PDF saved locally to:', pdfPath);

    console.log('\n--- Verification Script Completed Successfully ---');
  } catch (error) {
    console.error('❌ Verification failed:', error.response?.data || error.message);
  }
}

testApi();
