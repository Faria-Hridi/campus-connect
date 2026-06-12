const express = require('express');
const router = express.Router();
const { clubs } = require('../data/mockData');

router.get('/', (req, res) => {
  const { category, search } = req.query;
  let filtered = clubs;
  if (category && category !== 'All Categories') {
    filtered = filtered.filter(club => club.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(club => club.name.toLowerCase().includes(q) || club.description.toLowerCase().includes(q));
  }
  res.json(filtered);
});

router.post('/join', (req, res) => {
  const { clubId, phone, trxId, role, paymentMethod } = req.body;
  if (!clubId || !phone || !trxId || !role || !paymentMethod) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  res.json({ message: 'Club join request submitted.', clubId, phone, trxId, role, paymentMethod });
});

module.exports = router;
