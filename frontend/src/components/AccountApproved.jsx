import React from 'react'
import { Button, Container, Image } from 'react-bootstrap'
import logo from "../assets/images/MTDlogo.png";
import logo2 from "../assets/images/logo2.png";
import responsivebg from "../assets/images/responsive-bg.png";
import './job-title.css';

export default function AccountApproved() {
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
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        alignItems: "center",
                        textAlign: "center",
                        justifyContent: "center",
                    }}>
                        <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40.9987 6.83301C22.207 6.83301 6.83203 22.208 6.83203 40.9997C6.83203 59.7913 22.207 75.1663 40.9987 75.1663C59.7904 75.1663 75.1654 59.7913 75.1654 40.9997C75.1654 22.208 59.7904 6.83301 40.9987 6.83301ZM55.3487 35.1913L38.9487 51.5913C37.582 52.958 35.532 52.958 34.1654 51.5913L26.6487 44.0747C25.282 42.708 25.282 40.658 26.6487 39.2913C28.0154 37.9247 30.0654 37.9247 31.432 39.2913L36.557 44.4163L50.5654 30.408C51.932 29.0413 53.982 29.0413 55.3487 30.408C56.7154 31.7747 56.7154 33.8247 55.3487 35.1913Z" fill="#00B007" />
                        </svg>


                        <p style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            lineHeight: "36px",
                            textAlign: "center",
                        }}>Your profile is approved!</p>
                        <p style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            lineHeight: "20px",
                            textAlign: "center",
                        }}>Hello & welcome to the MTD community! Thanks for taking the time to complete your details</p>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        marginTop: "auto",
                        marginBottom: "2rem",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        {/* <Button variant="primary" style={{
                            width: "70%",
                            marginTop: "1rem",
                            background: "linear-gradient(180deg, #FC8C66 -4.17%, #F76A7B 110.42%)",
                            border: "none",
                            borderRadius: "9999px",
                            padding: "0.75rem",
                            fontSize: "1.25rem",
                            fontWeight: "bold",
                        }}>
                            Start exploring
                        </Button> */}
                        <button  type="submit" className='global-next-btn'>
                        Start exploring
                            </button>
                    </div>
                </Container>
            </Container>
        </div>
    )
}
