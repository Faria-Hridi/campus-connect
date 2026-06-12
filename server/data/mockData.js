const clubs = [
  {
    id: 'club-1',
    name: 'UIU Computer Club',
    category: 'Technical Forum',
    members: 342,
    description: 'Core hub for programming workshops, software engineering meetups, and algorithmic development bootcamps.'
  },
  {
    id: 'club-2',
    name: 'UIU Cultural Club',
    category: 'Cultural Team',
    members: 198,
    description: 'Organizes theater showcases, annual music festivals, art exhibitions, and talent scouting across departments.'
  },
  {
    id: 'club-3',
    name: 'UIU App Forum',
    category: 'Technical Forum',
    members: 215,
    description: 'Focused on mobile application development, UI/UX design sprints, and participating in national hackathons.'
  }
];

const events = [
  {
    id: 'event-1',
    title: 'Advanced Web Development Bootcamp',
    category: 'Workshop',
    club: 'UIU Computer Club',
    location: 'Main Lab 03',
    date: '2026-06-18',
    displayDate: '18 Jun',
    status: 'Registration Open',
    seats: 15,
    type: 'Workshop',
    match: 'AI Personalized',
    description: 'Join us for an intensive 2-day bootcamp covering modern full-stack web development with React, Node.js, and MongoDB.'
  },
  {
    id: 'event-2',
    title: 'National Tech Hackathon 2026',
    category: 'Competition',
    club: 'UIU App Forum',
    location: 'Central Pavilion',
    date: '2026-07-02',
    displayDate: '02 Jul',
    status: 'Team Reg. Open',
    seats: 0,
    type: 'Competition',
    match: '98% Match',
    description: 'Compete with cross-campus teams in a national-level hackathon featuring live pitching and mentorship sessions.'
  },
  {
    id: 'event-3',
    title: 'Annual Spring Fest Gala 2026',
    category: 'Cultural Event',
    club: 'UIU Cultural Club',
    location: 'Open Auditorium',
    date: '2026-08-15',
    displayDate: '15 Aug',
    status: 'Open to All',
    seats: 0,
    type: 'Cultural',
    match: 'Popular Choice',
    description: 'Celebrate the end of the semester with performances, exhibitions, and creative showcases from campus clubs.'
  }
];

const schedule = [
  {
    id: 'schedule-1',
    eventId: 'event-1',
    title: 'Web Dev Bootcamp',
    date: 'Jun 18, 2026',
    status: 'confirmed',
    action: 'Show QR Pass'
  },
  {
    id: 'schedule-2',
    eventId: 'event-4',
    title: 'AI Seminar Series',
    date: 'Jun 25, 2026',
    status: 'waitlisted',
    action: 'Cancel'
  }
];

const lostItems = [
  {
    id: 'lost-1',
    title: 'Black Leather Wallet containing ID card',
    location: 'Library Room 2B',
    status: 'Pending Verification'
  }
];

const messages = [
  {
    id: 'msg-1',
    sender: 'UIU Computer Club Board',
    preview: 'Web Development Workshop certificates data stream confirmation update...',
    thread: [
      { type: 'incoming', text: 'Hello Shamim, your application framework profile has been successfully evaluated.' },
      { type: 'outgoing', text: 'Thank you! Please let me know the status of my Moderator request submission timeline.' },
      { type: 'incoming', text: 'Super Admin accounts process executive requests directly. Keep reviewing your profile alerts tab.' }
    ]
  },
  {
    id: 'msg-2',
    sender: 'Admin Desk Help Loop',
    preview: 'Your support ticket ref id #9923 is solved.',
    thread: []
  }
];

const profile = {
  name: 'Md. Shamim',
  studentId: '0112230207',
  department: 'Computer Science & Engineering (CSE)',
  email: 'mshamim24@student.uiu.ac.bd',
  bio: 'Undergraduate Data Pipeline',
  completion: 85,
  achievements: ['Active Member', 'Top Volunteer'],
  status: 'Active Status Nodes'
};

const feedItems = [
  {
    id: 'feed-1',
    title: 'UIU Computer Club',
    badge: 'Announcement',
    time: '2 hours ago',
    body: 'Don\'t forget to register for the upcoming Web Development Workshop! Registration closes in 2 days. Certificates will be provided to all attendees.',
    likes: 24,
    comments: 5
  },
  {
    id: 'feed-2',
    title: 'UIU App Forum',
    badge: 'Event Highlight',
    time: 'Yesterday',
    body: 'A huge congratulations to our team for winning the Hackathon! Check out the photo gallery from the event on our club page.',
    likes: 56,
    comments: 12
  }
];

module.exports = {
  clubs,
  events,
  schedule,
  lostItems,
  messages,
  profile,
  feedItems
};
