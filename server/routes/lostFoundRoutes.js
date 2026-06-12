const express = require('express');
const router = express.Router();
const { lostItems } = require('../data/mockData');

router.get('/', (req, res) => {
  res.json(lostItems);
});

router.post('/', (req, res) => {
  const { title, location, description } = req.body;
  if (!title || !location) {
    return res.status(400).json({ message: 'Title and location are required.' });
  }
  res.status(201).json({ message: 'Lost item report submitted.', title, location, description });
});

module.exports = router;
