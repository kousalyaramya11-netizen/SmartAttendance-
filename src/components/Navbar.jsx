import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const navLinks = isAdmin
    ? [
        { path: '/admin-dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin-face-attendance', label: 'Face Attendance', icon: '📷' },
        { path: '/students', label: 'Students', icon: '👥' },
        { path: '/admin-attendance-history', label: 'Attendance History', icon: '📋' },
        { path: '/reports', label: 'Reports', icon: '📄' },
        { path: '/admin-analytics', label: 'Analytics', icon: '📈' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
      ]
    : [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/face-scan', label: 'Face Scan', icon: '📷' },
        { path: '/attendance-history', label: 'Attendance History', icon: '📋' },
        { path: '/analytics', label: 'Analytics', icon: '📈' },
      ];

  if (isAdmin) {
    navLinks.splice(1, 0, { path: '/teacher', label: 'Teacher View', icon: '👩‍🏫' });
  }

  return (
    <nav className="navbar-shell">
      <div className="navbar-container">
        <Link to={isAdmin ? '/admin-dashboard' : '/dashboard'} className="brand-wrap" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">🎓</span>
          <span className="brand-text">Smart Attendance</span>
        </Link>

        <button type="button" className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}

          <div className="nav-user-card">
            <div className="user-avatar">{currentUser.avatar}</div>
            <div className="user-meta">
              <strong>{currentUser.name}</strong>
              <span>{currentUser.id}</span>
            </div>
          </div>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
