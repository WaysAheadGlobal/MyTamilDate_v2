import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './located.css';
import { useNavigate } from 'react-router-dom';
import { Container, Image, Button } from 'react-bootstrap';
import backarrow from "../assets/images/backarrow.jpg";
import logo from "../assets/images/MTDlogo.png";
import responsivebg from "../assets/images/responsive-bg.png";
import location from "../assets/images/location.png";
import { useCookies } from '../hooks/useCookies';
import { API_URL } from '../api';
import { FaAngleDown } from 'react-icons/fa6';

export default function Height() {
    const navigate = useNavigate();
    const { getCookie } = useCookies();
    const [selectedHeight, setSelectedHeight] = useState({});
    const [heights, setHeights] = useState([]);
    const locationSelectRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Fetch existing location data on component mount
        fetch(`${API_URL}/customer/users/growths-options`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.growths) {
                    setHeights(data.growths);
                }
            })
            .catch(error => console.error('Error fetching location:', error));
    }, []);

    useEffect(() => {
        // Fetch existing location data on component mount
        fetch(`${API_URL}/customer/users/growths`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.growths) {
                    console.log(data.growths);
                    setSelectedHeight(data.growths?.[0]);
                }
            })
            .catch(error => console.error('Error fetching location:', error));
    }, []);

    const handleHeightSelect = (height) => {
        setSelectedHeight(height);
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Selected Height:', selectedHeight);
        if (Object.keys(selectedHeight).length === 0) {
            setErrorMessage("*Please make a selection.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/customer/users/growths`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },

                body: JSON.stringify({
                    growthId: selectedHeight.id,
                }),
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                navigate("/personality");
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    return (
        <div className='located-container'>
            <div className='located-bg'>
                <Image className='responsive-bg' src={responsivebg}></Image>
            </div>
            <Container className='located-main'>
                <Container className='located-content'>
                    <Container className='logo-progressbar7'>
                        <Container className='logo-arrow7'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
                            <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        <div className='track-btn7'>
                            <div></div>
                        </div>
                    </Container>
                    <Container >
                        <div className='located-text'>
                        <Image className='about-yourself-icon' src={location}></Image>
                        <p>How tall are you?</p>
                        </div>
                     
                
                    </Container>
                    <Container className='located-details'>
                        <Container ref={locationSelectRef} className='located-country collasped' style={{
                            overflow: 'hidden',
                            "--select-options-container-height": '20rem',
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}

                                onClick={() => { locationSelectRef.current.classList.toggle('collasped') }}
                            >
                                <input type="text" value={selectedHeight.name} readOnly style={{
                                    paddingInline: '0.5rem',
                                    paddingBlock: '0.75rem',
                                    width: '100%',
                                    border: "none",
                                    fontSize: "large"
                                }} />
                                <FaAngleDown size={16} style={{ marginRight: "1rem" }} />
                            </div>
                            <div className='scroll-container-vertical' style={{
                                height: '13rem',
                                maxHeight: '13rem',
                            }}>
                                {heights.map((height) => (
                                    <div
                                        key={height.id}
                                        className={`scroll-item ${selectedHeight === height ? 'selected' : ''}`}
                                        onClick={() => {
                                            handleHeightSelect(height)
                                            locationSelectRef.current.classList.add("collasped");
                                        }}
                                    >
                                        {height.name}
                                    </div>
                                ))}
                            </div>
                        </Container>
                        <div style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems :"flex-start",
                        
                        marginTop: "-6px"
                    }}>

                        {errorMessage && <p className="text-danger error-message" >{errorMessage}</p>}
                    </div>
                    </Container>
                    {/* <Button variant="primary" type="submit" className='located-nxt-btn' onClick={handleSubmit}>
                        Next
                    </Button> */}
                    <button  type="submit" className='global-next-bottom-fix-btn' onClick={handleSubmit}>
                                Next
                            </button>
                </Container>
            </Container>
        </div>
    );
};
