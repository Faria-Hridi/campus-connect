import { useEffect, useMemo, useState } from 'react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'browse-clubs', label: 'Browse Clubs' },
  { id: 'events', label: 'Events' },
  { id: 'lost-found', label: 'Lost & Found' },
  { id: 'messages', label: 'Messages' },
  { id: 'profile', label: 'Profile' }
];

const clubCategories = ['All Categories', 'Technical Forum', 'Cultural Team'];
const eventCategories = ['All Categories', 'Workshop / Seminar', 'Competition', 'Cultural / Sports'];
const eventClubs = ['All Clubs', 'Computer Club', 'App Forum'];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [feedItems, setFeedItems] = useState([]);

  const [clubSearch, setClubSearch] = useState('');
  const [clubCategory, setClubCategory] = useState('All Categories');
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [joinFormVisible, setJoinFormVisible] = useState(false);

  const [eventSearch, setEventSearch] = useState('');
  const [eventCategory, setEventCategory] = useState('All Categories');
  const [eventClubFilter, setEventClubFilter] = useState('All Clubs');

  const [activeEventView, setActiveEventView] = useState('discover');
  const [detailEvent, setDetailEvent] = useState(null);
  const [chatText, setChatText] = useState('');

  const [lostTitle, setLostTitle] = useState('');
  const [lostLocation, setLostLocation] = useState('');
  const [lostDesc, setLostDesc] = useState('');

  useEffect(() => {
    fetch('/api/clubs').then(res => res.json()).then(setClubs);
    fetch('/api/events').then(res => res.json()).then(setEvents);
    fetch('/api/events/schedule').then(res => res.json()).then(setSchedule);
    fetch('/api/lost-found').then(res => res.json()).then(setLostItems);
    fetch('/api/messages').then(res => res.json()).then(setMessages);
    fetch('/api/profile').then(res => res.json()).then(setProfile);
    fetch('/api/ping').then(() => {
      setFeedItems([]);
    });
    setFeedItems([
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
    ]);
  }, []);

  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      const matchesCategory = clubCategory === 'All Categories' || club.category === clubCategory;
      const matchesSearch = !clubSearch || club.name.toLowerCase().includes(clubSearch.toLowerCase()) || club.description.toLowerCase().includes(clubSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [clubs, clubCategory, clubSearch]);

  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchesCategory = eventCategory === 'All Categories' || ev.category === eventCategory;
      const matchesClub = eventClubFilter === 'All Clubs' || ev.club.includes(eventClubFilter.replace(' UIU', ''));
      const matchesSearch = !eventSearch || ev.title.toLowerCase().includes(eventSearch.toLowerCase()) || ev.description.toLowerCase().includes(eventSearch.toLowerCase());
      return matchesCategory && matchesClub && matchesSearch;
    });
  }, [events, eventCategory, eventClubFilter, eventSearch]);

  const selectedClub = useMemo(() => clubs.find(club => club.id === selectedClubId), [clubs, selectedClubId]);

  const eventStatus = (status) => {
    if (status === 'confirmed') return { label: 'Confirmed', className: 'success' };
    if (status === 'waitlisted') return { label: 'Waitlisted (Pos: 3)', className: 'warning' };
    return { label: status, className: 'ai' };
  };

  const handleJoinSubmit = () => {
    if (!selectedClub) return;
    alert(`Joined request submitted for ${selectedClub.name}. Our team will verify the transaction details soon.`);
    setJoinFormVisible(false);
  };

  const handleSendMessage = () => {
    if (!chatText.trim()) return;
    setMessages(prev => prev.map((thread, index) => index === 0 ? { ...thread, thread: [...thread.thread, { type: 'outgoing', text: chatText }] } : thread));
    setChatText('');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo" onClick={() => setActiveTab('dashboard')}>Campus<span>Connect</span></div>
        <ul className="nav-links">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button className={activeTab === tab.id ? 'active' : ''} onClick={() => { setActiveTab(tab.id); setActiveEventView('discover'); setJoinFormVisible(false); }}>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <button className="logout-btn">Log Out</button>
      </aside>

      <main className="main-content">
        <section className={activeTab === 'dashboard' ? 'tab-content active' : 'tab-content'}>
          <div className="header"><h1>Welcome back, Shamim</h1><p>Stay updated with your campus activities and events.</p></div>
          <div className="stats-grid">
            <div className="stat-card" onClick={() => setActiveTab('browse-clubs')}><div><span>Joined Clubs</span><h2>3</h2></div><div className="stat-icon bg-blue-light">CLB</div></div>
            <div className="stat-card" onClick={() => setActiveTab('events')}><div><span>Upcoming Events</span><h2>2</h2></div><div className="stat-icon bg-green-light">EVN</div></div>
            <div className="stat-card" onClick={() => setActiveTab('lost-found')}><div><span>Lost & Found</span><h2>1 Pending</h2></div><div className="stat-icon bg-orange-light">LNF</div></div>
          </div>
          <div className="dashboard-grid">
            <div className="feed-section"><h3>Campus Activity Feed</h3>{feedItems.map(feed => (
              <article key={feed.id} className="feed-card"><div className="feed-header"><div><span className="club-title">{feed.title}</span><span className="feed-badge">{feed.badge}</span></div><span className="feed-time">{feed.time}</span></div><div className="feed-body">{feed.body}</div><div className="feed-actions"><button className="action-link">Like ({feed.likes})</button><button className="action-link">Comment ({feed.comments})</button></div></article>
            ))}</div>
            <aside className="side-section"><div className="profile-card"><div className="avatar">S</div><h4>{profile?.name}</h4><p>{profile?.bio}</p><p style={{ fontFamily: 'monospace', fontSize: 11, marginTop: 4 }}>ID: {profile?.studentId}</p><div className="progress-container"><div className="progress-label"><span>Profile Completion</span><span>{profile?.completion}%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: `${profile?.completion}%` }}></div></div></div></div><h3>Quick Actions</h3><div className="list-card"><div className="list-item" onClick={() => setActiveTab('lost-found')}><span>Report Lost Item</span><span>→</span></div><div className="list-item" onClick={() => setActiveTab('browse-clubs')}><span>Browse New Clubs</span><span>→</span></div><div className="list-item" onClick={() => setActiveTab('profile')}><span>Verify Event Certificate</span><span>→</span></div></div><h3>My Achievements</h3><div className="list-card"><div className="list-item"><span>Active Member</span><span className="text-badge badge-gold">Gold Roll</span></div><div className="list-item"><span>Top Volunteer</span><span className="text-badge badge-emerald">Verified</span></div></div></aside>
          </div>
        </section>

        <section className={activeTab === 'browse-clubs' ? 'tab-content active' : 'tab-content'}>
          <div className="header"><h1>Browse University Clubs</h1><p>Explore academic forums, creative leagues, and join the communities that fit your passion.</p></div>
          {!joinFormVisible && <>
            <div className="search-filter-wrapper"><input className="search-input" value={clubSearch} onChange={e => setClubSearch(e.target.value)} placeholder="Search clubs by name or keywords..." /><select className="select-filter" value={clubCategory} onChange={e => setClubCategory(e.target.value)}>{clubCategories.map(category => <option key={category}>{category}</option>)}</select></div>
            <div className="clubs-container-grid">{filteredClubs.map(club => (<article key={club.id} className="club-view-card"><div><div className="club-card-meta"><div><h4 className="club-title">{club.name}</h4><p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Active Members: {club.members}</p></div><span className="club-category-tag">{club.category}</span></div><p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{club.description}</p></div><button className="join-btn-primary" onClick={() => { setSelectedClubId(club.id); setJoinFormVisible(true); }}>Join Club</button></article>))}</div>
          </>}
          {joinFormVisible && selectedClub && <div className="join-form-wrapper"><h2>Join <span>{selectedClub.name}</span></h2><p>Please provide your academic details and complete the registration payment verification.</p><div className="payment-instruction-box"><strong>Official Payment Instructions:</strong><br />Please send the registration fee to the authorized club merchant number: <strong style={{ fontSize: 14, letterSpacing: 1 }}>01711-000000</strong> using your preferred mobile banking method before proceeding.</div><div className="form-grid-layout"><div className="form-element-group"><label>Full Name</label><input type="text" value={profile?.name || ''} readOnly className="readonly-field" /></div><div className="form-element-group"><label>Student ID</label><input type="text" value={profile?.studentId || ''} readOnly className="readonly-field" /></div><div className="form-element-group"><label>Department</label><select defaultValue="CSE"><option value="CSE">Computer Science & Engineering (CSE)</option><option value="EEE">Electrical & Electronic Engineering (EEE)</option><option value="BBA">Business Administration (BBA)</option><option value="CIVIL">Civil Engineering</option></select></div><div className="form-element-group"><label>Contact Number *</label><input type="tel" placeholder="e.g. 01XXXXXXXXX" required /></div><div className="form-element-group"><label>Target Role *</label><select defaultValue="General Member"><option>General Member</option><option>Moderator</option><option>Admin</option></select></div><div className="form-element-group"><label>Payment Method *</label><select defaultValue="bKash"><option>bKash</option><option>Nagad</option><option>Rocket</option></select></div><div className="form-element-group form-full-width"><label>Transaction ID (TrxID) *</label><input type="text" placeholder="Enter your 10-digit transaction ID" style={{ textTransform: 'uppercase' }} required /></div><div className="form-element-group form-full-width"><label>Why do you want to join this club? (Optional)</label><textarea placeholder="Write a short brief about your interest or prior experience..."></textarea></div></div><div className="btn-group"><button className="btn-cancel" onClick={() => setJoinFormVisible(false)}>Cancel</button><button className="submit-action-btn" onClick={handleJoinSubmit}>Submit Verification Request</button></div></div>}
        </section>

        <section className={activeTab === 'events' ? 'tab-content active' : 'tab-content'}>
          <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}><div><h1>Campus Event Hub</h1><p>Discover, register, and track your co-curricular journey with AI-powered suggestions.</p></div><div style={{ display: 'flex', gap: 10 }}><button className={activeEventView === 'discover' ? 'btn-cancel active' : 'btn-cancel'} onClick={() => setActiveEventView('discover')}>Discover Events</button><button className={activeEventView === 'schedule' ? 'btn-cancel active' : 'btn-cancel'} onClick={() => setActiveEventView('schedule')}>My Schedule & Certs</button><button className="submit-action-btn" style={{ background: 'var(--primary)', color: 'white', width: 'auto', padding: '10px 15px' }} onClick={() => setActiveEventView('admin')}>Admin Portal</button></div></div>
          {activeEventView === 'discover' && <div><div className="search-filter-wrapper" style={{ background: 'white', padding: 15, borderRadius: 12, border: '1px solid var(--border-color)' }}><input className="search-input" placeholder="Search events by keyword..." value={eventSearch} onChange={e => setEventSearch(e.target.value)} /><select className="select-filter" value={eventCategory} onChange={e => setEventCategory(e.target.value)}>{eventCategories.map(category => <option key={category}>{category}</option>)}</select><select className="select-filter" value={eventClubFilter} onChange={e => setEventClubFilter(e.target.value)}>{eventClubs.map(club => <option key={club}>{club}</option>)}</select></div><h3 className="section-title" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>Featured & Recommended <span className="status-pill ai" style={{ fontSize: 10 }}>AI Personalized</span></h3><div className="events-grid">{filteredEvents.map(ev => (<article key={ev.id} className="event-card-modern"><div className={`event-banner-img ${ev.category.toLowerCase().includes('competition') ? 'hackathon' : ev.category.toLowerCase().includes('cultural') ? 'cultural' : ''}`}>{ev.title}</div><div className="event-date-badge">{ev.displayDate.split(' ')[0]}<span>{ev.displayDate.split(' ')[1]}</span></div><div className="event-card-body"><div><div className="event-tags-row"><span className="status-pill" style={{ background: '#e0f2fe', color: '#0369a1' }}>{ev.type}</span><span className="status-pill warning">{ev.status === 'Team Reg. Open' ? 'Closing Soon' : ev.match}</span></div><h4 className="event-card-title">{ev.title}</h4><ul className="event-meta-list"><li><span className="event-meta-icon">🏢</span>{ev.club}</li><li><span className="event-meta-icon">📍</span>{ev.location}</li><li><span className="event-meta-icon">🎟️</span>{ev.seats ? `${ev.seats} Seats Available` : 'Team Reg. Open'}</li></ul></div><div className="event-card-footer"><button className="action-link">🔖 Save</button><button className="submit-action-btn" style={{ width: 'auto', padding: '8px 15px', fontSize: 12 }} onClick={() => { setDetailEvent(ev); setActiveEventView('details'); }}>View Details</button></div></div></article>))}</div></div>}
          {activeEventView === 'details' && detailEvent && <div><button className="btn-cancel" style={{ marginBottom: 15, width: 'auto', padding: '8px 15px' }} onClick={() => setActiveEventView('discover')}>&larr; Back to Events</button><div className="event-details-hero"><div className="hero-banner"><div className="hero-content"><div style={{ marginBottom: 10 }}><span className="status-pill success">Registration Open</span><span className="status-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>{detailEvent.type}</span></div><h1 id="detail-title">{detailEvent.title}</h1><p>Organized by {detailEvent.club} | Co-hosted by UIU App Forum</p></div></div><div style={{ background: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}><div style={{ display: 'flex', gap: 30 }}><div><span style={{ fontSize: 11, color: 'var(--text-gray)', display: 'block' }}>Date & Time</span><strong>June 18, 2026 • 10:00 AM</strong></div><div><span style={{ fontSize: 11, color: 'var(--text-gray)', display: 'block' }}>Location</span><strong>{detailEvent.location}</strong></div><div><span style={{ fontSize: 11, color: 'var(--text-gray)', display: 'block' }}>Deadline</span><strong style={{ color: 'var(--danger)' }}>June 16, 2026</strong></div></div><div style={{ display: 'flex', gap: 10 }}><button className="btn-cancel" style={{ width: 'auto' }}>🔔 Notify Me</button><button className="submit-action-btn" style={{ width: 'auto', padding: '10px 25px' }}>1-Click Register</button></div></div></div><div className="details-grid"><div className="detail-panel"><h3 className="section-title">About the Event & Guidelines</h3><p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, marginBottom: 15 }}>{detailEvent.description}<br /><br /><strong>Guidelines:</strong><br />1. Bring your own laptop (fully charged).<br />2. Basic HTML/CSS knowledge is recommended.<br />3. Check-in using your QR code 15 minutes prior to start.</p><h3 className="section-title" style={{ marginTop: 25 }}>Discussion & Q&A Board</h3><div className="list-card" style={{ marginBottom: 0 }}><div className="list-item" style={{ borderBottom: 'none', padding: 0 }}><input type="text" style={{ flex: 1, padding: 10, border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 12, marginRight: 10 }} placeholder="Ask a question about this event..." /><button className="submit-action-btn" style={{ width: 'auto', padding: '10px 15px', fontSize: 12 }}>Post</button></div></div></div><div className="detail-panel"><h3 className="section-title">Media & Resources</h3><ul style={{ listStyle: 'none', fontSize: 13, paddingLeft: 0 }}><li style={{ marginBottom: 10 }}><a href="#" style={{ color: 'var(--primary-accent)', textDecoration: 'none' }}>📄 Download Pre-requisite Guide.pdf</a></li><li style={{ marginBottom: 10 }}><a href="#" style={{ color: 'var(--primary-accent)', textDecoration: 'none' }}>🖼️ View Last Year's Gallery</a></li></ul><h3 className="section-title" style={{ marginTop: 25 }}>Results & Leaderboard</h3><div style={{ background: 'var(--bg-light)', padding: 15, borderRadius: 8, textAlign: 'center', fontSize: 12, color: 'var(--text-gray)' }}>Results will be published here after the event concludes.</div></div></div></div>}
          {activeEventView === 'schedule' && <div className="details-grid" style={{ gridTemplateColumns: '1fr 2fr' }}><div className="detail-panel" style={{ padding: 15 }}><h3 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>My Monthly Calendar<button className="action-link" style={{ fontSize: 11 }}>Export</button></h3><div className="calendar-mockup">[ Interactive Calendar UI View ]<br /><br />Highlighted Dates:<br />Jun 18 - Web Dev Bootcamp<br />Jul 02 - Hackathon</div></div><div><div className="detail-panel" style={{ marginBottom: 20 }}><h3 className="section-title">Active Registrations & QR Passes</h3><table className="generic-data-table"><thead><tr><th>Event Name</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>{schedule.map(item => (<tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.date}</td><td><span className={`status-pill ${eventStatus(item.status).className}`}>{eventStatus(item.status).label}</span></td><td><button className="action-link" style={{ color: 'var(--primary-accent)' }}>{item.action}</button></td></tr>))}</tbody></table></div><div className="detail-panel"><h3 className="section-title">Past Events, Feedback & Certificates</h3><table className="generic-data-table"><thead><tr><th>Event Name</th><th>Attendance</th><th>Actions</th></tr></thead><tbody><tr><td><strong>Cyber Security 101</strong></td><td><span className="status-pill success">100% Verified</span></td><td style={{ display: 'flex', gap: 10 }}><button className="action-link">🏆 Get Cert</button><button className="action-link">⭐ Review</button></td></tr></tbody></table></div></div></div>}
          {activeEventView === 'admin' && <div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}><h2 style={{ fontSize: 20, color: 'var(--primary)' }}>UIU Computer Club - Management Portal</h2><button className="submit-action-btn" style={{ width: 'auto', padding: '10px 20px' }}>+ Create New Event</button></div><div className="admin-stat-row"><div className="stat-card" style={{ padding: 15 }}><div><span>Total Registrations</span><h2 style={{ fontSize: 22 }}>452</h2></div></div><div className="stat-card" style={{ padding: 15 }}><div><span>Avg. Attendance Rate</span><h2 style={{ fontSize: 22 }}>88%</h2></div></div><div className="stat-card" style={{ padding: 15 }}><div><span>Feedback Score</span><h2 style={{ fontSize: 22 }}>4.8/5</h2></div></div><div className="stat-card" style={{ padding: 15 }}><div style={{ textAlign: 'center', width: '100%' }}><span style={{ color: 'var(--primary-accent)', fontWeight: 'bold' }}>[ 📷 Open QR Scanner ]</span><span style={{ marginTop: 5, fontSize: 10, display: 'block' }}>For Live Event Check-in</span></div></div></div><div className="detail-panel"><h3 className="section-title">Manage Hosted Events</h3><table className="generic-data-table"><thead><tr><th>Event Title</th><th>Status</th><th>Capacity Flow</th><th>Management Tools</th></tr></thead><tbody><tr><td>Web Dev Bootcamp</td><td><span className="status-pill success">Published</span></td><td>85 / 100 Seats</td><td><select style={{ padding: 4, fontSize: 11, borderRadius: 4 }}><option value="">Select Action...</option><option>Edit Event</option><option>Manage Attendees</option><option>Generate Certificates</option><option>Analytics Report</option><option>Delete Event</option></select></td></tr><tr><td>App UI/UX Sprint</td><td><span className="status-pill warning">Draft Mode</span></td><td>0 / 50 Seats</td><td><button className="action-link" style={{ color: 'var(--primary-accent)' }}>Continue Editing</button></td></tr></tbody></table></div></div>}
        </section>

        <section className={activeTab === 'lost-found' ? 'tab-content active' : 'tab-content'}>
          <div className="header"><h1>Lost and Found Database</h1><p>Submit declarations for misplaced properties or view unclaimed items recorded on premises.</p></div>
          <div className="split-layout-form"><div className="form-panel"><h4 className="section-title">Report Misplaced Property</h4><div className="form-element-group"><label>Item Classification Title</label><input type="text" value={lostTitle} onChange={e => setLostTitle(e.target.value)} placeholder="e.g., Transparent Plastic Water Bottle" /></div><div className="form-element-group"><label>Recovery / Lost Area Complex</label><input type="text" value={lostLocation} onChange={e => setLostLocation(e.target.value)} placeholder="e.g., Cafeteria Counter West" /></div><div className="form-element-group"><label>Supplementary Description Log</label><textarea value={lostDesc} onChange={e => setLostDesc(e.target.value)} placeholder="State structural markers, color, stickers or identifying tags..."></textarea></div><button className="submit-action-btn" onClick={() => { if (!lostTitle || !lostLocation) return alert('Please fill title and location.'); alert('Database Success: Misplaced item schema reported to general system index framework.'); setLostTitle(''); setLostLocation(''); setLostDesc(''); }}>Broadcast Record to Database</button></div><div><h4 className="section-title">Active Campus Recovery Logs</h4><table className="generic-data-table"><thead><tr><th>Item Specification</th><th>Reported Site</th><th>Status Flag</th></tr></thead><tbody>{lostItems.map(item => (<tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.location}</td><td><span className="status-pill warning">{item.status}</span></td></tr>))}</tbody></table></div></div>
        </section>

        <section className={activeTab === 'messages' ? 'tab-content active' : 'tab-content'}>
          <div className="header"><h1>Communications Engine</h1><p>Send direct sync inquiries to peer networks, mutes, or open feedback loops with club panels.</p></div>
          <div className="chat-app-wrapper"><div className="chat-sidebar-threads">{messages.map(thread => (<div key={thread.id} className={`thread-row ${thread.id === 'msg-1' ? 'active' : ''}`}><h5>{thread.sender}</h5><p>{thread.preview}</p></div>))}</div><div className="chat-window-viewport"><div className="chat-header-banner">UIU Computer Club Board</div><div className="chat-messages-stream">{messages[0]?.thread.map((msg, index) => (<div key={index} className={`bubble-msg ${msg.type === 'outgoing' ? 'outgoing' : 'incoming'}`}>{msg.text}</div>))}</div><div className="chat-input-bar"><input className="chat-text-input" value={chatText} onChange={e => setChatText(e.target.value)} placeholder="Type your payload response structure here..." /><button className="submit-action-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleSendMessage}>Send</button></div></div></div>
        </section>

        <section className={activeTab === 'profile' ? 'tab-content active' : 'tab-content'}>
          <div className="header"><h1>Student Master Identity</h1><p>Manage system metrics, security logs, and cross-examine institutional access scopes.</p></div>
          <div className="profile-extended-grid"><div className="form-panel" style={{ textAlign: 'center' }}><div className="avatar" style={{ width: 80, height: 80, fontSize: 32 }}>S</div><h3>{profile?.name}</h3><p style={{ color: 'var(--text-gray)', fontSize: 13, marginBottom: 15 }}>{profile?.bio}</p><span className="status-pill success" style={{ display: 'inline-block' }}>{profile?.status}</span></div><div className="form-panel"><h4 className="section-title">Institutional Ledger Metrics</h4><div className="form-element-group"><label>Full Assigned Identity String</label><input type="text" value={profile?.name || ''} readOnly style={{ background: '#f1f5f9', color: 'var(--text-gray)' }} /></div><div className="form-element-group"><label>University Core Matrix ID Code</label><input type="text" value={profile?.studentId || ''} readOnly style={{ background: '#f1f5f9', color: 'var(--text-gray)' }} /></div><div className="form-element-group"><label>Registered System Email Node</label><input type="text" value={profile?.email || ''} readOnly style={{ background: '#f1f5f9', color: 'var(--text-gray)' }} /></div></div></div>
        </section>
      </main>
    </div>
  );
}

export default App;
