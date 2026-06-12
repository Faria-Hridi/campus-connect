const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const clubRoutes = require('./routes/clubRoutes');
const eventRoutes = require('./routes/eventRoutes');
const messageRoutes = require('./routes/messageRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

if (process.env.MONGO_URI) {
  connectDB();
}

app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Campus Connect API is running.' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Campus Connect server listening on port ${PORT}`);
});
