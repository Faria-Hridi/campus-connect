const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },
  description: { type: String, default: '' }
});

module.exports = mongoose.model('LostItem', lostItemSchema);