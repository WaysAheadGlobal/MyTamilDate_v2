import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './abt-yourself.css';
import { useNavigate } from 'react-router-dom';
import { Image, Container, Form, Button } from 'react-bootstrap';
import backarrow from "../assets/images/backarrow.jpg";
import logo from "../assets/images/MTDlogo.png";
import basicdetails from "../assets/images/basic-details.png";
import responsivebg from "../assets/images/responsive-bg.png";
import { useAppContext } from '../Context/UseContext';
import { useCookies } from '../hooks/useCookies';
import { API_URL } from '../api';

export const UpdateGender = () => {
    const { userDetails, setUserDetails } = useAppContext();
    const { getCookie } = useCookies();
    const navigate = useNavigate();

    const [havegender, setHavegender] = useState(0);
    const [wantGender, setWantGender] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [femaleActive, setFemaleActive] = useState(false);
    const [maleActive, setMaleActive] = useState(false);
    const [nonBinaryActive, setNonBinaryActive] = useState(false);
    const [femaleSvgColor, setFemaleSvgColor] = useState('#AAAAAA');
    const [maleSvgColor, setMaleSvgColor] = useState('#AAAAAA');
    const [nonBinarySvgColor, setNonBinarySvgColor] = useState('#AAAAAA');

    const handleFemaleButtonClick = () => {
        setFemaleActive(true);
        setMaleActive(false);
        setNonBinaryActive(false);
        setFemaleSvgColor('#8457A8');
        setMaleSvgColor('#AAAAAA');
        setNonBinarySvgColor('#AAAAAA');
        setHavegender(2);
    };

    const handleMaleButtonClick = () => {
        setFemaleActive(false);
        setMaleActive(true);
        setNonBinaryActive(false);
        setFemaleSvgColor('#AAAAAA');
        setMaleSvgColor('#8457A8');
        setNonBinarySvgColor('#AAAAAA');
        setHavegender(1);
    };

    const handleNonBinaryButtonClick = () => {
        setFemaleActive(false);
        setMaleActive(false);
        setNonBinaryActive(true);
        setFemaleSvgColor('#AAAAAA');
        setMaleSvgColor('#AAAAAA');
        setNonBinarySvgColor('#8457A8');
        setHavegender(3);
    };

    const [selectedOption, setSelectedOption] = useState(null);


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_URL}/customer/users/gender`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({
                    gender: havegender,
                    
                })
            });
    
            const result = await response.json();
            console.log('Response status:', response.status);
            console.log('Response body:', result);
    
            if (response.ok) {
                navigate("/updateprofile");
            } else {
                setErrorMessage(result.errors ? result.errors.map(error => error.msg).join(', ') : 'Error updating profile');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error updating profile');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/customer/users/gender`, {
                    headers: {
                        'Authorization': `Bearer ${getCookie('token')}`
                    }
                });

                const result = await response.json();
                if (response.ok) {
                    const { gender, want_gender } = result;
                    console.log(result);
                    setHavegender(gender);
                    setWantGender(want_gender);

                   
                    if (gender === 1) {
                        handleMaleButtonClick();
                    } else if (gender === 2) {
                        handleFemaleButtonClick();
                    } else if (gender === 3) {
                        handleNonBinaryButtonClick();
                    }

                    if (want_gender === 1) {
                        setSelectedOption('male');
                    } else if (want_gender === 2) {
                        setSelectedOption('female');
                    } else if (want_gender === 3) {
                        setSelectedOption('all');
                    }
                } else {
                    console.error('Error fetching user data:', result.message);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);
    

    return (
        <div className='birthday-container'>
            <div className='birthday-bg'>
                <Image className='responsive-bg' src={responsivebg}></Image>
            </div>
            <Container className='birthday-main'>
                <Container className='birthday-content'>
                    <Container className='logo-progressbar5'>
                        <Container className='logo-arrow5'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
                            <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        <div className='track-btn5'>
                            <div></div>
                        </div>
                    </Container>
                    <Container className='birthday-text'>
                        <Image className='about-yourself-icon' src={basicdetails}></Image>
                        <p>Tell us about yourself</p>
                    </Container>
                    <Container className='birthday-details'>
                        <Form className='birthday-form' onSubmit={handleSubmit}>
                            <Form.Group controlId="formgender" className='birthday-group'>
                                <Form.Label className='birthday-label'>What is Your Gender? *</Form.Label>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: "24px", justifyContent: "space-evenly" }}>
                                    <div className='gender-name'>
                                        <Button className={`gender-btn ${femaleActive ? 'active' : ''}`} onClick={handleFemaleButtonClick}>
                                            <svg width="34" height="48" viewBox="0 0 34 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="17.0007" cy="16.6667" r="14.6667" stroke={femaleSvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M17.0003 31.3359V46.0026V31.3359Z" fill="white" />
                                                <path d="M17.0003 31.3359V46.0026" stroke={femaleSvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.85352 39.4847H25.1498H8.85352Z" fill="white" />
                                                <path d="M8.85352 39.4847H25.1498" stroke={femaleSvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </Button>
                                        <span>Female</span>
                                    </div>
                                    <div className='gender-name'>
                                        <Button className={`gender-btn ${maleActive ? 'active' : ''}`} onClick={handleMaleButtonClick}>
                                            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="15.3041" cy="22.6947" r="13.3041" stroke={maleSvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M24.709 13.29L35.999 2" stroke={maleSvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M27.1309 2H36.0003V10.8694" stroke={maleSvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </Button>
                                        <span>Male</span>
                                    </div>
                                    <div className='gender-name'>
                                        <Button className={`gender-btn ${nonBinaryActive ? 'active' : ''}`} onClick={handleNonBinaryButtonClick}>
                                            <svg width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <ellipse cx="13.3205" cy="18.1537" rx="11.4846" ry="11.5366" stroke={nonBinarySvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.3203 29.6875V41.9932V29.6875Z" fill="white" />
                                                <path d="M13.3203 29.6875V41.9932" stroke={nonBinarySvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M7.19531 36.6118H19.4455H7.19531Z" fill="white" />
                                                <path d="M7.19531 36.6118H19.4455" stroke={nonBinarySvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M22.5078 2H30.1642V9.69104" fill="white" />
                                                <path d="M22.5078 2H30.1642V9.69104" stroke={nonBinarySvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M21.8203 10.3832L30.1658 2L21.8203 10.3832Z" fill="white" />
                                                <path d="M21.8203 10.3832L30.1658 2" stroke={nonBinarySvgColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </Button>
                                        <span>Non-Binary</span>
                                    </div>
                                </div>
                                {errorMessage && <Form.Text className="text-danger error-message">{errorMessage}</Form.Text>}
                            </Form.Group>

                            <div className="d-flex justify-content-center" style={{ position: "fixed", bottom: "30px", width: "100%", gap : "30px" }}>
    <button className="global-cancel-button" onClick={()=> navigate('/updateprofile')}>
        Cancel
    </button>
    <button  type="submit" className="global-save-button">
        Save
    </button>
    </div>
                        </Form>
                    </Container>
                </Container>
            </Container>
        </div>
    );
}
