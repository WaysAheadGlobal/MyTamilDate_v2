import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import logo from "../assets/images/MTDlogo.png";
import logo2 from "../assets/images/logo2.png";
import responsivebg from "../assets/images/responsive-bg.png";
import './job-title.css';

export default function AlmostThere() {

    return (
        <div className='job-container'>
            <div className='job-bg'>
                <Image className='responsive-bg' src={responsivebg} alt="Background"></Image>
            </div>
            <Container className='job-main'>
                <Container className='job-content'>
                    <Container className='logo-progressbar10'>
                        <Container className='logo-arrow10'>
                            <Image src={logo2} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                    </Container>
                    <div style={{
                        marginTop: "auto",
                    }}>
                        <p style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            lineHeight: "36px",
                            textAlign: "center",
                            background: "linear-gradient(180deg, #FC8C66 -4.17%, #F76A7B 110.42%)",
                            backgroundClip: "text",
                            color: "transparent",
                        }}>Almost there!</p>
                        <p style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            lineHeight: "20px",
                            textAlign: "center",
                        }}>You can view other MTD members once your profile is approved. Please contact us at <span style={{
                                background: "linear-gradient(180deg, #FC8C66 -4.17%, #F76A7B 110.42%)",
                                backgroundClip: "text",
                                color: "transparent",
                                fontWeight: "bold",
                            }}>hello@mytamildate.com</span> if you haven&apos;t been approved within 48 hours of registering.</p>
                    </div>
                    <div style={{
                        display: "flex",
                        width: "100%",
                        gap: "5rem",
                        marginTop: "auto",
                        marginBottom: "2rem",
                    }}>
                    </div>
                </Container>
            </Container>
        </div >
    );
};