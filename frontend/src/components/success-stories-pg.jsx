
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './success-stories-pg.css';

import { Container, Image } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


import st1 from '../assets/images/st1.png';
import st2 from '../assets/images/st2.png';
import st3 from '../assets/images/st3.png';
import st4 from '../assets/images/st4.png';
import st5 from '../assets/images/st5.png';
import st6 from '../assets/images/st6.png';


import { Footer } from './footer';
import { Join } from './join';
import { NavBar } from './nav';

export const SuccessPage = () => {
    return (
        <div className='success-pg-main'>
            <NavBar />
            <Container fluid className='success-pg-team'>
                <Container className='success-pg-text'>

                    <p className='success-pg-heading' style={{
                        fontSize: "clamp(30px, 5vw, 40px)"
                    }}>Success Stories</p>
                    <p className='success-pg-sub' style={{
                        fontSize: "clamp(18px, 4vw, 18px)",
                        textAlign: 'center',
                        hyphens: "none"
                    }}>Matches are made daily & serious relationships are created monthly across North America, Europe & more on MTD! Get to know some of our couples.</p>
                </Container>
                <Container className='team-content'>
                    <Row fluid className="team-row">
                        <Col fluid className="team-col" xs={12} md={3}>
                            <div className="team-item">
                                <Image fluid className='team-image' src={st1} />
                                <div className="successpg-details">
                                    <span className='person-name'>Madhu & Niya</span>
                                    <span className='person-title'>It was love at first sight for Madhu and Niya, their first date was the most....</span>
                                    <a href='https://tamilculture.com/index.php/mytamildate-success-story-it-was-love-at-first-sight-for-madhu-niya' className='read-more'>Read more</a>
                                </div>
                            </div>
                        </Col>
                        <Col className="team-col" xs={12} md={3}>
                            <div className="team-item">
                                <Image fluid className='team-image' src={st2} />
                                <div className="successpg-details">
                                    <span className='person-name'>Abi & John</span>
                                    <span className='person-title'>Abi & John Bonded Over Faith & Their Tamil-German-British Connection...</span>
                                    <a href='https://tamilculture.com/mytamildate-success-abi-john-bonded-over-faith-their-tamil-german-british-connection' className='read-more'>Read more</a>
                                </div>
                            </div>
                        </Col>
                        <Col className="team-col" xs={12} md={3}>
                            <div className="team-item">
                                <Image fluid className='team-image' src={st3} />
                                <div className="successpg-details">
                                    <span className='person-name'>Jenani & Nav</span>
                                    <span className='person-title'>Jenani & Nav Found Each Other At The Right Time And Right Place In Life...</span>
                                    <a href="https://tamilculture.com/mytamildate-love-story-jenani-nav-found-each-other-at-the-right-time-and-right-place-in-life" className='read-more'>Read more</a>
                                </div>
                            </div>
                        </Col>
                    </Row>



                    <Row fluid className="team-row">
                        <Col fluid className="team-col" xs={12} md={3}>
                            <div className="team-item">
                                <Image fluid className='team-image' src={st4} />
                                <div className="successpg-details">
                                    <span className='person-name'>Agi & Ano</span>
                                    <span className='person-title'>Agi’s First Attempt With Online Dating Led Her To Soulmate Ano....</span>
                                    <a href='https://tamilculture.com/mytamildate-success-agis-first-attempt-with-online-dating-led-her-to-soulmate-ano' className='read-more'>Read more</a>
                                </div>
                            </div>
                        </Col>
                        <Col className="team-col" xs={12} md={3}>
                            <div className="team-item">
                                <Image fluid className='team-image' src={st5} />
                                <div className="successpg-details">
                                    <span className='person-name'>Celine & Santhous</span>
                                    <span className='person-title'>A Gentle Push Towards Online Dating By Family Brought Céline & Santhous Together....</span>
                                    <a href='https://tamilculture.com/mytamildate-success-a-gentle-push-towards-online-dating-by-family-brought-celine-santhous-together' className='read-more'>Read more</a>
                                </div>
                            </div>
                        </Col>
                        <Col className="team-col" xs={12} md={3}>
                            <div className="team-item">
                                <Image fluid className='team-image' src={st6} />
                                <div className="successpg-details">
                                    <span className='person-name'>Suji & Sinthu</span>
                                    <span className='person-title'>Suji & Sinthu's journey Is A Heartwarming Example Of Patience And Taking ....</span>
                                    <a href="https://tamilculture.com/mytamildate-love-story-patience-and-taking-chances-brought-suji-sinthu-together" className='read-more'>Read more</a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Join />
            <Footer />
        </div>
    );
}
