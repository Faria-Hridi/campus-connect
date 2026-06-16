import { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams
} from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const SUPERADMIN_EMAIL = 'superadmin@gmail.com';
const SUPERADMIN_PASSWORD = '123456';
const SUPERADMIN_TOKEN = 'superadmin-session';
const ADMIN_EMAIL = 'admin@uiu.ac.bd';
const ADMIN_PASSWORD = 'Admin123!';
const ADMIN_TOKEN = 'admin-session';

const SUPERADMIN_USER = {
  name: 'Super Admin',
  email: 'superadmin@gmail.com',
  role: 'superadmin',
  studentId: '0000000000',
  department: 'Super Admin Console',
  bio: 'Global system control account.',
  completion: 100,
  achievements: ['Super Admin Access'],
  status: 'Super Admin'
};
const ADMIN_USER = {
  name: 'Campus Admin',
  email: 'admin@uiu.ac.bd',
  role: 'admin',
  studentId: '0000000001',
  department: 'Campus Administration',
  bio: 'Campus operations administrator.',
  completion: 100,
  achievements: ['Admin Access'],
  status: 'Admin'
};

const tabs = [
  { id: 'dashboard', label: 'Dashboard', path: '/student/dashboard' },
  { id: 'browse-clubs', label: 'Browse Clubs', path: '/student/browse-clubs' },
  { id: 'events', label: 'Events', path: '/student/events' },
  { id: 'lost-found', label: 'Lost & Found', path: '/student/lost-found' },
  { id: 'messages', label: 'Messages', path: '/student/messages' },
  { id: 'profile', label: 'Profile', path: '/student/profile' }
];

const clubCategories = ['All Categories', 'Technical Forum', 'Cultural Team'];
const eventCategories = ['All Categories', 'Workshop', 'Competition', 'Cultural Event'];
const eventClubs = ['All Clubs', 'UIU Computer Club', 'UIU App Forum', 'UIU Cultural Club'];

function App() {
  const [token, setToken] = useState(localStorage.getItem('campus_token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [error, setError] = useState('');

  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [adminName, setAdminName] = useState(SUPERADMIN_USER.name);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupStudentId, setSignupStudentId] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('CSE');

  const [clubSearch, setClubSearch] = useState('');
  const [clubCategory, setClubCategory] = useState('All Categories');
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategory, setEventCategory] = useState('All Categories');
  const [eventClubFilter, setEventClubFilter] = useState('All Clubs');

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
    if (!token) {
      setUser(null);
      setAuthResolved(true);
      localStorage.removeItem('campus_token');
      return;
    }
    setAuthResolved(false);
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
      if (token === SUPERADMIN_TOKEN) {
        setUser(SUPERADMIN_USER);
        setAdminName(SUPERADMIN_USER.name);
        setLoading(false);
        return;
      }
      if (token === ADMIN_TOKEN) {
        setUser(ADMIN_USER);
        setAdminName(ADMIN_USER.name);
        setLoading(false);
        setAuthResolved(true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Unable to fetch profile.');
      const data = await response.json();
      setUser(data.user);
      if (data.user.role === 'admin' || data.user.role === 'superadmin') {
        setAdminName(data.user.name);
      }
      setAuthResolved(true);
    } catch (err) {
      console.error(err);
      setError('Session expired. Please log in again.');
      setToken('');
      localStorage.removeItem('campus_token');
      setAuthResolved(true);
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

  const handleLogin = async (navigate) => {
    setLoading(true);
    setError('');
    try {
      if (loginEmail === SUPERADMIN_EMAIL && loginPassword === SUPERADMIN_PASSWORD) {
        setToken(SUPERADMIN_TOKEN);
        setUser(SUPERADMIN_USER);
        setAdminName(SUPERADMIN_USER.name);
        localStorage.setItem('campus_token', SUPERADMIN_TOKEN);
        navigate('/superadmin/overview');
        return;
      }
      if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
        setToken(ADMIN_TOKEN);
        setUser(ADMIN_USER);
        setAdminName(ADMIN_USER.name);
        localStorage.setItem('campus_token', ADMIN_TOKEN);
        navigate('/superadmin/overview');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed.');
      setToken(data.token);
      setUser(data.user);
      if (data.user.role === 'admin' || data.user.role === 'superadmin') {
        setAdminName(data.user.name);
      }
      setLoginEmail('');
      setLoginPassword('');
      if (data.user.role === 'admin' || data.user.role === 'superadmin') {
        navigate('/superadmin/overview');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (navigate) => {
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
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (navigate) => {
    setToken('');
    setUser(null);
    localStorage.removeItem('campus_token');
    navigate('/');
  };

  const submitJoinRequest = async ({ clubId, phone, trxId, role, paymentMethod }) => {
    if (!phone.trim() || !trxId.trim()) {
      alert('Please provide both your Contact Number and Transaction ID before submitting.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/clubs/join`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ clubId, phone, trxId, role, paymentMethod })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Join request failed.');
      alert('Club join request submitted successfully.');
      setPendingRequestsCount((count) => count + 1);
    } catch (error) {
      alert(error.message);
    }
  };

  const registerLostItem = async ({ title, location, description }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lost-found`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, location, description })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to submit lost item.');
      setLostItems([data.item, ...lostItems]);
      alert('Lost item report submitted.');
    } catch (error) {
      alert(error.message);
    }
  };

  const sendChatMessage = async ({ threadId, text }) => {
    if (!text.trim()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ threadId, text })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Message send failed.');
      setMessages((prev) => prev.map((thread) => {
        if (thread.id !== threadId) return thread;
        return {
          ...thread,
          preview: text,
          thread: [...thread.thread, { type: 'outgoing', text }]
        };
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  const registerForEvent = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ eventId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Event registration failed.');
      alert('Event registration confirmed. Your QR pass will be available in schedule.');
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesCategory = clubCategory === 'All Categories' || club.category === clubCategory;
      const matchesSearch =
        !clubSearch ||
        club.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
        club.description.toLowerCase().includes(clubSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [clubs, clubCategory, clubSearch]);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesCategory = eventCategory === 'All Categories' || ev.category === eventCategory;
      const matchesClub = eventClubFilter === 'All Clubs' || ev.club === eventClubFilter;
      const matchesSearch =
        !eventSearch ||
        ev.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        ev.description.toLowerCase().includes(eventSearch.toLowerCase());
      return matchesCategory && matchesClub && matchesSearch;
    });
  }, [events, eventCategory, eventClubFilter, eventSearch]);

  const renderAuthStatus = () => {
    if (loading && token && !authResolved) {
      return (
        <div className="auth-shell">
          <section className="auth-panel">
            <h2>Restoring session...</h2>
            <p>Please wait while we verify your access.</p>
          </section>
        </div>
      );
    }
    return null;
  };

  if (loading && token && !authResolved) {
    return renderAuthStatus();
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthPage
              authError={error}
              loading={loading}
              loginEmail={loginEmail}
              loginPassword={loginPassword}
              signupName={signupName}
              signupEmail={signupEmail}
              signupPassword={signupPassword}
              signupStudentId={signupStudentId}
              signupDepartment={signupDepartment}
              setLoginEmail={setLoginEmail}
              setLoginPassword={setLoginPassword}
              setSignupName={setSignupName}
              setSignupEmail={setSignupEmail}
              setSignupPassword={setSignupPassword}
              setSignupStudentId={setSignupStudentId}
              setSignupDepartment={setSignupDepartment}
              handleLogin={handleLogin}
              handleSignup={handleSignup}
            />
          }
        />

        <Route
          element={<ProtectedRoute token={token} user={user} allowedRoles={['student']} authResolved={authResolved} loading={loading} />}
        >
          <Route
            path="/student"
            element={
              <StudentLayout user={user} onLogout={handleLogout} tabs={tabs} notificationCount={pendingRequestsCount} />
            }
          >
            <Route
              path="dashboard"
              element={
                <StudentDashboardPage
                  user={user}
                  feedItems={feedItems}
                  onNavigate={(path) => window.history.pushState(null, '', path)}
                />
              }
            />
            <Route
              path="browse-clubs"
              element={
                <BrowseClubsPage
                  clubs={filteredClubs}
                  clubSearch={clubSearch}
                  setClubSearch={setClubSearch}
                  clubCategory={clubCategory}
                  setClubCategory={setClubCategory}
                />
              }
            />
            <Route
              path="browse-clubs/:clubId"
              element={
                <ClubDetailsPage
                  clubs={clubs}
                  onSubmitJoin={submitJoinRequest}
                />
              }
            />
            <Route
              path="events"
              element={
                <EventsPage
                  events={filteredEvents}
                  eventSearch={eventSearch}
                  setEventSearch={setEventSearch}
                  eventCategory={eventCategory}
                  setEventCategory={setEventCategory}
                  eventClubFilter={eventClubFilter}
                  setEventClubFilter={setEventClubFilter}
                  onRegisterForEvent={registerForEvent}
                />
              }
            />
            <Route
              path="lost-found"
              element={
                <LostFoundPage lostItems={lostItems} onSubmit={registerLostItem} />
              }
            />
            <Route
              path="messages"
              element={
                <MessagesPage messages={messages} onSendMessage={sendChatMessage} />
              }
            />
            <Route path="profile" element={<ProfilePage user={user} />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        <Route
          element={<ProtectedRoute token={token} user={user} allowedRoles={['superadmin', 'admin']} authResolved={authResolved} loading={loading} />}
        >
          <Route
            path="/superadmin"
            element={<SuperAdminLayout adminName={adminName} setAdminName={setAdminName} onLogout={handleLogout} userRole={user?.role} />}
          >
            <Route path="overview" element={<SuperAdminOverview pendingRequestsCount={pendingRequestsCount} userRole={user?.role} />} />
            <Route path="profile" element={<SuperAdminProfilePage adminName={adminName} setAdminName={setAdminName} userRole={user?.role} />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            token ? (
              user?.role === 'superadmin' || user?.role === 'admin' ? (
                <Navigate to="/superadmin/overview" replace />
              ) : (
                <Navigate to="/student/dashboard" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ token, user, allowedRoles, authResolved, loading }) {
  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (!authResolved && loading) {
    return null;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function AuthPage({
  authError,
  loading,
  loginEmail,
  loginPassword,
  signupName,
  signupEmail,
  signupPassword,
  signupStudentId,
  signupDepartment,
  setLoginEmail,
  setLoginPassword,
  setSignupName,
  setSignupEmail,
  setSignupPassword,
  setSignupStudentId,
  setSignupDepartment,
  handleLogin,
  handleSignup
}) {
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();

  return (
    <div className="auth-shell">
      <section className="auth-panel">
        <h1>{authMode === 'login' ? 'Sign in to Campus Connect' : 'Create your Campus account'}</h1>
        <p>Use your student credentials or signup with a new account.</p>
        {authError && <div className="error-box">{authError}</div>}
        {authMode === 'login' ? (
          <>
            <label>Email address</label>
            <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="student@uiu.ac.bd" />
            <label>Password</label>
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" />
            <button className="submit-action-btn" onClick={() => handleLogin(navigate)} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <p className="auth-switch">
              New to Campus Connect?{' '}
              <button type="button" className="action-link" onClick={() => { setAuthMode('signup'); }}>
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
            <button className="submit-action-btn" onClick={() => handleSignup(navigate)} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <p className="auth-switch">
              Already registered?{' '}
              <button type="button" className="action-link" onClick={() => { setAuthMode('login'); }}>
                Sign in
              </button>
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function StudentLayout({ user, onLogout, tabs, notificationCount }) {
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo" onClick={() => navigate('/student/dashboard')}>
          Campus<span>Connect</span>
        </div>

        <div className="sidebar-meta">
          <div className="sidebar-user">
            <div className="avatar">{user.name.slice(0, 1)}</div>
            <div>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{user.name}</p>
              <p style={{ color: '#94a3b8', fontSize: 12 }}>{user.department}</p>
            </div>
          </div>
        </div>

        <ul className="nav-links">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <NavLink to={tab.path} className={({ isActive }) => (isActive ? 'active' : '')}>
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button className="logout-btn" onClick={() => onLogout(navigate)}>Log Out</button>
      </aside>
      <main className="main-content">
        <div className="topbar">
          <div className="topbar-search">
            <input type="search" placeholder="Search campus resources..." />
          </div>
          <div className="topbar-actions">
            <button className="notification-pill">Alerts {notificationCount > 0 ? `(${notificationCount})` : ''}</button>
            <div className="profile-pill">{user.name.split(' ').map((part) => part[0]).join('')}</div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

function StudentDashboardPage({ user, feedItems }) {
  const navigate = useNavigate();

  return (
    <section>
      <div className="header">
        <h1>Welcome back, {user.name}</h1>
        <p>Stay updated with your campus activities and events.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/student/browse-clubs')}>
          <div>
            <span>Joined Clubs</span>
            <h2>3</h2>
          </div>
          <div className="stat-icon bg-blue-light">CLB</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/student/events')}>
          <div>
            <span>Upcoming Events</span>
            <h2>2</h2>
          </div>
          <div className="stat-icon bg-green-light">EVN</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/student/lost-found')}>
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
                <button className="action-link">Like ({feed.likes})</button>
                <button className="action-link" onClick={() => navigate('/student/messages')}>Comment ({feed.comments})</button>
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
            <div className="list-item" onClick={() => navigate('/student/lost-found')}><span>Report Lost Item</span></div>
            <div className="list-item" onClick={() => navigate('/student/browse-clubs')}><span>Browse New Clubs</span></div>
            <div className="list-item" onClick={() => navigate('/student/profile')}><span>Verify Event Certificate</span></div>
          </div>

          <h3>My Achievements</h3>
          <div className="list-card">
            <div className="list-item"><span>Active Member</span><span className="text-badge badge-gold">Gold Roll</span></div>
            <div className="list-item"><span>Top Volunteer</span><span className="text-badge badge-emerald">Verified</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function BrowseClubsPage({ clubs, clubSearch, setClubSearch, clubCategory, setClubCategory }) {
  const navigate = useNavigate();

  return (
    <section>
      <div className="header">
        <h1>Browse University Clubs</h1>
        <p>Explore academic forums, creative leagues, and join the communities that fit your passion.</p>
      </div>

      <div className="search-filter-wrapper">
        <input className="search-input" value={clubSearch} onChange={(e) => setClubSearch(e.target.value)} placeholder="Search clubs by name or keywords..." />
        <select className="select-filter" value={clubCategory} onChange={(e) => setClubCategory(e.target.value)}>
          {clubCategories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </div>

      <div className="clubs-container-grid">
        {clubs.map((club) => (
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
            <button className="join-btn-primary" onClick={() => navigate(`/student/browse-clubs/${club.id}`)}>Explore Club</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClubDetailsPage({ clubs, onSubmitJoin }) {
  const { clubId } = useParams();
  const club = clubs.find((item) => item.id === clubId);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [role, setRole] = useState('General Member');
  const [paymentMethod, setPaymentMethod] = useState('bKash');

  if (!club) {
    return (
      <section>
        <div className="header">
          <h1>Club not found</h1>
          <p>Please return to the club catalog to select a valid club.</p>
        </div>
      </section>
    );
  }

  const handleSubmit = () => {
    onSubmitJoin({ clubId: club.id, phone, trxId, role, paymentMethod });
    setShowJoinForm(false);
    setPhone('');
    setTrxId('');
    setRole('General Member');
    setPaymentMethod('bKash');
  };

  return (
    <section>
      <div className="header">
        <h1>{club.name}</h1>
        <p>{club.description}</p>
      </div>
      <div className="club-view-card">
        <div>
          <div className="club-card-meta">
            <div>
              <h4 className="club-title">{club.name}</h4>
              <p style={{ fontSize: 12, color: 'var(--text-gray)', marginTop: 2 }}>Members: {club.members}</p>
            </div>
            <span className="club-category-tag">{club.category}</span>
          </div>
          <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{club.description}</p>
        </div>
        <button className="submit-action-btn" onClick={() => setShowJoinForm(true)}>Join Club</button>
      </div>

      {showJoinForm && (
        <div className="join-form-wrapper" style={{ marginTop: 30 }}>
          <h3>Join Request for {club.name}</h3>
          <div className="payment-instruction-box">
            <strong>Official Payment Instructions:</strong><br />
            Please send the registration fee to the authorized club merchant number: <strong style={{ fontSize: 14, letterSpacing: 1 }}>01711-000000</strong>.
          </div>
          <div className="form-grid-layout">
            <div className="form-element-group">
              <label>Contact Number *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 01XXXXXXXXX" />
            </div>
            <div className="form-element-group">
              <label>Transaction ID *</label>
              <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="Enter your TrxID" />
            </div>
            <div className="form-element-group">
              <label>Target Role *</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="General Member">General Member</option>
                <option value="Moderator">Moderator</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="form-element-group">
              <label>Payment Method *</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
              </select>
            </div>
          </div>
          <div className="btn-group">
            <button className="btn-cancel" onClick={() => setShowJoinForm(false)}>Cancel</button>
            <button className="submit-action-btn" onClick={handleSubmit}>Confirm & Send Application</button>
          </div>
        </div>
      )}
    </section>
  );
}

function EventsPage({ events, eventSearch, setEventSearch, eventCategory, setEventCategory, eventClubFilter, setEventClubFilter, onRegisterForEvent }) {
  const [eventView, setEventView] = useState('discover');
  const [selectedEvent, setSelectedEvent] = useState(events[0] || null);

  useEffect(() => {
    if (!selectedEvent && events.length) setSelectedEvent(events[0]);
  }, [events, selectedEvent]);

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setEventView('details');
  };

  return (
    <section>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1>Campus Event Hub</h1>
          <p>Discover, register, and track your co-curricular journey with AI-powered suggestions.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className={`btn-cancel ${eventView === 'discover' ? 'active' : ''}`} style={eventView === 'discover' ? { background: '#e2e8f0' } : {}} onClick={() => setEventView('discover')}>Discover Events</button>
          <button className={`btn-cancel ${eventView === 'schedule' ? 'active' : ''}`} style={eventView === 'schedule' ? { background: '#e2e8f0' } : {}} onClick={() => setEventView('schedule')}>My Schedule</button>
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
          </div>

          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card-modern">
                <div className={`event-banner-img ${event.type?.toLowerCase().includes('hackathon') ? 'hackathon' : event.type?.toLowerCase().includes('cultural') ? 'cultural' : ''}`}>
                  {event.title}
                  <div className="event-date-badge">{event.displayDate || event.date.split('-')[2]}<span>{event.date.split('-')[2]} {event.date.split('-')[0]}</span></div>
                </div>
                <div className="event-card-body">
                  <div>
                    <div className="event-tags-row" style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <span className="status-pill" style={{ background: '#e0f2fe', color: '#0369a1' }}>{event.type}</span>
                      <span className="status-pill warning">{event.status}</span>
                    </div>
                    <h4 className="event-card-title">{event.title}</h4>
                    <ul className="event-meta-list" style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                      <li><strong>Organizer:</strong> {event.club}</li>
                      <li><strong>Location:</strong> {event.location || 'Main Lab 03'}</li>
                      <li><strong>Capacity:</strong> {event.seats || 15} seats available</li>
                    </ul>
                  </div>
                  <div className="event-card-footer">
                    <button className="action-link">Save</button>
                    <button className="submit-action-btn" style={{ width: 'auto', padding: '8px 15px', fontSize: 12 }} onClick={() => openEventDetails(event)}>View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {eventView === 'details' && selectedEvent && (
        <>
          <button className="btn-cancel" style={{ marginBottom: 15, width: 'auto', padding: '8px 15px' }} onClick={() => setEventView('discover')}>&larr; Back to Events</button>
          <div className="event-details-hero">
            <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #1e3a8a, #0ea5e9)', borderRadius: 20, padding: 30, color: 'white' }}>
              <div className="hero-content">
                <div style={{ marginBottom: 10 }}>
                  <span className="status-pill success">{selectedEvent.status}</span>
                  <span className="status-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginLeft: 10 }}>{selectedEvent.type}</span>
                </div>
                <h1 id="detail-title" style={{ marginBottom: 12 }}>{selectedEvent.title}</h1>
                <p>{`Organized by ${selectedEvent.club}`}</p>
              </div>
            </div>
            <div style={{ background: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: 30 }}>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-gray)', display: 'block' }}>Date</span>
                  <strong>{selectedEvent.date}</strong>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-gray)', display: 'block' }}>Location</span>
                  <strong>{selectedEvent.location || 'Main Lab 03'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-gray)', display: 'block' }}>Deadline</span>
                  <strong style={{ color: 'var(--danger)' }}>June 16, 2026</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-cancel" style={{ width: 'auto' }} onClick={() => alert('Reminder set. We will notify you 24 hours before the event.')}>Notify Me</button>
                <button className="submit-action-btn" style={{ width: 'auto', padding: '10px 25px' }} onClick={() => onRegisterForEvent(selectedEvent.id)}>1-Click Register</button>
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
            </h3>
            <div className="calendar-mockup" style={{ minHeight: 220, background: '#f8fafc', borderRadius: 12, padding: 20, color: '#475569' }}>
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
                    <td><button className="action-link" style={{ color: 'var(--primary-accent)' }}>Show QR Pass</button></td>
                  </tr>
                  <tr>
                    <td><strong>AI Seminar Series</strong></td>
                    <td>Jun 25, 2026</td>
                    <td><span className="status-pill warning">Waitlisted (Pos: 3)</span></td>
                    <td><button className="action-link" style={{ color: 'var(--danger)' }}>Cancel</button></td>
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
                      <button className="action-link">Download Certificate</button>
                      <button className="action-link">Leave Review</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function LostFoundPage({ lostItems, onSubmit }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !location.trim()) {
      alert('Please fill title and location.');
      return;
    }
    onSubmit({ title, location, description });
    setTitle('');
    setLocation('');
    setDescription('');
  };

  return (
    <section>
      <div className="header">
        <h1>Lost and Found Database</h1>
        <p>Submit declarations for misplaced properties or view unclaimed items recorded on premises.</p>
      </div>
      <div className="split-layout-form">
        <div className="form-panel">
          <h4 className="section-title">Report Misplaced Property</h4>
          <div className="form-element-group">
            <label>Item Classification Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Transparent Plastic Water Bottle" />
          </div>
          <div className="form-element-group">
            <label>Recovery / Lost Area Complex</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Cafeteria Counter West" />
          </div>
          <div className="form-element-group">
            <label>Supplementary Description Log</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="State structural markers, color, stickers or identifying tags..." />
          </div>
          <button className="submit-action-btn" onClick={handleSubmit}>Broadcast Record to Database</button>
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
  );
}

function MessagesPage({ messages, onSendMessage }) {
  const [activeThreadId, setActiveThreadId] = useState(messages[0]?.id || null);
  const [chatText, setChatText] = useState('');
  const selectedThread = messages.find((thread) => thread.id === activeThreadId) || messages[0] || null;

  useEffect(() => {
    if (!activeThreadId && messages.length) {
      setActiveThreadId(messages[0].id);
    }
  }, [messages, activeThreadId]);

  const handleSend = () => {
    if (!selectedThread) return;
    onSendMessage({ threadId: selectedThread.id, text: chatText });
    setChatText('');
  };

  return (
    <section>
      <div className="header">
        <h1>Communications Engine</h1>
        <p>Send direct sync inquiries to peer networks, mutes, or open feedback loops with club panels.</p>
      </div>
      <div className="chat-app-wrapper">
        <div className="chat-sidebar-threads">
          {messages.length > 0 ? messages.map((thread) => (
            <div
              key={thread.id}
              className={`thread-row ${thread.id === selectedThread?.id ? 'active' : ''}`}
              onClick={() => setActiveThreadId(thread.id)}
            >
              <h5>{thread.sender}</h5>
              <p>{thread.preview}</p>
            </div>
          )) : (
            <div className="thread-row active"><h5>UIU Computer Club Board</h5><p>No messages available.</p></div>
          )}
        </div>
        <div className="chat-window-viewport">
          <div className="chat-header-banner">{selectedThread?.sender || 'Campus Communications'}</div>
          <div className="chat-messages-stream">
            {(selectedThread?.thread || []).map((msg, index) => (
              <div key={index} className={`bubble-msg ${msg.type === 'outgoing' ? 'outgoing' : 'incoming'}`}>{msg.text}</div>
            ))}
          </div>
          <div className="chat-input-bar">
            <input className="chat-text-input" value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Type your payload response structure here..." />
            <button className="submit-action-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfilePage({ user }) {
  return (
    <section>
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
  );
}

function SuperAdminLayout({ adminName, setAdminName, onLogout, userRole }) {
  const navigate = useNavigate();
  const superTabs = [
    { id: 'overview', label: 'Workspace Overview', path: '/superadmin/overview' },
    { id: 'profile', label: 'Profile & Broadcast', path: '/superadmin/profile' }
  ];
  const hubLabel = userRole === 'admin' ? 'Admin Console' : 'Super Admin Console';
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo" onClick={() => navigate('/superadmin/overview')}>
          Campus<span>Connect</span>
        </div>
        <ul className="nav-links">
          {superTabs.map((tab) => (
            <li key={tab.id}>
              <NavLink to={tab.path} className={({ isActive }) => (isActive ? 'active' : '')}>
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={() => onLogout(navigate)}>Log Out</button>
      </aside>
      <main className="main-content">
        <div className="topbar">
          <div className="topbar-search">
            <input type="search" placeholder="Search system controls..." />
          </div>
          <div className="topbar-actions">
            <button className="notification-pill">{hubLabel}</button>
            <div className="profile-pill">{adminName.split(' ').map((w) => w[0]).join('')}</div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

function SuperAdminOverview({ pendingRequestsCount, userRole }) {
  const overviewTitle = userRole === 'admin' ? 'Admin Command Console' : 'Super Admin Command Console';
  const overviewSubtitle = userRole === 'admin'
    ? 'Manage campus workflows, role approvals, and system controls for the administration hub.'
    : 'Monitor platform traffic, approvals, and system-wide state from the command hub.';
  return (
    <section>
      <div className="header">
        <h1>{overviewTitle}</h1>
        <p>{overviewSubtitle}</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <span>Total Platform Accounts</span>
            <h2>1,492</h2>
          </div>
          <div className="stat-icon bg-purple-light">USR</div>
        </div>
        <div className="stat-card">
          <div>
            <span>Active Campus Organizations</span>
            <h2>24</h2>
          </div>
          <div className="stat-icon bg-blue-light">ORG</div>
        </div>
        <div className="stat-card">
          <div>
            <span>Live Role Elevation</span>
            <h2>{pendingRequestsCount}</h2>
          </div>
          <div className="stat-icon bg-green-light">REQ</div>
        </div>
        <div className="stat-card">
          <div>
            <span>Global Campus Events</span>
            <h2>18</h2>
          </div>
          <div className="stat-icon bg-orange-light">EVT</div>
        </div>
      </div>
      <div className="form-panel" style={{ marginTop: 20 }}>
        <h3 className="section-title">Audit Log Summary</h3>
        <div style={{ color: 'var(--text-gray)', fontSize: 13, lineHeight: 1.7 }}>
          Latest system changes are audited here for review. Role approval actions, broadcast deployments, and club entity generation events are tracked to support compliance workflows.
        </div>
      </div>
    </section>
  );
}

function SuperAdminProfilePage({ adminName, setAdminName, userRole }) {
  const [draftName, setDraftName] = useState(adminName);
  useEffect(() => {
    setDraftName(adminName);
  }, [adminName]);

  const currentEmail = userRole === 'admin' ? 'admin@uiu.ac.bd' : 'superadmin@gmail.com';
  const currentRoleLabel = userRole === 'admin' ? 'Admin' : 'Super Admin';
  const initials = draftName.split(' ').map((word) => word[0]).join('');

  return (
    <section>
      <div className="header">
        <h1>Profile Configuration & Broadcast Feed</h1>
        <p>Control your public announcement engine and update executive {currentRoleLabel.toLowerCase()} configuration.</p>
      </div>
      <div className="profile-extended-grid">
        <div className="form-panel">
          <h4 className="section-title">Executive Profile Settings</h4>
          <div className="form-element-group">
            <label>Administrative Full Name</label>
            <input value={draftName} onChange={(e) => setDraftName(e.target.value)} />
          </div>
          <div className="form-element-group">
            <label>System Email Address</label>
            <input value={currentEmail} readOnly className="readonly-field" />
          </div>
          <div className="form-element-group">
            <label>Current Role</label>
            <input value={currentRoleLabel} readOnly className="readonly-field" />
          </div>
          <button className="submit-action-btn" onClick={() => setAdminName(draftName)}>Apply Security Changes</button>
        </div>
        <div className="form-panel" style={{ textAlign: 'center' }}>
          <div className="avatar" style={{ width: 100, height: 100, margin: '0 auto 20px', fontSize: 36 }}>{initials}</div>
          <h3>{draftName}</h3>
          <p style={{ color: 'var(--text-gray)', fontSize: 13 }}>Admin broadcast and system supervisor identity.</p>
        </div>
      </div>
    </section>
  );
}

export default App;
