const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

// 1. Download font from Google Fonts raw url
async function downloadFont() {
  const fontDir = path.join(__dirname, 'assets', 'fonts');
  if (!fs.existsSync(fontDir)) {
    fs.mkdirSync(fontDir, { recursive: true });
  }

  const fontPath = path.join(fontDir, 'NotoSansGujarati-Regular.ttf');
  if (fs.existsSync(fontPath)) {
    console.log('✔ Noto Sans Gujarati font already exists.');
    return;
  }

  console.log('Downloading Gujarati font (NotoSansGujarati-Regular.ttf)...');
  const url = 'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansGujarati/NotoSansGujarati-Regular.ttf';
  
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(fontPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log('✔ Noto Sans Gujarati font downloaded successfully.');
  } catch (err) {
    console.error('❌ Error downloading font:', err.message);
    console.log('⚠️ PDF generation will fallback to Helvetica if font download fails.');
  }
}

// 2. Seed default shopkeeper users
async function seedUsers() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopdb';

  // DEFINE YOUR USER ACCOUNTS HERE:
  const usersToSeed = [
    { username: 'yogesh', password: 'yogesh@6283' }
  ];

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clean up old legacy shopkeeper user if it exists
    await User.deleteOne({ username: 'shopkeeper' });

    for (const u of usersToSeed) {
      const userExist = await User.findOne({ username: u.username });
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(u.password, salt);

      if (userExist) {
        userExist.passwordHash = passwordHash;
        await userExist.save();
        console.log(`✔ User "${u.username}" updated with current password.`);
      } else {
        console.log(`Creating user "${u.username}"...`);
        await User.create({
          username: u.username,
          passwordHash,
        });
        console.log(`✔ User "${u.username}" created.`);
      }
    }
  } catch (error) {
    console.error('❌ Database seeding error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

async function runSeeder() {
  console.log('--- Starting Seeder Script ---');
  await downloadFont();
  await seedUsers();
  console.log('--- Seeder Script Complete ---');
}

runSeeder();
