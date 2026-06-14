const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Schedule = require('../models/Schedule');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const { category, club, dateRange, search } = req.query;
  const query = {};
  if (category && category !== 'All Categories') query.category = category;
  if (club && club !== 'All Clubs') query.club = club;

  let filtered = await Event.find(query).lean();
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(ev => ev.title.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q));
  }
  res.json(filtered);
});

router.get('/schedule', async (req, res) => {
  const items = await Schedule.find().lean();
  res.json(items);
});

router.get('/:eventId', async (req, res) => {
  const event = await Event.findOne({ id: req.params.eventId }).lean();
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  res.json(event);
});

router.post('/register', authenticate, async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ message: 'Event id is required.' });

  const event = await Event.findOne({ id: eventId }).lean();
  if (!event) return res.status(404).json({ message: 'Event not found.' });

  const scheduleItem = await Schedule.create({
    id: `schedule-${Date.now()}`,
    eventId: event.id,
    title: event.title,
    date: event.displayDate,
    status: 'confirmed',
    action: 'Show QR Pass'
  });

  res.status(201).json({ message: 'Event registration received.', scheduleItem });
});

module.exports = router;
