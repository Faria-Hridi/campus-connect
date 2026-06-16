const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
  clubId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  phone: { type: String, required: true },
  trxId: { type: String, required: true },
  role: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  destination: { type: String, enum: ['club', 'superadmin'], default: 'club' },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JoinRequest', joinRequestSchema);