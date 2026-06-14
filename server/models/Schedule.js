const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  eventId: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  action: { type: String, required: true }
});

module.exports = mongoose.model('Schedule', scheduleSchema);