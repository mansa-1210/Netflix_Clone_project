import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import caret_icon from '../../assets/caret_icon.svg'
import NotificationDropdown from '../NotificationDropdown/NotificationDropdown'
import { auth, logout } from '../../firebase'
import { useNavigate } from 'react-router-dom'

const DEFAULT_USER = {
  username: 'Rakshitha',
  email: 'rakshitha@gmail.com',
  password: 'password'
}

const Navbar = ({ searchQuery = '', onSearchChange = () => {} }) => {

  const [navDark, setNavDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New movie added', read: false },
    { id: 2, text: 'Trending now updated', read: false },
    { id: 3, text: 'Your watchlist was updated', read: false },
    { id: 4, text: 'New season released', read: false },
  ]);
  const [userData, setUserData] = useState(DEFAULT_USER);
  const navActionsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if(window.scrollY > 80){
        setNavDark(true);
      } else {
        setNavDark(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('netflixCloneUser') || 'null');
    const firebaseUser = auth.currentUser;

    if (savedUser) {
      setUserData(savedUser);
    } else if (firebaseUser?.email) {
      const username = firebaseUser.displayName || firebaseUser.email.split('@')[0];
      const nextUser = {
        username,
        email: firebaseUser.email,
        password: 'password'
      };
      setUserData(nextUser);
      localStorage.setItem('netflixCloneUser', JSON.stringify(nextUser));
    } else {
      localStorage.setItem('netflixCloneUser', JSON.stringify(DEFAULT_USER));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navActionsRef.current && !navActionsRef.current.contains(event.target)) {
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view) => {
    setSearchOpen(false);
    onSearchChange('');
    if (view === 'home') {
      navigate('/');
    } else {
      navigate(`/?view=${view}`);
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const profileLetter = (userData.username || userData.email || 'U').trim().charAt(0).toUpperCase();

  const handleMarkAllRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
  }

  return (
    <div className={`navbar ${navDark ? 'nav-dark' : ''}`}>
      <div className="navbar-left">
        <button
          className="brand-logo"
          onClick={() => {
            onSearchChange('');
            navigate('/');
          }} 
          aria-label="Netflix Clone home"
        >
          <span>NETFLIX</span>
          <strong>CLONE</strong>
        </button>
        <ul>
          <li onClick={() => handleNavClick('home')}>Home</li>
          <li onClick={() => handleNavClick('tvshows')}>TV Shows</li>
          <li onClick={() => handleNavClick('movies')}>Movies</li>
          <li onClick={() => handleNavClick('newpopular')}>New & Popular</li>
          <li onClick={() => handleNavClick('mylist')}>My List</li>
          <li onClick={() => handleNavClick('languages')}>Browse by Languages</li>
        </ul>
      </div>
      <div className="navbar-right" ref={navActionsRef}>
        <div className={`search-box ${searchOpen ? 'open' : ''}`}>
          <button
            type="button"
            className="icon-button"
            onClick={() => setSearchOpen((current) => !current)}
            aria-label="Search movies"
          >
            <img src={search_icon} alt="" className='icons' />
          </button>
          <input
            type="text"
            placeholder="Search movies"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {searchOpen && searchQuery && (
            <button type="button" className="search-clear" onClick={() => onSearchChange('')} aria-label="Clear search">x</button>
          )}
        </div>
        <p>Children</p>
        <div className="notification-wrap">
          <button
            type="button"
            className="icon-button notification-button"
            onClick={() => {
              setNotificationOpen((current) => !current);
              setProfileOpen(false);
            }}
            aria-label="Open notifications"
          >
            <img src={bell_icon} alt="" className='icons' />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          {notificationOpen && (
            <NotificationDropdown notifications={notifications} onMarkAllRead={handleMarkAllRead} />
          )}
        </div>
        <div className="navbar-profile">
          <button
            type="button"
            className="profile-trigger"
            onClick={() => {
              setProfileOpen((current) => !current);
              setNotificationOpen(false);
            }}
          >
            <span className='profile-badge'>{profileLetter}</span>
            <img src={caret_icon} alt="" />
          </button>
          {profileOpen && (
            <div className="profile-dropdown">
              <p><span>Username</span>{userData.username}</p>
              <p><span>Email</span>{userData.email}</p>
              <p><span>Password</span>{'*'.repeat(Math.max(8, userData.password?.length || 8))}</p>
              <button type="button" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
