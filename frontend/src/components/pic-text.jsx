import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'react-bootstrap';
import arrow from '../assets/images/arrow.png';
// import c1 from '../assets/images/lp1.png';
// import c2 from '../assets/images/lp2.png';
// import c3 from '../assets/images/lp3.png';

import c1 from '../assets/images/lp11.png';
import c2 from '../assets/images/lp22.png';
import c3 from '../assets/images/lp33.png';
import './pic-text.css';

export const Pictext = () => {
    const picTextMainRef = useRef(null);
    const entryRefs = useRef([]);

    const [mobile, setMobile] = useState(false);


    useEffect(() => {
        if (window.innerWidth < 1070) {
            setMobile(true);
        }
        window.addEventListener('resize', () => {
            if (window.innerWidth < 1070) {
                setMobile(true);
            } else {
                setMobile(false);
            }
        });
    }, [])

    return (
        <div className='pic-text-main' style={{
            paddingInline: mobile ? "1rem" : '2rem',
        }} ref={picTextMainRef}>
            <div className='pic1-text1 lineht ani' style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: "1.8rem",
                backgroundColor: "white"
            }} ref={el => entryRefs.current[0] = el}>
                <div className='pic1' style={{
                    width: "auto",
                    position: 'relative'
                }}>
                    {
                        mobile && (
                            <div style={{
                                marginTop: "-1rem",
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '4rem'
                            }}>
                                <h4><span className='discover-love' style={{
                                    // fontFamily: "PT serif, sans-serif",
                                    fontSize: "24px",
                                    color: "#4E1173",
                                    fontWeight : "bold"
                                }}>Discover Love with</span></h4>
                                <h4 style={{
                                    background: 'linear-gradient(360deg, #F87077 0%, #FB8968 100%)',
                                    color: 'transparent',
                                    backgroundClip: 'text',
                                    // fontFamily: "Poly, serif",
                                    fontSize: "18px",
                                    fontWeight : "bold"
                                }}>myTamilDate</h4>
                                <img src={arrow} alt="Arrow" width={200} height={200} style={{ position: "absolute", top: "-20px" }} />
                            </div>
                        )
                    }
                    <Image src={c1} className='c1' alt="Image 1" style={{
                        width: '24rem',
                        height: '100%',
                        objectFit: 'cover',
                        // paddingInline: '1rem'
                    }} />
                </div>
                <div className='text1' style={{
                    maxWidth: '30rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: mobile ? 'center' : "flex-start",
                    alignItems: mobile ? 'center' : "flex-start",
                    textAlign: "justify",
                    position: 'relative'
                }}>
                    {
                        !mobile && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: "26rem",
                            }}>
                                <h4><span  style={{
                                    fontWeight : "bold",
                                    color: "#4E1173",
                                    fontSize : "40px"
                                }}>Discover Love with</span></h4>
                                <h4 style={{
                                    background: 'linear-gradient(360deg, #F87077 0%, #FB8968 100%)',
                                    color: 'transparent',
                                    backgroundClip: 'text',
                                    marginBottom: '4rem',
                                     fontWeight : "bold"
                                    // fontFamily: "PT serif, sans-serif",
                                }}>myTamilDate</h4>
                                <img src={arrow} alt="Arrow" width={200} height={200} style={{ position: "absolute", top: "1.5rem" }} />
                            </div>
                        )
                    }
                    <p style={{
                        fontSize: "clamp(16px, 4vw, 18px)",
                        lineHeight: mobile ? '30px' : "36px",
                        marginTop: '1rem',
                        textAlign: "left",
                        width: !mobile ? "28rem" : "",
                        wordBreak: "break-word",
                        hyphens: "none"
                    }}>A surprise engagement at a myTamilDate couple's photoshoot! Find out how <span style={{ color: '#4E1173', }}>Abi & John</span> Bonded Over Faith & Their Tamil-German-British Connection.</p>
                    <a href='https://tamilculture.com/mytamildate-success-abi-john-bonded-over-faith-their-tamil-german-british-connection' className='view-success-btn' style={{ marginTop: "1rem" }}>View Success Story</a>
                </div>
            </div>

            <div className='pic3-text3 ani' style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: "1rem",
            }} ref={el => entryRefs.current[1] = el}>
                <div className='text1' style={{
                    maxWidth: '30rem',
                }}>
                    <h4 style={{ fontWeight: "bold", hyphens: "none" }}>Meet like-minded people from your community</h4>
                    <p style={{
                        fontSize: "clamp(16px, 4vw, 18px)",
                        lineHeight: mobile ? '30px' : "36px",
                        textAlign: "left",
                        wordBreak: "break-word",
                         hyphens: "none"
                    }}>Connect with others who truly understand your unique quirks, share your passions, and appreciate your inside jokes and who value what makes you, you.
</p>
                </div>
                <div className='pic1' style={{
                    width: "auto"
                }}>
                    <Image src={c2} className='c1' alt="Image 2" style={{
                        width: '24rem',
                        height: '100%',
                        objectFit: 'cover',
                        paddingInline: '1rem'
                    }} />
                </div>
            </div>

            <div className='pic1-text1 ani' style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: "1rem",
                backgroundColor: "white"
            }} ref={el => entryRefs.current[2] = el}>
                <div className='pic1' style={{
                    width: "auto"
                }}>
                    <Image src={c3} className='c1' alt="Image 3" style={{
                        width: '24rem',
                        height: '100%',
                        objectFit: 'cover',
                        paddingInline: '1rem'
                    }} />
                </div>
                <div className='text1' style={{
                    maxWidth: '30rem',
                }}>
                    <h4 style={{ fontWeight: "bold" }}>Discover meaningful connections</h4>
                    <p style={{
                        fontSize: "clamp(16px, 4vw, 18px)",
                        lineHeight: mobile ? '30px' : "36px",
                        textAlign: "left",
                        wordBreak: "break-word",
                         hyphens: "none"
                    }}>
                        Meet people who share your interests, values, and that undeniable spark who are also looking for a meaningful match. Whether they're around the corner or across the globe, we'll help you find your match.
                    </p>
                </div>
            </div>
        </div>
    );
}

