import React, { useEffect, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import { logout } from '../../firebase'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const [navDark, setNavDark] = useState(false);
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

  const handleNavClick = (view) => {
    console.log(`Navigating to: ${view}`);
    if (view === 'home') {
      navigate('/');
    } else {
      navigate(`/?view=${view}`);
    }
  }

  return (
    <div className={`navbar ${navDark ? 'nav-dark' : ''}`}>
      <div className="navbar-left">
        <img 
          src={logo} 
          alt="" 
          onClick={() => {
            console.log('Clicked logo');
            navigate('/');
          }} 
          style={{cursor: 'pointer'}} 
        />
        <ul>
          <li onClick={() => handleNavClick('home')}>Home</li>
          <li onClick={() => handleNavClick('tvshows')}>TV Shows</li>
          <li onClick={() => handleNavClick('movies')}>Movies</li>
          <li onClick={() => handleNavClick('newpopular')}>New & Popular</li>
          <li onClick={() => handleNavClick('mylist')}>My List</li>
          <li onClick={() => handleNavClick('languages')}>Browse by Languages</li>
        </ul>
      </div>
      <div className="navbar-right">
        <img src={search_icon} alt="" className='icons' />
        <p>Children</p>
        <img src={bell_icon} alt="" className='icons' />
        <div className="navbar-profile">
          <img src={profile_img} alt="" className='profile' />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p onClick={()=>{logout()}}>Sign Out of Netflix</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
