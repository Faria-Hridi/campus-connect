const express = require('express');
const router = express.Router();
const MessageThread = require('../models/MessageThread');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, async (req, res) => {
  const messages = await MessageThread.find().lean();
  res.json(messages);
});

router.post('/send', authenticate, async (req, res) => {
  const { threadId, text } = req.body;
  if (!threadId || !text) {
    return res.status(400).json({ message: 'threadId and text are required.' });
  }

  const thread = await MessageThread.findOne({ id: threadId });
  if (!thread) return res.status(404).json({ message: 'Thread not found.' });

  thread.thread.push({ type: 'outgoing', text });
  thread.preview = text;
  await thread.save();

  res.json({ message: 'Message sent.', threadId, text });
});

module.exports = router;
