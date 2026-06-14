const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  club: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  displayDate: { type: String, required: true },
  status: { type: String, required: true },
  seats: { type: Number, required: true },
  type: { type: String, required: true },
  match: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Event', eventSchema);