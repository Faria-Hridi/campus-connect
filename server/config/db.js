const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const seedDatabase = require('./seedDatabase');

dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-connect';

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully.');
    await seedDatabase();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
