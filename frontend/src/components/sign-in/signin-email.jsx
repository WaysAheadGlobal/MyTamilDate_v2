
import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './signin-email.css';
import { useNavigate } from 'react-router-dom';
import responsivebg from "../../assets/images/responsive-bg.png";
import backarrow from "../../assets/images/backarrow.jpg";
import logo from "../../assets/images/MTDlogo.png";
import message from "../../assets/images/message.png";
import mail from "../../assets/images/Gmail.jpg";
import { Container, Image, Form, Button } from 'react-bootstrap';
import { API_URL } from '../../api';

export const SignInEmail = () => {



    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!email) {
            setErrorMessage('*Please enter a valid email address');
            return;
        } else if (!email.includes('@')) {
            setErrorMessage('*Please enter a valid email address');
            return;
        }

        const response = await fetch(`${API_URL}/user/login/email-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        });
        const data = await response.json();
          
        if (!response.ok) {
            setErrorMessage("*" + data.message+ ".");
            return;
        }

        navigate("/signinemailotp", {
            state: {
                email: email
            }
        });
        setEmail('');
        setErrorMessage('');
    };

    return (
        <div className='signin-emailverify-container'>
            <div className='signin-emailverify-bg'>
                <Image className='responsive-bg' src={responsivebg}></Image>
            </div>
            <Container className='signin-emailverify-main'>

                <Container className='signin-emailverify-box'>

                    <Container className='logo-progressbar3'>

                        <Container className='logo-arrow3'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
                            <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>

                    </Container>

                    <Container className='signin-emailverify-text'>
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="30" cy="30" r="30" fill="#4E1173"/>
<path d="M24.7352 30.0019L16.4688 35.3842V24.6196L24.7352 30.0019ZM35.2622 30.0019L43.5287 35.3842V24.6196L35.2622 30.0019ZM34.0544 30.7906L30.3584 33.1963C30.2495 33.2656 30.1241 33.3019 29.9987 33.3019C29.8733 33.3019 29.7479 33.2656 29.639 33.1963L25.943 30.7906L17.0165 36.6019L16.4985 36.9385C16.6602 37.8691 17.4719 38.5819 18.4487 38.5819H41.5487C42.5255 38.5819 43.3373 37.8724 43.4991 36.9385L42.9776 36.6019L34.0544 30.7906ZM29.9987 31.8532L42.9776 23.4019L43.4991 23.0653C43.3373 22.1314 42.5255 21.4219 41.5487 21.4219H18.4487C17.4719 21.4219 16.6602 22.1347 16.4985 23.0653L17.0165 23.4019L29.9987 31.8532Z" fill="white"/>
</svg>

                        {/* <Image src={message} /> */}
                        {/* <p>Enter your verification code</p> */}
                        {/* <p>Please enter the 4-digit code sent to you at +1 (905)216-5247</p> */}
                    </Container>
                    <Form onSubmit={handleSubmit} className='signin-emailverify-form'>
                        <Container className='signin-emailverify-content'>
                            <div style={{ width: '100%', alignItems: 'center' }}>
                                <Form.Group controlId="formCode" className='signin-emailverify-form-group'>
                                    <Form.Label className='signin-emailverify-lable'> Enter your email</Form.Label>

                                    <Form.Control
                                        className={`signin-emailverify-input ${errorMessage ? 'error' : ''}`}
                                        type="text"
                                        style={{ flex: 1 }}
                                        placeholder="Example@gmail.com"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                <div style={{marginTop : "5px"}}>

                                    {errorMessage && <Form.Text className="text-danger error-message">{errorMessage}</Form.Text>}
                </div>
                                </Form.Group>

                            </div>
                            <button  type="submit" className='global-next-btn'>
                                Next
                            </button>
                        </Container>
                    </Form>
                    {/* <Container className='or-option'>
                    <Container className='or-line'>
                        <div className='line'></div>
                        <span>or</span>
                        <div className='line'></div>
                    </Container>
                    <p>Already have an account? <a href='' >Sign in here</a></p>
                    <Container className='google-mail'>
                        <a href=''><Image src={google} alt="Google" />Sign Up using Google</a>
                        <a href=''><Image src={mail} alt="Mail" /></a>
                    </Container>
                </Container> */}
                </Container>
            </Container>
        </div>
    );
}