const mongoose = require('mongoose');

const threadEntrySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    text: { type: String, required: true }
  },
  { _id: false }
);

const messageThreadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sender: { type: String, required: true },
  preview: { type: String, required: true },
  thread: { type: [threadEntrySchema], default: [] }
});

module.exports = mongoose.model('MessageThread', messageThreadSchema);