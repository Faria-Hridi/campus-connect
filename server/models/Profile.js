const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, required: true },
  completion: { type: Number, required: true },
  achievements: { type: [String], default: [] },
  status: { type: String, required: true }
});

module.exports = mongoose.model('Profile', profileSchema);