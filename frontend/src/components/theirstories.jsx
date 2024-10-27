import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './theirstories.css';

import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import st1 from '../assets/images/st11.png';
import st2 from '../assets/images/st6.png';
import st3 from '../assets/images/st3.png';

import { Image } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const TheirStories = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    const [index, setIndex] = React.useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    React.useEffect(() => {
        window.addEventListener("resize", () => {
            const ismobile = window.innerWidth < 768;
            if (ismobile !== isMobile) setIsMobile(ismobile);
        });
    }, [isMobile]);

    const goTomorestories = () => {
        navigate("/SuccessPage");
    };

    return (
        <Container fluid className='story-main' style={{
            marginTop: '4rem'
        }}>
            <div className='story-text'>
                <p className='story-heading' style={{
                     hyphens: "none"
                }}>
                    They met their Match on <span style={{ color: '#4E1173' }}>myTamilDate</span>
                </p>
            </div>
            <Container className='story-content'>
                {/* <div className="story-row">
                    <div className="story-col">
                        <div className="story-item">
                            <img className='story-image' src={st1} alt="Madhu & Niya" />
                            <div className="story-detail">
                                <span className='story-name'>Madhu & Niya</span>
                                <span className='story-title'>It was love at first sight for Madhu and Niya...</span>
                                <a  target='_blank' href='https://tamilculture.com/index.php/mytamildate-success-story-it-was-love-at-first-sight-for-madhu-niya' className='story-read-more'>Read more</a>
                            </div>
                        </div>
                    </div>
                    <div className="story-col">
                        <div className="story-item">
                            <img className='story-image' src={st2} alt="Abi & John" />
                            <div className="story-detail">
                                <span className='story-name'>Abi & John</span>
                                <span className='story-title'>Abi & John Bonded Over Faith & Connection...</span>
                                <a  target='_blank' href='https://tamilculture.com/mytamildate-success-abi-john-bonded-over-faith-their-tamil-german-british-connection' className='story-read-more'>Read more</a>
                            </div>
                        </div>
                    </div>
                    <div className="story-col">
                        <div className="story-item">
                            <img className='story-image' src={st3} alt="Jenani & Nav" />
                            <div className="story-detail">
                                <span className='story-name'>Jenani & Nav</span>
                                <span className='story-title'>Jenani & Nav Found Each Other At The Right Time...</span>
                                <a target='_blank' href='https://tamilculture.com/mytamildate-love-story-jenani-nav-found-each-other-at-the-right-time-and-right-place-in-life' className='story-read-more'>Read more</a>
                            </div>
                        </div>
                    </div>
                </div> */}


                <Row fluid className="team-row">
                    <Col fluid className="team-col" xs={12} md={3}>
                        <div className="team-item">
                            <Image fluid className='team-image' src={st1} />
                            <div className="successpg-details">
                                <span className='person-name'>Madhu & Niya</span>
                                <span className='person-title'>It was love at first sight for Madhu and Niya...</span>
                                <a href='https://tamilculture.com/index.php/mytamildate-success-story-it-was-love-at-first-sight-for-madhu-niya' className='read-more'>Read more</a>
                            </div>
                        </div>
                    </Col>
                    <Col className="team-col" xs={12} md={3}>
                        <div className="team-item">
                            <Image fluid className='team-image' src={st2} />
                            <div className="successpg-details">
                                <span className='person-name'>Suji & Sinthu</span>
                                <span className='person-title'>Suji & Sinthu's journey Is A Heartwarming...</span>
                                <a href='https://tamilculture.com/mytamildate-love-story-patience-and-taking-chances-brought-suji-sinthu-together' className='read-more'>Read more</a>
                            </div>
                        </div>
                    </Col>
                    <Col className="team-col" xs={12} md={3}>
                        <div className="team-item">
                            <Image fluid className='team-image' src={st3} />
                            <div className="successpg-details">
                                <span className='person-name'>Jenani & Nav</span>
                                <span className='person-title'>Jenani & Nav found each other at the right time...</span>
                                <a href="https://tamilculture.com/mytamildate-love-story-jenani-nav-found-each-other-at-the-right-time-and-right-place-in-life" className='read-more'>Read more</a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Button className='more-success-btn' onClick={goTomorestories}>More success stories</Button>
        </Container>
    );
};

/**
 * <Container fluid className='story-main'>
                        <div className='story-text'>
                            <p className='story-heading'>
                                They met their Match on <span style={{ color: '#4E1173' }}>myTamilDate</span>
                            </p>
                        </div>
                        <Carousel controls={false} indicators={false} activeIndex={index} onSelect={handleSelect} style={{
                            padding: "0 1rem"
                        }}>
                            <Carousel.Item>
                                <div className="team-item" style={{
                                    height: "36rem"
                                }}>
                                    <Image fluid className='team-image' src={st1} />
                                    <div className="successpg-details">
                                        <span className='person-name'>Madhu & Niya</span>
                                        <span className='person-title'>It was love at first sight for Madhu and Niya, their first date was the most....</span>
                                        <a href='https://tamilculture.com/index.php/mytamildate-success-story-it-was-love-at-first-sight-for-madhu-niya' className='read-more'>Read more</a>
                                    </div>
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div className="team-item" style={{
                                    height: "36rem"
                                }}>
                                    <Image fluid className='team-image' src={st2} />
                                    <div className="successpg-details">
                                        <span className='person-name'>Abi & John</span>
                                        <span className='person-title'>Abi & John Bonded Over Faith & Their Tamil-German-British Connection...</span>
                                        <a href='https://tamilculture.com/mytamildate-success-abi-john-bonded-over-faith-their-tamil-german-british-connection' className='read-more'>Read more</a>
                                    </div>
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div className="team-item" style={{
                                    height: "36rem"
                                }}>
                                    <Image fluid className='team-image' src={st3} />
                                    <div className="successpg-details">
                                        <span className='person-name'>Jenani & Nav</span>
                                        <span className='person-title'>Jenani & Nav Found Each Other At The Right Time And Right Place In Life...</span>
                                        <a href="https://tamilculture.com/mytamildate-love-story-jenani-nav-found-each-other-at-the-right-time-and-right-place-in-life" className='read-more'>Read more</a>
                                    </div>
                                </div>
                            </Carousel.Item>
                        </Carousel>
                    </Container>
 */
