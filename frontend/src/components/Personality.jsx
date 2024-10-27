import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Image, InputGroup, Modal } from 'react-bootstrap';
import logo from "../assets/images/MTDlogo.png";
import backarrow from "../assets/images/backarrow.jpg";
import responsivebg from "../assets/images/responsive-bg.png";
import './job-title.css';

import { IoIosSearch } from "react-icons/io";
import { API_URL } from '../api';
import { useCookies } from '../hooks/useCookies';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../Context/AlertModalContext';

export default function Personality() {
    const [searchTerm, setSearchTerm] = useState('');
    const personalityListEndRef = useRef(null);
    const [hasAddedPersonality, setHasAddedPersonality] = useState(false);
    const [personalities, setPersonalities] = useState([]);
    const { getCookie } = useCookies();
    const [selectedPersonalities, setSelectedPersonalities] = useState([]);
    const navigate = useNavigate();
    const alert = useAlert();
    const [showModal, setShowModal] = useState(false);
    const filteredPersonality = personalities.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));


    useEffect(() => {
        // Fetch existing location data on component mount
        fetch(`${API_URL}/customer/users/personality-options`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.personalities) {
                    setPersonalities(data.personalities);
                }
            })
            .catch(error => console.error('Error fetching location:', error));
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/customer/users/personalities`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.personalities) {
                    console.log(data.personalities.map(p => p.name))
                    setSelectedPersonalities(data.personalities);
                }
            })
            .catch(error => console.error('Error fetching location:', error));
    }, [personalities]);

    useEffect(() => {
        if (hasAddedPersonality && personalityListEndRef.current) {
            personalityListEndRef.current.scrollIntoView({ behavior: 'smooth' });
            setHasAddedPersonality(false);
        }
    }, [hasAddedPersonality]);

    async function savePersonalities() {
        if (selectedPersonalities.length < 3 || selectedPersonalities.length > 8) {
            // Handle the case where there are fewer than 2 personalities selected
            // alert.setModal({
            //     show: true,
            //     title: 'Update Personalities',
            //     message: "Please select between 3 and 8 personalities. Selections below 3 or above 8 are not allowed."
            // });
            setShowModal(true);
            return;
        }
        console.log(selectedPersonalities);
        const response = await fetch(`${API_URL}/customer/users/personality`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({ personalities: selectedPersonalities.map(p => p.id) }),
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            navigate("/profile-answers");
        } else {

            console.log(data.massage)
        }
    }

    return (
        <div className='job-container'>
            <div className='job-bg'>
                <Image className='responsive-bg' src={responsivebg} alt="Background"></Image>
            </div>
            <Container className='job-main'>
                <Container className='job-content'>
                    <Container className='logo-progressbar10'>
                        <Container className='logo-arrow10'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} alt="Back Arrow" />
                            <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        <div className='track-btn10'>
                            <div></div>
                        </div>
                    </Container>
                    <Container className='job-details'>
                        <div className='your-job'>
                            <Container className='job-text'>
                                <div style={{
                                    width: "40",
                                    height: "40"
                                }}>


                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="20" cy="20" r="18" fill="#4E1173" />
                                        <path d="M17.3634 17.0516C17.328 16.3153 17.5856 15.5949 18.0798 15.0479C18.574 14.501 19.2647 14.172 20.0009 14.1328C20.737 14.172 21.4277 14.501 21.922 15.0479C22.4162 15.5949 22.6738 16.3153 22.6384 17.0516C22.6726 17.787 22.4144 18.506 21.9202 19.0517C21.4261 19.5974 20.7361 19.9254 20.0009 19.9641C19.2657 19.9254 18.5757 19.5974 18.0815 19.0517C17.5874 18.506 17.3292 17.787 17.3634 17.0516ZM28.7759 20.0016C28.7785 21.7436 28.2582 23.4462 27.2821 24.8891C27.2566 24.9332 27.2273 24.975 27.1946 25.0141C26.3882 26.1753 25.3127 27.124 24.06 27.7792C22.8073 28.4344 21.4146 28.7766 20.0009 28.7766C18.5872 28.7766 17.1945 28.4344 15.9417 27.7792C14.689 27.124 13.6135 26.1753 12.8071 25.0141C12.7745 24.975 12.7452 24.9332 12.7196 24.8891C11.9556 23.751 11.4688 22.4497 11.2985 21.0895C11.1281 19.7294 11.2789 18.3482 11.7386 17.0569C12.1984 15.7655 12.9544 14.5998 13.946 13.6533C14.9376 12.7069 16.1371 12.0059 17.4485 11.6068C18.7599 11.2076 20.1466 11.1213 21.4973 11.3547C22.8481 11.5882 24.1253 12.135 25.2266 12.9511C26.3279 13.7673 27.2226 14.8302 27.839 16.0546C28.4554 17.279 28.7762 18.6308 28.7759 20.0016ZM12.1634 20.0016C12.161 21.3332 12.4988 22.6433 13.1446 23.8078C14.5009 22.0266 17.1009 20.9141 20.0009 20.9141C22.9009 20.9141 25.5009 22.0266 26.8571 23.8078C27.4379 22.7614 27.7714 21.5959 27.8321 20.4007C27.8927 19.2054 27.6789 18.0121 27.207 16.9123C26.7351 15.8125 26.0176 14.8353 25.1096 14.0557C24.2016 13.2761 23.1271 12.7147 21.9686 12.4146C20.81 12.1145 19.5981 12.0836 18.4258 12.3243C17.2535 12.5651 16.1518 13.071 15.2053 13.8034C14.2588 14.5358 13.4925 15.4752 12.9652 16.5496C12.438 17.624 12.1637 18.8048 12.1634 20.0016Z" fill="white" />
                                    </svg>
                                </div>
                                <p>How would you describe your personality?</p>
                            </Container>
                            <InputGroup className='job-search-bar' style={{
                                overflow: "hidden",
                            }}>

                                <Form.Control
                                    className='job-search'
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    style={{
                                        border: "none",
                                        outline: "none",
                                        height: "100%"
                                    }}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <InputGroup.Text className='search-icon' style={{
                                    position: "relative",
                                    top: "0rem",
                                }}><IoIosSearch /></InputGroup.Text>
                            </InputGroup>
                            <div>
                                {selectedPersonalities.length < 3 || selectedPersonalities.length > 8 ? (
                                    <p style={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#4E1173",
                                        lineHeight: "18.5%",
                                        marginBottom: "20px"
                                    }}>Please select 3-8 options only.</p>
                                ) : null}
                            </div>
                            {/* <div className="job-columns">
      {selectedPersonalities.map((personality, index) => (
        <div
          key={index}
          className="job-item"
          onClick={() => {
            if (selectedPersonalities.find(p => p.name === personality.name)) {
              setSelectedPersonalities(selectedPersonalities.filter(p => p !== personality));
            } else {
              setSelectedPersonalities([...selectedPersonalities, personality]);
            }
          }}
          style={{
            backgroundColor: selectedPersonalities.find(p => p.name === personality.name) ? "rgb(179 73 245)" : "transparent",
            color: "#fff",
            padding: "10px",
            margin: "5px",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span>{personality.name}</span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPersonalities(selectedPersonalities.filter(p => p !== personality));
            }}
            style={{
              cursor: "pointer",
              color: "#fff",
              backgroundColor: "gray",
              borderRadius: "50%",
              padding: "0 5px",
              marginTop: "-50px",
              marginRight : "-20px"
            }}
          >
            ✖
          </span>
        </div>
      ))}
    </div> */}


                            <div className='job-colums' style={{
                                maxHeight: "50vh",
                                overflow: "auto",
                                paddingTop: "10px"
                            }}>
                                <div className="job-columns">
                                    {selectedPersonalities.map((personality, index) => (
                                        <div
                                            key={index}
                                            className="job-item"
                                            // onClick={() => {
                                            //     if (selectedPersonalities.find(p => p.name === personality.name)) {
                                            //         setSelectedPersonalities(selectedPersonalities.filter(p => p !== personality));
                                            //     } else {
                                            //         setSelectedPersonalities([...selectedPersonalities, personality]);
                                            //     }
                                            // }}
                                            style={{
                                                backgroundColor: selectedPersonalities.find(p => p.name === personality.name) ? "rgb(179 73 245)" : "transparent",
                                                color: "#fff",
                                                padding: "10px",
                                                margin: "5px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <span>{personality.name}</span>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedPersonalities(selectedPersonalities.filter(p => p !== personality));
                                                }}
                                                style={{
                                                    cursor: "pointer",
                                                    color: "#fff",
                                                    backgroundColor: "gray",
                                                    borderRadius: "50%",
                                                    padding: "0 5px",
                                                    marginTop: "-50px",
                                                    marginRight: "-15px"
                                                }}
                                            >
                                                ✖
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="job-columns"
                                    style={{
                                        marginRight: "10px",
                                        maxHeight: "40vh",
                                    }}>
                                    {filteredPersonality.map((personality, index) => (
                                        <div
                                            key={index}
                                            className='job-item'
                                            onClick={() => {
                                                if (selectedPersonalities.find(p => p.name === personality.name)) {
                                                    setSelectedPersonalities(selectedPersonalities.filter(p => p !== personality));
                                                } else {
                                                    setSelectedPersonalities([...selectedPersonalities, personality]);
                                                }
                                            }}
                                            style={{
                                                backgroundColor: selectedPersonalities.find(p => p.name === personality.name) ? "#F7ECFF" : "transparent",
                                            }}
                                        >
                                            {personality.name}
                                        </div>
                                    ))}
                                    <div ref={personalityListEndRef} />
                                </div>
                            </div>
                        </div>
                    </Container>
                    {/* <Button variant="primary" onClick={savePersonalities} type="submit" className='job-nxt-btn'>
                        Next
                    </Button> */}
                    <button type="submit" className='global-next-bottom-fix-btn' onClick={savePersonalities}>
                        Next
                    </button>
                </Container>

                <Modal centered className="selfie-modal" show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body className='selfie-modal-body'>
                        Please select between 3 and 8 personalities. Selections below 3 or above 8 are not allowed.
                        {/* <Button variant="secondary" className='selfie-modal-btn' onClick={() => setShowModal(false)}>
                            Close
                        </Button> */}
                        <button className='global-save-button' onClick={() => setShowModal(false)}>
                            Okay
                        </button>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};



