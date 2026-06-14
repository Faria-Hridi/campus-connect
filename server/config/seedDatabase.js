const bcrypt = require('bcryptjs');
const { clubs, events, schedule, lostItems, messages, profile } = require('../data/mockData');
const Club = require('../models/Club');
const Event = require('../models/Event');
const Schedule = require('../models/Schedule');
const LostItem = require('../models/LostItem');
const MessageThread = require('../models/MessageThread');
const Profile = require('../models/Profile');
const User = require('../models/User');

const seedCollection = async (Model, documents) => {
  await Promise.all(
    documents.map(document =>
      Model.updateOne({ id: document.id }, { $setOnInsert: document }, { upsert: true })
    )
  );
};

const seedDatabase = async () => {
  const defaultUsers = [
    {
      name: 'Md. Shamim',
      email: 'mshamim24@student.uiu.ac.bd',
      password: 'Student123!',
      studentId: '0112230207',
      department: 'Computer Science & Engineering (CSE)',
      role: 'student',
      bio: 'Undergraduate Data Pipeline',
      completion: 85,
      achievements: ['Active Member', 'Top Volunteer'],
      status: 'Active Status Nodes'
    },
    {
      name: 'Campus Admin',
      email: 'admin@uiu.ac.bd',
      password: 'Admin123!',
      studentId: '0000000001',
      department: 'Campus Administration',
      role: 'admin',
      bio: 'Campus operations administrator.',
      completion: 100,
      achievements: ['Admin Access'],
      status: 'Admin'
    }
  ];

  const seededUsers = await Promise.all(
    defaultUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10)
    }))
  );

  await Promise.all([
    seedCollection(Club, clubs),
    seedCollection(Event, events),
    seedCollection(Schedule, schedule),
    seedCollection(LostItem, lostItems),
    seedCollection(MessageThread, messages),
    Profile.updateOne({ email: profile.email }, { $setOnInsert: profile }, { upsert: true }),
    Promise.all(seededUsers.map(async (user) => {
      await User.updateOne({ email: user.email }, { $set: user }, { upsert: true });
    }))
  ]);
};

module.exports = seedDatabase;
