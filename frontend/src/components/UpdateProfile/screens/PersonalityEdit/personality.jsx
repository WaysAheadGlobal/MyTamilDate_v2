import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Image, InputGroup } from 'react-bootstrap';
import logo from "../../../../assets/images/MTDlogo.png";

import basicdetails from "../../../../assets/images/basic-details.png";
import persona from './personality.module.css';

import { IoIosSearch } from "react-icons/io";
import { API_URL } from '../../../../api';
import { useCookies } from '../../../../hooks/useCookies';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../userflow/components/sidebar/sidebar';

export default function UpdatePersonality() {
    const [searchTerm, setSearchTerm] = useState('');
    const personalityListEndRef = useRef(null);
    const [hasAddedPersonality, setHasAddedPersonality] = useState(false);
    const [personalities, setPersonalities] = useState([]);
    const { getCookie } = useCookies();
    const [selectedPersonalities, setSelectedPersonalities] = useState([]);
    const navigate = useNavigate();

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
            navigate("/");
        } else {
            alert(data.message);
        }
    }


    return (
        <Sidebar>
            <div style={{
                flex: "1",
                marginInline: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
            }}>
                <div className='job-container'>

                    <Container className='job-main'>
                        <Container className='job-content'>

                            <Container className='job-details'>
                                <div className='your-job'>
                                    <Container className='job-text'>

                                        <Image width="40" height="40" style={{ marginBottom: "20px" }} src={basicdetails} />
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
                                    <div style={{
                                        maxHeight: "50vh",
                                        overflow: "auto",
                                    }}>
                                        <div className="job-columns">
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
                            <div style={{
                                position: "absolute",
                                display: "flex",
                                alignItems: "left",
                                justifyContent: "center",
                                gap: "30px",
                                bottom: "38px"
                            }}>
                                <Button variant="primary" type="submit" className={persona.jobnxtbtn} onClick={() => {
                                    const answers = getCookie('answers');
                                    navigate('/updateprofile');
                                    // if (answers && Number(answers) >= 2) {
                                    //     navigate('/updateprofile');
                                    // } else {
                                    //     setAlert(true);
                                    // }
                                }}>
                                    Cancel
                                </Button>


                                <Button variant="primary" type="submit" className={persona.jobnxtbtn2} onClick={() => {
                                    const answers = getCookie('answers');
                                    navigate('/updateprofile');
                                    // if (answers && Number(answers) >= 2) {
                                    //     navigate('/updateprofile');
                                    // } else {
                                    //     setAlert(true);
                                    // }
                                }}>
                                    Save
                                </Button>
                            </div>
                        </Container>
                    </Container>
                </div>
            </div>
        </Sidebar>
    );
};



