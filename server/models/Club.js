const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  members: { type: Number, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Club', clubSchema);