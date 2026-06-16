const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const JoinRequest = require('../models/JoinRequest');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const { category, search } = req.query;
  const query = {};
  if (category && category !== 'All Categories') {
    query.category = category;
  }

  let filtered = await Club.find(query).lean();
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(club => club.name.toLowerCase().includes(q) || club.description.toLowerCase().includes(q));
  }
  res.json(filtered);
});

router.post('/join', authenticate, async (req, res) => {
  const { clubId, phone, trxId, role, paymentMethod } = req.body;
  if (!clubId || !phone || !trxId || !role || !paymentMethod) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const club = await Club.findOne({ id: clubId }).lean();
  if (!club) {
    return res.status(404).json({ message: 'Club not found.' });
  }

  const destination = ['Moderator', 'Admin'].includes(role) ? 'superadmin' : 'club';

  const joinRequest = await JoinRequest.create({
    clubId,
    userId: req.user._id.toString(),
    userName: req.user.name,
    userEmail: req.user.email,
    phone,
    trxId,
    role,
    paymentMethod,
    destination,
    status: 'pending'
  });

  res.status(201).json({ message: 'Club join request submitted.', joinRequest });
});

module.exports = router;
