
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';


import { Container, Image } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
// import logo2 from "../assets/images/logo2.png";

import logo2 from "../assets/images/heartlogo.png";
import './nav.css';


export const NavBar = () => {
  const pathname = window.location.pathname;
  const [mobile, setMobile] = useState(false);

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
  }, [])


  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary Navbar-container sticky">
      <Container>
        <Navbar.Brand href="/" ><Image className='mobileresponsive' src={logo2} style={{ height: '75px', width: '76px' }}></Image></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <div className="me-auto">
          </div>
          <Nav style={{
            alignItems: mobile && "flex-start"
          }} className='nav-link-container'>
            {/* <Nav.Link as={Link} className={pathname === "/" ? "active-link" : ""} to="/">Home</Nav.Link> */}
            <Nav.Link as={Link} className={pathname === "/SuccessPage" ? "active-link" : ""} to="/SuccessPage">Success Stories</Nav.Link>
            <Nav.Link as={Link} className={pathname === "/aboutus" ? "active-link" : ""} to="/aboutus">About Us</Nav.Link>
            <Nav.Link href="https://tamilculture.com/user/mytamildatecom" target="_blank">Blogs</Nav.Link>
            <Nav.Link as={Link} className={pathname === "/GetInTouch" ? "active-link" : ""} to="/GetInTouch" data-target="ContactUs">Contact Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}