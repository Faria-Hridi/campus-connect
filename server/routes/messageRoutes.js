const express = require('express');
const router = express.Router();
const { messages } = require('../data/mockData');

router.get('/', (req, res) => {
  res.json(messages);
});

router.post('/send', (req, res) => {
  const { threadId, text } = req.body;
  if (!threadId || !text) {
    return res.status(400).json({ message: 'threadId and text are required.' });
  }
  res.json({ message: 'Message sent.', threadId, text });
});

module.exports = router;
