import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';
import { Container, Image } from 'react-bootstrap';
import bgr from '../assets/images/r-bg.png';
import { useNavigate } from 'react-router-dom';
import logo2 from "../assets/images/logo2.png";
import whitelogo from "../assets/images/white-logo.png";
import mobilelogo2 from "../assets/images/mobilelogo2.png";

import logo from "../assets/images/MTDlogo.png";
import { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import mobilebg from "../assets/images/mobilebg.png";


export const Headerlp = () => {
  const navigate = useNavigate();
  
  const [mobile, setMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setMobile(true);
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    });
  }, []);

  const goToSignup = () => {
    navigate("/signup");
  };

  const goToSignin = () => {
    navigate("/Signinoptions");
  };

  return (
    <div className='header-main'>
      <div className='header-content'>
        <div className='bg-l'>
          <div className='header-shade'></div>
        </div>
        {
          mobile && <div className="navbar-custom">
          <div onClick={toggleMenu} className="menu-icon">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12.715H18.6M1 7.08798H18.6M1 1.46094H18.6" stroke="#F1E9E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {menuOpen && (
            <div className="menubarformob">
              <Link className={pathname === "/" ? "active-link" : ""} to="/" onClick={toggleMenu}>Home</Link>
              <Link className={pathname === "/SuccessPage" ? "active-link" : ""} to="/SuccessPage" onClick={toggleMenu}>Success Stories</Link>
              <Link className={pathname === "/aboutus" ? "active-link" : ""} to="/aboutus" onClick={toggleMenu}>About Us</Link>
              <a href="https://tamilculture.com/user/mytamildatecom" onClick={toggleMenu}>Blogs</a>
              <Link className={pathname === "/GetInTouch" ? "active-link" : ""} to="/GetInTouch" onClick={toggleMenu}>Contact Us</Link>
            </div>
          )}
        </div>
        }
        
        <img width="310px" src={whitelogo} className='mobile-logo' alt="Mobile Logo" />
        <div className='header-text'>
          <img src={logo} className='main-logo' alt="Main Logo" />
   
          <span>Meet Tamil Singles</span>
          <Container className='header-btn'>
            <button className='header-btnone' onClick={goToSignup}>
              Get Started
            </button>
            <button className='header-btntwo' onClick={goToSignin}>
              Returning? Login
            </button>
          </Container>
        </div>
        <div className='bg-r'>
          <Image src={bgr} style={{ height: '100%', width: '100%' }} alt="Background Image" />
        </div>
      </div>
    </div>
  );
};
