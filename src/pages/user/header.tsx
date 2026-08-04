import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import nowShowing from '@/assets/now-showing-2.webp';
import newsOffers from '@/assets/news.webp';
import registerNow from '@/assets/register.webp';
import loyalty from '@/assets/loyalty.webp';
import { useAuthStore } from '@/store/useAuthStore.ts';
import { authService } from '@/services/auth.service.ts';

const QUICK_LINKS = [
  {
    icon: nowShowing,
    label: 'Movie',
    
    path: '/movies',
  },
  {
    icon: newsOffers,
    label: 'Vouchers',

    path: '/vouchers',
  },
  {
    icon: registerNow,
    label: 'Register',
   
    path: '/',
  },
  {
    icon: loyalty,
    label: 'Loyalties',

    path: '/',
  },
];

// [2026-07-20] Dropdown Movies — 3 sub-links: Now Showing, Coming Soon, All Movies
const MoviesDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleNav = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div
      ref={wrapRef}
      className={`header__nav-movies${open ? ' header__nav-movies--open' : ''}`}
    >
      <button
        className="header__nav-link header__nav-movies-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        MOVIES
        <span className="header__nav-movies-arrow">▼</span>
      </button>

      {open && (
        <div className="header__nav-dropdown" role="menu">
          {/* NOW SHOWING */}
          <div
            className="header__nav-dropdown-item header__nav-dropdown-item--showing"
            role="menuitem"
            onClick={() => handleNav('/movies/now-showing')}
          >
            <span className="dropdown-item__icon">🎬</span>
            <span className="dropdown-item__text">
              <span className="dropdown-item__label">NOW SHOWING</span>
              <span className="dropdown-item__sub">Films currently in theaters</span>
            </span>
          </div>

          {/* COMING SOON */}
          <div
            className="header__nav-dropdown-item header__nav-dropdown-item--upcoming"
            role="menuitem"
            onClick={() => handleNav('/movies/coming-soon')}
          >
            <span className="dropdown-item__icon">🌟</span>
            <span className="dropdown-item__text">
              <span className="dropdown-item__label">COMING SOON</span>
              <span className="dropdown-item__sub">Upcoming releases</span>
            </span>
          </div>

          {/* ALL MOVIES */}
          <div
            className="header__nav-dropdown-item header__nav-dropdown-item--all"
            role="menuitem"
            onClick={() => handleNav('/movies')}
          >
            <span className="dropdown-item__icon">🎞</span>
            <span className="dropdown-item__text">
              <span className="dropdown-item__label">ALL MOVIES</span>
              <span className="dropdown-item__sub">Browse full catalog</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const HomeHeader: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    }
    logout();
    navigate('/login');
  };
  return (
    <>
      <div className="home__topbar">
        <div className="topbar__inner">
          <span className="topbar__item">🎫 MY TICKETS</span>
          <Link to={'/you/account'} style={{ textDecoration: 'none' }}>
            <span className="topbar__item">👤 ACCOUNT</span>
          </Link>
          <Link to={'/you/voucher'} style={{ textDecoration: 'none' }}>
            <span className="topbar__item">🎟 VOUCHER</span>
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="topbar__item">
                SIGN IN
              </Link>
              <Link to="/register" className="topbar__item">
                REGISTER
              </Link>
            </>
          ) : (
            <button
              type="button"
              className="topbar__item topbar__logout"
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          )}
        </div>
      </div>

      <header className="home__header">
        <div className="header__inner">
          <Link to="/" className="header__logo">
            <span className="logo-text">PREMIERE</span>
            <span className="logo-sub">CINEMA</span>
          </Link>

          <nav className="header__nav">
            {/* [2026-07-20] Movies dropdown — click to expand 3 sub-links */}
            <MoviesDropdown />
            <Link to="/theaters" className="header__nav-link">
              THEATERS
            </Link>
            <Link to="/membership" className="header__nav-link">
              MEMBERSHIP
            </Link>
            <Link to="/events" className="header__nav-link">
              EVENTS
            </Link>
          </nav>

          <Link to="/tickets">
            <Button
              type="primary"
              danger
              style={{
                borderRadius: 2,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              🎟 TICKETS
            </Button>
          </Link>
        </div>
      </header>

      <div className="film-strip">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className="film-strip__hole" />
        ))}
      </div>

      <div className="quick-links">
        {QUICK_LINKS.map((q) => (
          <Link key={q.label} to={q.path} className="quick-link">
            <img src={q.icon} alt={q.label} className="quick-link__icon" />
            <span className="quick-link__label">{q.label}</span>
            <span className="quick-link__sub">{q.sub}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default HomeHeader;