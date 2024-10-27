import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './aboutus-pg.css';

import { Container, Image } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import agent from "../assets/images/AGENT.png";
import moving from "../assets/images/MOVING HOME.png";
import property from "../assets/images/PROPERTY.png";
import survey from "../assets/images/SURVEY.png";
import abtl from "../assets/images/abtl.png";
import abtr from "../assets/images/abtr.png";
import abtbg from "../assets/images/abtus-bg.png";
import abt4vid from "../assets/images/abtus-video.png";
import { Footer } from './footer';
import { NavBar } from './nav';
export const AboutUsPage = () => {
    return (
        <>
            <NavBar />
            <Container className='abt-main'>
                <Container className='abt1-main'>
                    <Row fluid className="abt1-row">
                        <Col fluid className="abt1-col" xs={12} md={12}>
                            <div className="abt1-item">
                                <Image fluid className='abt1-image' src={abtbg} />
                                <div className="abt1-detail">
                                    <p>ABOUT US</p>
                                    <h3 style={{
                                        marginTop: "1em",
                                        fontfamily: "Inter",
fontsize: "20px",
fontweight: "400",
lineheight: "35px",
textalign: "center",

                                    }}>myTamilDate.com has been the most trusted dating community for single Tamils around the world for close to a decade! We&apos;re the premiere dating site for diaspora Tamils and have the largest membership base in Canada, USA, UK & more.</h3>
                                </div>
                            </div>
                        </Col>
                    </Row>

                </Container>


                <Container className='abt2-main'>

                    <div className='abt2-imgl'>
                        <Image className='abt2-img' src={abtl} ></Image>
                        <p>Sanjutha & Roban</p>
                        <a href="https://tiethethali.com/sanjutha-roban/">Read their story</a>

                    </div>
                    <div className='abt2-mid'>
                        <div className='abt2-txt'>
                            <p style={{
                                fontSize: "clamp(30px, 5vw, 40px)"
                            }}>
                               <span style={{color : "black" ,fontSize: "clamp(30px, 5vw, 40px)", fontWeight : "600"}}>Proven</span>  Success
                            </p>
                            <span style={{
                                fontSize: "clamp(16px, 4vw, 20px)",
                                marginTop : "20px",
                                fontWeight : "400"
                            }}>
                                We&apos;ve been helping single Tamils meet, date and marry for years. On their own terms & their own timelines.
                            </span>
                        </div>
                        <a href="/signup"  style={{marginTop : "10px"}}>Get Started</a>


                    </div>





                    <div className='abt2-imgr'>
                        <Image className='abt2-img' src={abtr}></Image>
                        <p>Abi & John</p>
                        <a href="https://tamilculture.com/mytamildate-success-abi-john-bonded-over-faith-their-tamil-german-british-connection">Read their story</a>

                    </div>
                </Container>





                <div className='abt3-main'>
                    <p style={{
                        fontSize: "clamp(30px, 5vw, 40px)"
                    }} >Benefits of myTamilDate</p>
                    <div className='abt3-main-content' style={{
                        gap: "1rem"
                    }}>
                        <div className='abt3-one'>
                            <div className='abt3-top'>
                                <img className="abt3-img" src={survey}></img>
                                <div className='abt3-text'>
                                    <span style={{
                                        fontSize: "clamp(26px, 5vw, 30px)",
                                    }} >Trust & Authenticity</span>
                                    <p style={{
                                        fontSize: "clamp(16px, 4vw, 18px)",
                                        textAlign: 'justify'
                                    }}>We manually verify every profile to ensure authenticity. Phone verification
                                        is also required for added security.</p>
                                </div>
                            </div>
                            <div className='abt3-bottom'>
                                <img className="abt3-img" src={agent}></img>
                                <div className='abt3-text'>
                                    <span style={{
                                        fontSize: "clamp(26px, 5vw, 30px)",
                                    }} >Safety & Protection</span>
                                    <p style={{
                                        fontSize: "clamp(16px, 4vw, 18px)",
                                        textAlign: 'justify'
                                    }}>We prioritize creating a safe and trusted community, ensuring your platform experience
                                        and personal data protection.</p>

                                </div>
                            </div>

                        </div>
                        <div className='abt3-one'>
                            <div className='abt3-top'>
                                <img className="abt3-img" src={property}></img>
                                <div className='abt3-text'>
                                    <span style={{
                                        fontSize: "clamp(26px, 5vw, 30px)",
                                    }} >Flexible Platform</span>
                                    <p style={{
                                        fontSize: "clamp(16px, 4vw, 18px)",
                                        textAlign: 'justify'
                                    }}>We’re built for mobile first and enhanced for desktop too! The best part? You don’t have to download yet another app.</p>
                                </div>
                            </div>


                            <div className='abt3-bottom abt3-cus'>
                                <img className="abt3-img" src={moving}></img>
                                <div className='abt3-text'>
                                    <span style={{
                                        fontSize: "clamp(26px, 5vw, 30px)",
                                    }} >Personalized Service</span>
                                    <p style={{
                                        fontSize: "clamp(16px, 4vw, 18px)",
                                        textAlign: 'justify'
                                    }}>We care about your dating life like a good friend, offering profile help, messaging tips, and date ideas!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Container className='abt4-main'>
                    <a href='https://www.instagram.com/reel/C4Bg5EWJZ8P/'>

                        <img className='abt4-bg' src={abt4vid}></img>



                    </a>



                </Container>





            </Container>






















            <Footer />

        </>





















    );
}