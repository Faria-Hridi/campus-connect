const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, async (req, res) => {
  const lostItems = await LostItem.find().lean();
  res.json(lostItems);
});

router.post('/', authenticate, async (req, res) => {
  const { title, location, description } = req.body;
  if (!title || !location) {
    return res.status(400).json({ message: 'Title and location are required.' });
  }

  const item = await LostItem.create({
    id: `lost-${Date.now()}`,
    title,
    location,
    description: description || '',
    status: 'Pending Verification'
  });

  res.status(201).json({ message: 'Lost item report submitted.', item });
});

module.exports = router;
