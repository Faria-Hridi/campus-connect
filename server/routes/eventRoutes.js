const express = require('express');
const router = express.Router();
const { events, schedule } = require('../data/mockData');

router.get('/', (req, res) => {
  const { category, club, dateRange, search } = req.query;
  let filtered = events;
  if (category && category !== 'All Categories') filtered = filtered.filter(ev => ev.category === category);
  if (club && club !== 'All Clubs') filtered = filtered.filter(ev => ev.club === club);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(ev => ev.title.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q));
  }
  res.json(filtered);
});

router.get('/schedule', (req, res) => {
  res.json(schedule);
});

router.get('/:eventId', (req, res) => {
  const event = events.find(ev => ev.id === req.params.eventId);
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  res.json(event);
});

router.post('/register', (req, res) => {
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ message: 'Event id is required.' });
  res.json({ message: 'Event registration received.', eventId });
});

module.exports = router;
