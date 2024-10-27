import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './email-verify.css';
import { useNavigate } from 'react-router-dom';
import responsivebg from "../assets/images/responsive-bg.png";
import backarrow from "../assets/images/backarrow.jpg";
import logo from "../assets/images/MTDlogo.png";
import logo2 from "../assets/images/logo2.png";
import message from "../assets/images/message.png";

import mail from "../assets/images/Gmail.jpg";
import { Container, Image, Form, Button } from 'react-bootstrap';
import { useCookies } from '../hooks/useCookies';
import { API_URL } from '../api';

export const EmailVerify = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const { getCookie } = useCookies();
    const token = getCookie('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!email || !email.includes('@')) {
            setErrorMessage('*Please enter a valid email address');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/customer/users/updateemail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: email
                }),
            });

            const result = await response.json();
            if (response.ok) {
                updateStatus();
                navigate("/getstarted");
                setErrorMessage('');
            } else {
                setErrorMessage(result.message || (result.message === undefined ? '*Email is invalid.' : '*Failed to update email, try again'));
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    }

    const updateStatus = async (newStatus) => {
        try {
            const response = await fetch(`${API_URL}/user/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });
            if (response.ok) {
                console.log('Mail sent successfully! Please check your email.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='emailverify-container'>
            <div className='emailverify-bg'>
                <Image className='responsive-bg' src={responsivebg}></Image>
            </div>
            <Container className='emailverify-main'>
                <Container className='emailverify-box'>
                    <Container className='logo-progressbar3'>
                        <Container className='logo-arrow3'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
                            <Image src={logo2} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        <div className='track-btn3'>
                            <div></div>
                        </div>
                    </Container>

                    <Container className='emailverify-text'>
                        {/* <Image src={message} /> */}
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="30" cy="30" r="30" fill="#4E1173"/>
<path d="M24.7352 30.0019L16.4688 35.3842V24.6196L24.7352 30.0019ZM35.2622 30.0019L43.5287 35.3842V24.6196L35.2622 30.0019ZM34.0544 30.7906L30.3584 33.1963C30.2495 33.2656 30.1241 33.3019 29.9987 33.3019C29.8733 33.3019 29.7479 33.2656 29.639 33.1963L25.943 30.7906L17.0165 36.6019L16.4985 36.9385C16.6602 37.8691 17.4719 38.5819 18.4487 38.5819H41.5487C42.5255 38.5819 43.3373 37.8724 43.4991 36.9385L42.9776 36.6019L34.0544 30.7906ZM29.9987 31.8532L42.9776 23.4019L43.4991 23.0653C43.3373 22.1314 42.5255 21.4219 41.5487 21.4219H18.4487C17.4719 21.4219 16.6602 22.1347 16.4985 23.0653L17.0165 23.4019L29.9987 31.8532Z" fill="white"/>
</svg>

                    </Container>
                    <Form onSubmit={handleSubmit} className='emailverify-form'>
                        <Container className='emailverify-content'>
                            <div style={{ width: '100%', alignItems: 'center' }}>
                                <Form.Group controlId="formCode" className='emailverify-form-group'>
                                    <Form.Label className='emailverify-lable'>Enter your email</Form.Label>
                                    <Form.Control
                                        className={`emailverify-input ${errorMessage ? 'error' : ''}`}
                                        type="text"
                                        style={{ flex: 1 }}
                                        placeholder="example@example.com"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div style={{marginTop : "5px"}}>

                                    {errorMessage && <Form.Text className="text-danger error-message">{errorMessage}</Form.Text>}
                                    </div>
                                </Form.Group>
                            </div>
                            {/* <Button variant="primary" type="submit" className='emailverify-btn'>
                                Next
                            </Button> */}
                            <button  type="submit" className='global-next-btn'>
                                Next
                            </button>
                        </Container>
                    </Form>
                </Container>
            </Container>
        </div>
    );
}
