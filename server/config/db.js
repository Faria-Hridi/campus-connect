const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const seedDatabase = require('./seedDatabase');

dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-connect';

  try {
    await Promise.race([
      mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB connection timeout')), 6000)
      )
    ]);
    console.log('MongoDB connected successfully.');
    await seedDatabase();
  } catch (error) {
    console.warn('MongoDB connection unavailable:', error.message);
    console.warn('Running in offline mode. Static auth (admin/superadmin) will work. Dynamic user auth may be limited.');
  }
};

module.exports = connectDB;
