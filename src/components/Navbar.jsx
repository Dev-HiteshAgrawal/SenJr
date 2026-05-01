import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/',             label: 'Home',        icon: '🏠' },
  { path: '/find-mentors', label: 'Mentors',     icon: '🎓' },
  { path: '/free-courses', label: 'Explore',     icon: '📚' },
  { path: '/ai-tutor',     label: 'AI Space',    icon: '🤖' },
  { path: '/community',    label: 'Community',   icon: '🌐' },
  { path: '/study-rooms',  label: 'Study Rooms', icon: '🎧' },
];

// Returns initials from a display name or email
function getInitials(user) {
  if (user?.displayName) {
    return user.displayName
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  return (user?.email?.[0] || 'U').toUpperCase();
}

// Short name for the avatar button
function getShortName(user) {
  if (user?.displayName) {
    return user.displayName.split(' ')[0];
  }
  return user?.email?.split('@')[0] || 'User';
}

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled]       = useState(false);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Scroll listener — adds glass effect on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  async function handleLogout() {
    setDropdownOpen(false);
    setDrawerOpen(false);
    await logout();
    navigate('/');
  }

  const dashboardPath = userProfile?.role === 'mentor'
    ? '/mentor-dashboard'
    : '/student-dashboard';

  const initials  = getInitials(currentUser);
  const shortName = getShortName(currentUser);

  return (
    <>
      {/* ──────── Navbar Bar ──────── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="Senjr Home">
            <span className="logo-text-seek">Sen</span>
            <span className="logo-text-hlo">jr</span>
            <span className="logo-bolt" aria-hidden="true">⚡</span>
          </Link>

          {/* Desktop Nav Links — centred absolutely */}
          <div className="navbar-links" role="menubar">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                role="menuitem"
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth / Avatar */}
          <div className="navbar-auth">
            {currentUser ? (
              /* ─── Logged-in: Avatar + Dropdown ─── */
              <div className="nav-user" ref={dropdownRef}>
                <button
                  className="nav-avatar-btn"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={shortName}
                      className="avatar-img"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="avatar-initials" aria-hidden="true">
                      {initials}
                    </div>
                  )}
                  <span className="avatar-name">{shortName}</span>
                  <svg
                    className={`avatar-chevron${dropdownOpen ? ' open' : ''}`}
                    width="10" height="10" viewBox="0 0 10 10"
                    fill="currentColor" aria-hidden="true"
                  >
                    <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="nav-dropdown" role="menu">
                    {/* User info header */}
                    <div style={{ padding: '0.5rem 0.875rem 0.4rem', marginBottom: '0.2rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                        {currentUser.displayName || shortName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>
                        {currentUser.email}
                      </div>
                    </div>
                    <div className="dropdown-divider" />

                    <Link to={dashboardPath} className="dropdown-item" role="menuitem">
                      <span className="dropdown-item-icon">📊</span>
                      Dashboard
                    </Link>
                    <Link to="/profile" className="dropdown-item" role="menuitem">
                      <span className="dropdown-item-icon">👤</span>
                      My Profile
                    </Link>
                    <Link to="/leaderboard" className="dropdown-item" role="menuitem">
                      <span className="dropdown-item-icon">🏆</span>
                      Leaderboard
                    </Link>

                    <div className="dropdown-divider" />

                    <button
                      onClick={handleLogout}
                      className="dropdown-item danger"
                      role="menuitem"
                    >
                      <span className="dropdown-item-icon">🚪</span>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ─── Logged-out: Login + Signup ─── */
              <>
                <Link to="/login" className="btn-secondary">Log In</Link>
                <Link to="/signup" className="btn-primary">Start Learning</Link>
              </>
            )}
          </div>

          {/* Hamburger (mobile only) */}
          <button
            className={`hamburger${drawerOpen ? ' open' : ''}`}
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      {/* ──────── Mobile Overlay ──────── */}
      <div
        className={`mobile-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ──────── Mobile Drawer ──────── */}
      <aside
        id="mobile-drawer"
        className={`mobile-drawer${drawerOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer top bar */}
        <div className="drawer-top">
          <Link to="/" className="drawer-logo" onClick={() => setDrawerOpen(false)}>
            Sen<span style={{ color: '#FF6B00' }}>jr</span> ⚡
          </Link>
          <button
            className="drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Logged-in user info */}
        {currentUser && (
          <div className="drawer-user">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={shortName}
                className="avatar-img"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="avatar-initials">{initials}</div>
            )}
            <div className="drawer-user-info">
              <div className="drawer-user-name">
                {currentUser.displayName || shortName}
              </div>
              <div className="drawer-user-email">{currentUser.email}</div>
            </div>
          </div>
        )}

        {/* Drawer nav links */}
        <nav className="drawer-links">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`}
              onClick={() => setDrawerOpen(false)}
            >
              <span className="drawer-link-dot" aria-hidden="true" />
              <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}

          {/* Extra links for logged-in users */}
          {currentUser && (
            <>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.5rem 0' }} />
              <NavLink
                to={dashboardPath}
                className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="drawer-link-dot" />
                <span style={{ fontSize: '1.1rem' }}>📊</span>
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="drawer-link-dot" />
                <span style={{ fontSize: '1.1rem' }}>👤</span>
                My Profile
              </NavLink>
              <NavLink
                to="/leaderboard"
                className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="drawer-link-dot" />
                <span style={{ fontSize: '1.1rem' }}>🏆</span>
                Leaderboard
              </NavLink>
            </>
          )}
        </nav>

        {/* Drawer auth area */}
        <div className="drawer-auth">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="btn-drawer-login"
              style={{ color: '#FF6B6B', borderColor: 'rgba(255,107,107,0.2)' }}
            >
              🚪 &nbsp;Log Out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-secondary"
                onClick={() => setDrawerOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="btn-primary"
                onClick={() => setDrawerOpen(false)}
              >
                ✨ &nbsp;Start Learning
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
