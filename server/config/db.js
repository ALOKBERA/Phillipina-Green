const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopdb');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Drop the old unique date index if it exists to allow per-user sales separation
    try {
      await mongoose.connection.db.collection('salesrecords').dropIndex('date_1');
      console.log('✔ Dropped legacy date_1 index successfully.');
    } catch (e) {
      // Index might not exist, ignore
    }
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
