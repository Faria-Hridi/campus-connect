import { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'browse-clubs', label: 'Browse Clubs' },
  { id: 'events', label: 'Events' },
  { id: 'lost-found', label: 'Lost & Found' },
  { id: 'messages', label: 'Messages' },
  { id: 'profile', label: 'Profile' }
];

const clubCategories = ['All Categories', 'Technical Forum', 'Cultural Team'];
const eventCategories = ['All Categories', 'Workshop', 'Competition', 'Cultural Event'];
const eventClubs = ['All Clubs', 'Computer Club', 'App Forum'];

function App() {
  const [token, setToken] = useState(localStorage.getItem('campus_token') || '');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [eventView, setEventView] = useState('discover');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [currentClub, setCurrentClub] = useState('');
  const [authMode, setAuthMode] = useState('login');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedItems, setFeedItems] = useState([]);

  const [clubSearch, setClubSearch] = useState('');
  const [clubCategory, setClubCategory] = useState('All Categories');
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategory, setEventCategory] = useState('All Categories');
  const [eventClubFilter, setEventClubFilter] = useState('All Clubs');
  const [chatText, setChatText] = useState('');
  const [lostTitle, setLostTitle] = useState('');
  const [lostLocation, setLostLocation] = useState('');
  const [lostDesc, setLostDesc] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupStudentId, setSignupStudentId] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('CSE');

  const [joinPhone, setJoinPhone] = useState('');
  const [joinTrx, setJoinTrx] = useState('');
  const [joinRole, setJoinRole] = useState('General Member');
  const [joinDept, setJoinDept] = useState('CSE');

  useEffect(() => {
    setFeedItems([
      {
        id: 'feed-1',
        title: 'UIU Computer Club',
        badge: 'Announcement',
        time: '2 hours ago',
        body: "Don't forget to register for the upcoming Web Development Workshop! Registration closes in 2 days.",
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

  useEffect(() => {
    if (!token) return;
    localStorage.setItem('campus_token', token);
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (!user) return;
    loadAppData();
  }, [user]);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Unable to fetch profile.');
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setError('Session expired. Please log in again.');
      setToken('');
      localStorage.removeItem('campus_token');
    } finally {
      setLoading(false);
    }
  };

  const loadAppData = async () => {
    try {
      const [clubsRes, eventsRes, lostRes, messagesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/clubs`),
        fetch(`${API_BASE_URL}/api/events`),
        fetch(`${API_BASE_URL}/api/lost-found`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/messages`, { headers: getAuthHeaders() })
      ]);

      if (clubsRes.ok) setClubs(await clubsRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (lostRes.ok) setLostItems(await lostRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
    } catch (err) {
      console.error('Load app data failed', err);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed.');
      setToken(data.token);
      setUser(data.user);
      setLoginEmail('');
      setLoginPassword('');
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          studentId: signupStudentId,
          department: signupDepartment,
          role: 'student'
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed.');
      setToken(data.token);
      setUser(data.user);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupStudentId('');
      setSignupDepartment('CSE');
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('campus_token');
    setActiveTab('dashboard');
  };

  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      const matchesCategory = clubCategory === 'All Categories' || club.category === clubCategory;
      const matchesSearch =
        !clubSearch ||
        club.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
        club.description.toLowerCase().includes(clubSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [clubs, clubCategory, clubSearch]);

  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchesCategory = eventCategory === 'All Categories' || ev.category === eventCategory;
      const matchesClub = eventClubFilter === 'All Clubs' || ev.club === eventClubFilter || ev.club.includes(eventClubFilter);
      const matchesSearch =
        !eventSearch ||
        ev.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        ev.description.toLowerCase().includes(eventSearch.toLowerCase());
      return matchesCategory && matchesClub && matchesSearch;
    });
  }, [events, eventCategory, eventClubFilter, eventSearch]);

  const openJoinForm = (clubName) => {
    setShowJoinForm(true);
    setCurrentClub(clubName);
    setJoinPhone('');
    setJoinTrx('');
    setJoinRole('General Member');
    setJoinDept('CSE');
  };

  const closeJoinForm = () => {
    setShowJoinForm(false);
    setCurrentClub('');
    setJoinPhone('');
    setJoinTrx('');
    setJoinRole('General Member');
    setJoinDept('CSE');
  };

  const submitJoinRequest = () => {
    if (!joinPhone.trim() || !joinTrx.trim()) {
      alert('Please provide both your Contact Number and Transaction ID before submitting.');
      return;
    }
    alert(`Club join request submitted for ${currentClub}.\nRole: ${joinRole}\nDept: ${joinDept}\nTransaction: ${joinTrx}`);
    closeJoinForm();
  };

  const switchEventView = (view, event = null) => {
    setEventView(view);
    if (event) setSelectedEvent(event);
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setEventView('details');
  };

  const renderEventDetailHero = (event) => {
    if (!event) return null;
    const statusClass = event.status && event.status.toLowerCase().includes('open') ? 'success' : 'warning';
    return (
      <div className="event-details-hero">
        <div className="hero-banner">
          <div className="hero-content">
            <div style={{ marginBottom: 10 }}>
              <span className={`status-pill ${statusClass}`}>{event.status}</span>
              <span className="status-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginLeft: 10 }}>
                {event.type}
              </span>
            </div>
            <h1 id="detail-title">{event.title}</h1>
            <p>{`Organized by ${event.club} | Co-hosted by UIU App Forum`}</p>
          </div>
        </div>
        <div style={{ background: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: 30 }}>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-gray)', display: 'block' }}>Date & Time</span>
              <strong>{event.date} • 10:00 AM</strong>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-gray)', display: 'block' }}>Location</span>
              <strong>{event.location || 'Main Lab 03'}</strong>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-gray)', display: 'block' }}>Deadline</span>
              <strong style={{ color: 'var(--danger)' }}>June 16, 2026</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-cancel" style={{ width: 'auto' }} onClick={() => alert('Reminder set. We will notify you 24 hours before the event.')}>Notify Me</button>
            <button className="submit-action-btn" style={{ width: 'auto', padding: '10px 25px' }} onClick={() => alert('1-Click Register successful!')}>1-Click Register</button>
          </div>
        </div>
      </div>
    );
  };

  const authView = (
    <div className="auth-shell">
      <section className="auth-panel">
        <h1>{authMode === 'login' ? 'Sign in to Campus Connect' : 'Create your Campus account'}</h1>
        <p>Use your student credentials or signup with a new account.</p>
        {error && <div className="error-box">{error}</div>}
        {authMode === 'login' ? (
          <>
            <label>Email address</label>
            <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="student@uiu.ac.bd" />
            <label>Password</label>
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" />
            <button className="submit-action-btn" onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <p className="auth-switch">
              New to Campus Connect?{' '}
              <button type="button" className="action-link" onClick={() => { setAuthMode('signup'); setError(''); }}>
                Create account
              </button>
            </p>
          </>
        ) : (
          <>
            <label>Full name</label>
            <input value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="Md. Shamim" />
            <label>Email address</label>
            <input value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="student@uiu.ac.bd" />
            <label>Password</label>
            <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Choose a password" />
            <label>Student ID</label>
            <input value={signupStudentId} onChange={(e) => setSignupStudentId(e.target.value)} placeholder="0112230207" />
            <label>Department</label>
            <select value={signupDepartment} onChange={(e) => setSignupDepartment(e.target.value)}>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="BBA">BBA</option>
              <option value="CIVIL">CIVIL</option>
            </select>
            <button className="submit-action-btn" onClick={handleSignup} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <p className="auth-switch">
              Already registered?{' '}
              <button type="button" className="action-link" onClick={() => { setAuthMode('login'); setError(''); }}>
                Sign in
              </button>
            </p>
          </>
        )}
      </section>
    </div>
  );

  if (!token || !user) return authView;

  const activeEvent = selectedEvent || events[0] || {
    title: 'Advanced Web Development Bootcamp',
    date: 'Jun 18, 2026',
    location: 'Main Lab 03',
    status: 'Registration Open',
    description: 'Join us for an intensive 2-day bootcamp covering modern full-stack web development.',
    club: 'UIU Computer Club',
    displayDate: '18 Jun',
    type: 'Workshop'
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo" onClick={() => { setActiveTab('dashboard'); setEventView('discover'); }}>
          Campus<span>Connect</span>
        </div>
        <ul className="nav-links">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button className={activeTab === tab.id ? 'active' : ''} onClick={() => { setActiveTab(tab.id); if (tab.id === 'events') setEventView('discover'); }}>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </aside>

      <main className="main-content">
        <section className={activeTab === 'dashboard' ? 'tab-content active' : 'tab-content'}>
          <div className="header">
            <h1>Welcome back, {user.name}</h1>
            <p>Stay updated with your campus activities and events.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card" onClick={() => setActiveTab('browse-clubs')}>
              <div>
                <span>Joined Clubs</span>
                <h2>3</h2>
              </div>
              <div className="stat-icon bg-blue-light">CLB</div>
            </div>
            <div className="stat-card" onClick={() => setActiveTab('events')}>
              <div>
                <span>Upcoming Events</span>
                <h2>2</h2>
              </div>
              <div className="stat-icon bg-green-light">EVN</div>
            </div>
            <div className="stat-card" onClick={() => setActiveTab('lost-found')}>
              <div>
                <span>Lost & Found</span>
                <h2>1 Pending</h2>
              </div>
              <div className="stat-icon bg-orange-light">LNF</div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="feed-section">
              <h3>Campus Activity Feed</h3>
              {feedItems.map((feed) => (
                <article key={feed.id} className="feed-card">
                  <div className="feed-header">
                    <div>
                      <span className="club-title">{feed.title}</span>
                      <span className="feed-badge">{feed.badge}</span>
                    </div>
                    <span className="feed-time">{feed.time}</span>
                  </div>
                  <div className="feed-body">{feed.body}</div>
                  <div className="feed-actions">
                    <button className="action-link" onClick={() => alert('Liked!')}>Like ({feed.likes})</button>
                    <button className="action-link" onClick={() => setActiveTab('messages')}>Comment ({feed.comments})</button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="side-section">
              <div className="profile-card">
                <div className="avatar">{user.name.slice(0, 1)}</div>
                <h4>{user.name}</h4>
                <p>{user.department}</p>
                <p style={{ fontFamily: 'monospace', fontSize: 11, marginTop: 4 }}>ID: {user.studentId}</p>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Profile Completion</span>
                    <span>{user.completion}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${user.completion}%` }} />
                  </div>
                </div>
              </div>

              <h3>Quick Actions</h3>
              <div className="list-card">
                <div className="list-item" onClick={() => setActiveTab('lost-found')}><span>Report Lost Item</span></div>
                <div className="list-item" onClick={() => setActiveTab('browse-clubs')}><span>Browse New Clubs</span></div>
                <div className="list-item" onClick={() => setActiveTab('profile')}><span>Verify Event Certificate</span></div>
              </div>

              <h3>My Achievements</h3>
              <div className="list-card">
                <div className="list-item"><span>Active Member</span><span className="text-badge badge-gold">Gold Roll</span></div>
                <div className="list-item"><span>Top Volunteer</span><span className="text-badge badge-emerald">Verified</span></div>
              </div>
            </aside>
          </div>
        </section>

        <section className={activeTab === 'browse-clubs' ? 'tab-content active' : 'tab-content'}>
          <div className="header">
            <h1>Browse University Clubs</h1>
            <p>Explore academic forums, creative leagues, and join the communities that fit your passion.</p>
          </div>

          {showJoinForm ? (
            <div id="club-join-form-view">
              <div className="header">
                <h1>Club Registration</h1>
                <p>Complete the secure form below to submit your joining request.</p>
              </div>

              <div className="join-form-wrapper">
                <h2>Join <span>{currentClub}</span></h2>
                <p>Please provide your academic details and complete the registration payment verification.</p>

                <div className="payment-instruction-box">
                  <strong>Official Payment Instructions:</strong><br />
                  Please send the registration fee to the authorized club merchant number: <strong style={{ fontSize: 14, letterSpacing: 1 }}>01711-000000</strong> using your preferred mobile banking method before proceeding.
                </div>

                <div className="form-grid-layout">
                  <div className="form-element-group">
                    <label>Full Name</label>
                    <input type="text" value={user.name} readOnly className="readonly-field" />
                  </div>
                  <div className="form-element-group">
                    <label>Student ID</label>
                    <input type="text" value={user.studentId} readOnly className="readonly-field" />
                  </div>

                  <div className="form-element-group">
                    <label>Department</label>
                    <select value={joinDept} onChange={(e) => setJoinDept(e.target.value)}>
                      <option value="CSE">Computer Science & Engineering (CSE)</option>
                      <option value="EEE">Electrical & Electronic Engineering (EEE)</option>
                      <option value="BBA">Business Administration (BBA)</option>
                      <option value="CIVIL">Civil Engineering</option>
                    </select>
                  </div>
                  <div className="form-element-group">
                    <label>Contact Number *</label>
                    <input type="tel" value={joinPhone} onChange={(e) => setJoinPhone(e.target.value)} placeholder="e.g. 01XXXXXXXXX" />
                  </div>

                  <div className="form-element-group">
                    <label>Target Role *</label>
                    <select value={joinRole} onChange={(e) => setJoinRole(e.target.value)}>
                      <option value="General Member">General Member</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-element-group">
                    <label>Payment Method *</label>
                    <select>
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                    </select>
                  </div>

                  <div className="form-element-group form-full-width">
                    <label>Transaction ID (TrxID) *</label>
                    <input type="text" style={{ textTransform: 'uppercase' }} value={joinTrx} onChange={(e) => setJoinTrx(e.target.value)} placeholder="Enter your 10-digit transaction ID" />
                  </div>

                  <div className="form-element-group form-full-width">
                    <label>Why do you want to join this club? (Optional)</label>
                    <textarea placeholder="Write a short brief about your interest or prior experience..." />
                  </div>
                </div>

                <div className="btn-group">
                  <button className="btn-cancel" onClick={closeJoinForm}>Cancel</button>
                  <button className="submit-action-btn" onClick={submitJoinRequest}>Submit Verification Request</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="search-filter-wrapper">
                <input className="search-input" value={clubSearch} onChange={(e) => setClubSearch(e.target.value)} placeholder="Search clubs by name or keywords..." />
                <select className="select-filter" value={clubCategory} onChange={(e) => setClubCategory(e.target.value)}>
                  {clubCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </div>
              <div className="clubs-container-grid">
                {filteredClubs.map((club) => (
                  <div key={club.id} className="club-view-card">
                    <div>
                      <div className="club-card-meta">
                        <div>
                          <h4 className="club-title">{club.name}</h4>
                          <p style={{ fontSize: 12, color: 'var(--text-gray)', marginTop: 2 }}>Active Members: {club.members}</p>
                        </div>
                        <span className="club-category-tag">{club.category}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{club.description}</p>
                    </div>
                    <button className="join-btn-primary" onClick={() => openJoinForm(club.name)}>Join Club</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className={activeTab === 'events' ? 'tab-content active' : 'tab-content'}>
          <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h1>Campus Event Hub</h1>
              <p>Discover, register, and track your co-curricular journey with AI-powered suggestions.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className={`btn-cancel ${eventView === 'discover' ? 'active' : ''}`} style={eventView === 'discover' ? { background: '#e2e8f0' } : {}} onClick={() => switchEventView('discover')}>Discover Events</button>
              <button className={`btn-cancel ${eventView === 'schedule' ? 'active' : ''}`} style={eventView === 'schedule' ? { background: '#e2e8f0' } : {}} onClick={() => switchEventView('schedule')}>My Schedule & Certs</button>
              <button className="submit-action-btn" style={{ background: 'var(--primary)', color: 'white', width: 'auto', padding: '10px 15px' }} onClick={() => switchEventView('admin')}>Admin Portal</button>
            </div>
          </div>

          {eventView === 'discover' && (
            <>
              <div className="search-filter-wrapper" style={{ background: 'white', padding: 15, borderRadius: 12, border: '1px solid var(--border-color)' }}>
                <input className="search-input" placeholder="Search events by keyword..." value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} />
                <select className="select-filter" value={eventCategory} onChange={(e) => setEventCategory(e.target.value)}>
                  {eventCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
                <select className="select-filter" value={eventClubFilter} onChange={(e) => setEventClubFilter(e.target.value)}>
                  {eventClubs.map((club) => <option key={club}>{club}</option>)}
                </select>
                <select className="select-filter">
                  <option>Date: Anytime</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>

              <h3 className="section-title" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                Featured & Recommended
                <span className="status-pill ai" style={{ fontSize: 10 }}>AI Personalized</span>
              </h3>

              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="event-card-modern">
                    <div className={`event-banner-img ${event.type?.toLowerCase().includes('hackathon') ? 'hackathon' : event.type?.toLowerCase().includes('cultural') ? 'cultural' : ''}`}>
                      {event.title}
                      <div className="event-date-badge">{event.displayDate || event.date.split(' ')[1]}<span>{event.date.split(',')[0].split(' ')[0]}</span></div>
                    </div>
                    <div className="event-card-body">
                      <div>
                        <div className="event-tags-row">
                          <span className="status-pill" style={{ background: '#e0f2fe', color: '#0369a1' }}>{event.type}</span>
                          <span className="status-pill warning">{event.status}</span>
                        </div>
                        <h4 className="event-card-title">{event.title}</h4>
                        <ul className="event-meta-list">
                          <li><strong>Organizer:</strong> {event.club}</li>
                          <li><strong>Location:</strong> {event.location || 'Main Lab 03'}</li>
                          <li><strong>Capacity:</strong> {event.seats || 15} seats available</li>
                        </ul>
                      </div>
                      <div className="event-card-footer">
                        <button className="action-link" onClick={() => alert('Added to your watchlist!')}>Save</button>
                        <button className="submit-action-btn" style={{ width: 'auto', padding: '8px 15px', fontSize: 12 }} onClick={() => openEventDetails(event)}>View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {eventView === 'details' && (
            <>
              <button className="btn-cancel" style={{ marginBottom: 15, width: 'auto', padding: '8px 15px' }} onClick={() => switchEventView('discover')}>&larr; Back to Events</button>
              {renderEventDetailHero(activeEvent)}
              <div className="details-grid">
                <div className="detail-panel">
                  <h3 className="section-title">About the Event & Guidelines</h3>
                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, marginBottom: 15 }}>
                    Join us for an intensive 2-day bootcamp covering modern full-stack web development. Learn React, Node.js, and MongoDB from industry experts. <br /><br />
                    <strong>Guidelines:</strong><br />
                    1. Bring your own laptop (fully charged).<br />
                    2. Basic HTML/CSS knowledge is recommended.<br />
                    3. Check-in using your QR code 15 minutes prior to start.
                  </p>
                  <h3 className="section-title" style={{ marginTop: 25 }}>Discussion & Q&A Board</h3>
                  <div className="list-card" style={{ marginBottom: 0 }}>
                    <div className="list-item" style={{ borderBottom: 'none', padding: 0 }}>
                      <input type="text" style={{ flex: 1, padding: 10, border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 12, marginRight: 10 }} placeholder="Ask a question about this event..." />
                      <button className="submit-action-btn" style={{ width: 'auto', padding: '10px 15px', fontSize: 12 }} onClick={() => alert('Question posted to event board!')}>Post</button>
                    </div>
                  </div>
                </div>
                <div className="detail-panel">
                  <h3 className="section-title">Media & Resources</h3>
                  <ul style={{ listStyle: 'none', fontSize: 13, paddingLeft: 0 }}>
                    <li style={{ marginBottom: 10 }}><a href="#" style={{ color: 'var(--primary-accent)', textDecoration: 'none' }}>Download Pre-requisite Guide.pdf</a></li>
                    <li style={{ marginBottom: 10 }}><a href="#" style={{ color: 'var(--primary-accent)', textDecoration: 'none' }}>View Last Year's Gallery</a></li>
                  </ul>
                  <h3 className="section-title" style={{ marginTop: 25 }}>Results & Leaderboard</h3>
                  <div style={{ background: 'var(--bg-light)', padding: 15, borderRadius: 8, textAlign: 'center', fontSize: 12, color: 'var(--text-gray)' }}>
                    Results will be published here after the event concludes.
                  </div>
                </div>
              </div>
            </>
          )}

          {eventView === 'schedule' && (
            <div className="details-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <div className="detail-panel" style={{ padding: 15 }}>
                <h3 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  My Monthly Calendar
                  <button className="action-link" style={{ fontSize: 11 }} onClick={() => alert('Schedule exported to Google Calendar')}>Export</button>
                </h3>
                <div className="calendar-mockup">
                  [ Interactive Calendar UI View ]<br /><br />
                  Highlighted Dates:<br />
                  Jun 18 - Web Dev Bootcamp<br />
                  Jul 02 - Hackathon
                </div>
              </div>
              <div>
                <div className="detail-panel" style={{ marginBottom: 20 }}>
                  <h3 className="section-title">Active Registrations & QR Passes</h3>
                  <table className="generic-data-table">
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Web Dev Bootcamp</strong></td>
                        <td>Jun 18, 2026</td>
                        <td><span className="status-pill success">Confirmed</span></td>
                        <td><button className="action-link" style={{ color: 'var(--primary-accent)' }} onClick={() => alert('Show QR Pass')}>Show QR Pass</button></td>
                      </tr>
                      <tr>
                        <td><strong>AI Seminar Series</strong></td>
                        <td>Jun 25, 2026</td>
                        <td><span className="status-pill warning">Waitlisted (Pos: 3)</span></td>
                        <td><button className="action-link" style={{ color: 'var(--danger)' }} onClick={() => alert('Registration Cancelled.')}>Cancel</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="detail-panel">
                  <h3 className="section-title">Past Events, Feedback & Certificates</h3>
                  <table className="generic-data-table">
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Attendance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Cyber Security 101</strong></td>
                        <td><span className="status-pill success">100% Verified</span></td>
                        <td style={{ display: 'flex', gap: 10 }}>
                          <button className="action-link" onClick={() => alert('Downloading Certificate')}>Download Certificate</button>
                          <button className="action-link" onClick={() => alert('Thank you for your review!')}>Leave Review</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {eventView === 'admin' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, color: 'var(--primary)' }}>UIU Computer Club - Management Portal</h2>
                <button className="submit-action-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => alert('Opening Draft & Publish editor for new event...')}>+ Create New Event</button>
              </div>
              <div className="admin-stat-row">
                <div className="stat-card" style={{ padding: 15 }}>
                  <div><span>Total Registrations</span><h2 style={{ fontSize: 22 }}>452</h2></div>
                </div>
                <div className="stat-card" style={{ padding: 15 }}>
                  <div><span>Avg. Attendance Rate</span><h2 style={{ fontSize: 22 }}>88%</h2></div>
                </div>
                <div className="stat-card" style={{ padding: 15 }}>
                  <div><span>Feedback Score</span><h2 style={{ fontSize: 22 }}>4.8/5</h2></div>
                </div>
                <div className="stat-card" style={{ padding: 15 }} onClick={() => alert('Opening Scanner Interface...')}>
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <span style={{ color: 'var(--primary-accent)', fontWeight: 'bold' }}>[ Open QR Scanner ]</span>
                    <span style={{ marginTop: 5, fontSize: 10, display: 'block' }}>For Live Event Check-in</span>
                  </div>
                </div>
              </div>
              <div className="detail-panel">
                <h3 className="section-title">Manage Hosted Events</h3>
                <table className="generic-data-table">
                  <thead>
                    <tr>
                      <th>Event Title</th>
                      <th>Status</th>
                      <th>Capacity Flow</th>
                      <th>Management Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Web Dev Bootcamp</td>
                      <td><span className="status-pill success">Published</span></td>
                      <td>85 / 100 Seats</td>
                      <td>
                        <select style={{ padding: 4, fontSize: 11, borderRadius: 4 }} onChange={(e) => { if (e.target.value) { alert(`Action executed: ${e.target.value}`); e.target.value = ''; } }}>
                          <option value="">Select Action...</option>
                          <option value="Edit Event Details">Edit Event</option>
                          <option value="Manage Attendees List">Manage Attendees</option>
                          <option value="Generate Batch Certificates">Generate Certificates</option>
                          <option value="View Analytics Report">Analytics Report</option>
                          <option value="Delete Event (Draft)">Delete Event</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>App UI/UX Sprint</td>
                      <td><span className="status-pill warning">Draft Mode</span></td>
                      <td>0 / 50 Seats</td>
                      <td><button className="action-link" style={{ color: 'var(--primary-accent)' }}>Continue Editing</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <section className={activeTab === 'lost-found' ? 'tab-content active' : 'tab-content'}>
          <div className="header">
            <h1>Lost and Found Database</h1>
            <p>Submit declarations for misplaced properties or view unclaimed items recorded on premises.</p>
          </div>
          <div className="split-layout-form">
            <div className="form-panel">
              <h4 className="section-title">Report Misplaced Property</h4>
              <div className="form-element-group">
                <label>Item Classification Title</label>
                <input type="text" value={lostTitle} onChange={(e) => setLostTitle(e.target.value)} placeholder="e.g., Transparent Plastic Water Bottle" />
              </div>
              <div className="form-element-group">
                <label>Recovery / Lost Area Complex</label>
                <input type="text" value={lostLocation} onChange={(e) => setLostLocation(e.target.value)} placeholder="e.g., Cafeteria Counter West" />
              </div>
              <div className="form-element-group">
                <label>Supplementary Description Log</label>
                <textarea value={lostDesc} onChange={(e) => setLostDesc(e.target.value)} placeholder="State structural markers, color, stickers or identifying tags..." />
              </div>
              <button className="submit-action-btn" onClick={() => {
                if (!lostTitle || !lostLocation) return alert('Please fill title and location.');
                setLostItems([{ id: Date.now().toString(), title: lostTitle, location: lostLocation, status: 'Pending Verification' }, ...lostItems]);
                setLostTitle('');
                setLostLocation('');
                setLostDesc('');
                alert('Lost item report submitted.');
              }}>Broadcast Record to Database</button>
            </div>
            <div>
              <h4 className="section-title">Active Campus Recovery Logs</h4>
              <table className="generic-data-table">
                <thead>
                  <tr>
                    <th>Item Specification</th>
                    <th>Reported Site</th>
                    <th>Status Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {lostItems.length > 0 ? lostItems.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.title}</strong></td>
                      <td>{item.location}</td>
                      <td><span className="status-pill warning">{item.status}</span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', padding: 20 }}>No active reports yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={activeTab === 'messages' ? 'tab-content active' : 'tab-content'}>
          <div className="header">
            <h1>Communications Engine</h1>
            <p>Send direct sync inquiries to peer networks, mutes, or open feedback loops with club panels.</p>
          </div>
          <div className="chat-app-wrapper">
            <div className="chat-sidebar-threads">
              {messages.length > 0 ? messages.map((thread) => (
                <div key={thread.id} className={`thread-row ${thread.id === messages[0]?.id ? 'active' : ''}`}>
                  <h5>{thread.sender}</h5>
                  <p>{thread.preview}</p>
                </div>
              )) : (
                <div className="thread-row active"><h5>UIU Computer Club Board</h5><p>Web Development Workshop certificates data stream confirmation update...</p></div>
              )}
            </div>
            <div className="chat-window-viewport">
              <div className="chat-header-banner">UIU Computer Club Board</div>
              <div className="chat-messages-stream">
                {(messages[0]?.thread ?? [{ type: 'incoming', text: 'Hello Shamim, your application framework profile has been successfully evaluated.' }, { type: 'outgoing', text: 'Thank you! Please let me know the status of my Moderator request submission timeline.' }, { type: 'incoming', text: 'Super Admin accounts process executive requests directly. Keep reviewing your profile alerts tab.' }]).map((msg, index) => (
                  <div key={index} className={`bubble-msg ${msg.type === 'outgoing' ? 'outgoing' : 'incoming'}`}>{msg.text}</div>
                ))}
              </div>
              <div className="chat-input-bar">
                <input className="chat-text-input" value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Type your payload response structure here..." />
                <button className="submit-action-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => {
                  if (!chatText.trim()) return;
                  setMessages((prev) => {
                    const updated = [...prev];
                    if (!updated.length) updated.push({ id: 'thread-1', sender: 'UIU Computer Club Board', preview: chatText, thread: [] });
                    updated[0].thread = [...(updated[0].thread || []), { type: 'outgoing', text: chatText }];
                    updated[0].preview = chatText;
                    return updated;
                  });
                  setChatText('');
                }}>Send</button>
              </div>
            </div>
          </div>
        </section>

        <section className={activeTab === 'profile' ? 'tab-content active' : 'tab-content'}>
          <div className="header">
            <h1>Student Master Identity</h1>
            <p>Manage system metrics, security logs, and cross-examine institutional access scopes.</p>
          </div>
          <div className="profile-extended-grid">
            <div className="form-panel" style={{ textAlign: 'center' }}>
              <div className="avatar" style={{ width: 80, height: 80, fontSize: 32 }}>{user.name.slice(0, 1)}</div>
              <h3>{user.name}</h3>
              <p style={{ color: 'var(--text-gray)', fontSize: 13, marginBottom: 15 }}>{user.bio}</p>
              <span className="status-pill success" style={{ display: 'inline-block' }}>{user.status}</span>
            </div>
            <div className="form-panel">
              <h4 className="section-title">Institutional Ledger Metrics</h4>
              <div className="form-element-group">
                <label>Full Assigned Identity String</label>
                <input type="text" value={user.name} readOnly className="readonly-field" />
              </div>
              <div className="form-element-group">
                <label>University Core Matrix ID Code</label>
                <input type="text" value={user.studentId} readOnly className="readonly-field" />
              </div>
              <div className="form-element-group">
                <label>Registered System Email Node</label>
                <input type="text" value={user.email} readOnly className="readonly-field" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
