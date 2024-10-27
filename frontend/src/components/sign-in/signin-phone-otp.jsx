import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './signin-phone-otp';
import { useNavigate } from 'react-router-dom';
import responsivebg from "../../assets/images/responsive-bg.png";
import backarrow from "../../assets/images/backarrow.jpg";
import logo from "../../assets/images/MTDlogo.png";
import code from "../../assets/images/code.png";
import google from "../../assets/images/google 1.jpg";
import mail from "../../assets/images/Gmail.jpg";
import { useAppContext } from '../../Context/UseContext';
import { Container, Image, Form, Button } from 'react-bootstrap';
import { useCookies } from '../../hooks/useCookies';
import { API_URL } from '../../api';
import { useAlert } from '../../Context/AlertModalContext';

export const SignInPhoneOTP = () => {
    const { getCookie, setCookie } = useCookies();
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const alertmodal = useAlert();
    const goToSignsuccessful = () => {
        window.location.assign('/user/home');
    };

    // State for OTP code inputs
    const [code1, setCode1] = useState('');
    const [code2, setCode2] = useState('');
    const [code3, setCode3] = useState('');
    const [code4, setCode4] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Refs for input fields
    const code1ref = useRef(null);
    const code2ref = useRef(null);
    const code3ref = useRef(null);
    const code4ref = useRef(null);

    // Resend OTP timer state and handler
    const [resendTimer, setResendTimer] = useState(120);
    const [isResendDisabled, setIsResendDisabled] = useState(true); // Initially disabled

    useEffect(() => {
        const savedPhoneNumber = getCookie('phoneNumber');
        if (savedPhoneNumber) {
            setPhoneNumber(savedPhoneNumber);
        }

        // Countdown logic
        const interval = setInterval(() => {
            setResendTimer(prevTimer => {
                if (prevTimer > 0) {
                    return prevTimer - 1;
                } else {
                    setIsResendDisabled(false); // Enable resend button when timer reaches 0
                    clearInterval(interval);
                    return 0;
                }
            });
        }, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [getCookie, setPhoneNumber]);

    // Function to handle OTP code input change
    const handleCodeChange = (e, setter, nextRef) => {
        const value = e.target.value;
        // const otp = code1 + code2 + code3 + code4;
        // if (otp.length !== 5) {
        //     setErrorMessage('*Code must be at least 4 characters.');
        // }

        // if(otp.length === 3 ){
        //     setErrorMessage("")
        // }
        if (!isNaN(value) && value.length <= 1) {
            setter(value);
            if (value.length === 1 && nextRef) {
                nextRef.current.focus();
            }
        }
    };

    // Function to handle Backspace and focus on previous input
    const handleKeyDown = (e, prevRef) => {
        if (e.key === 'Backspace' && e.target.value === '' && prevRef) {
            prevRef.current.focus();
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("")
        const otp = code1 + code2 + code3 + code4;
        console.log(otp);
        console.log(phoneNumber);
        if (otp.length !== 4) {
            setErrorMessage('*Invalid verification code.');
        } else {
            setErrorMessage('');
            try {
                const token = getCookie('token');
                const response = await fetch(`${API_URL}/user/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify({
                        phone: phoneNumber,
                        otp: otp
                    }),
                });

                const result = await response.json();
                console.log(result);
                if (response.ok) {
 
                    setResendTimer(120);
                    setErrorMessage("")
                    setIsResendDisabled(true);
                    setCookie('token', result.token, 30);
                    setCookie('userId', result.Result[0].user_id, 30);
                    setCookie('Approval', result.Result[0].approval,30)
                    console.log(result);
                    console.log(result.Result[0].user_id);
                    if (result.Result && result.Result.length > 0) {
                        if (result.Result[0].approval === 10) {
                                navigate('/user/home');
                            } else if (result.Result[0].approval === 30) {
                                navigate('/user/home');
                            } else if (result.Result[0].approval === 20 || result.Result[0].approval === 15) {
                            setCookie('Name', result.Result[0].first_name, 30);
                                goToSignsuccessful();
                            }
                            
                            else if(result.Result[0].approval === 40){
                            //  alertmodal.setModal({
                            //      show: true,
                            //      title: 'Incomplete Registration',
                            //      message: "To access the application's features, please complete your registration process first.",
                            //  });
             
                             if(!result.Result[0].email){
                                 navigate('/emailverify');
                             }
                             else if(!result.Result[0].first_name){
                                 navigate('/basicdetails');
                             }
                             else if(!result.Result[0].gender){
                                 navigate('/abtyourself');
                             }
                             else if(!result.Result[0].media){
                                 navigate('/selfie');
                             }
                             else if(!result.Result[0].location_id){
                                 navigate('/located');
                             }
                             else if(!result.Result[0].religion_id){
                                 navigate('/religion');
                             }
                             else if(!result.Result[0].study_id ){
                                 navigate('/edu');
                             }
                             else if(!result.Result[0].job_id ){
                                 navigate('/jobtitle');
                             }
                             else if(!result.Result[0].growth_id){
                                 navigate('/height');
                             }
                             else if(!result.Result[0].personality
                             ){
                                 navigate('/personality');
                             }
                             else if(!result.Result[0].question_answer
                             ){
                                 navigate('/profile-answers');
                             }
                             else if(!result.Result[0].email_verified_at)
                             {
                                 navigate('/approve');
                             }
                         }
                             else {
                                setErrorMessage('*Please signup first');
                            }
                        }
                    
                }
                else {
                    setErrorMessage("*"+result.message+"." || '*Failed to send code');
                }
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('An error occurred. Please try again later.');
            }
        }
    }

    // Function to resend OTP
    const resendotp = async (e) => {
        e.preventDefault();
        if (resendTimer === 0) {
            try {
                const response = await fetch(`${API_URL}/user/login/otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phone: phoneNumber,
                    }),
                });

                const result = await response.json();
                if (response.ok) {

                    setResendTimer(120); // Reset timer to 2 minutes on successful resend
                    setIsResendDisabled(true); // Disable resend button after OTP is sent
                } else {
                    setErrorMessage('*Please re-enter phone number');
                }
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('An error occurred. Please try again later.');
            }
        }
    };

    // Function to format remaining time in mm:ss format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className='entercode-container'>
            <div className='entercode-bg'>
                <Image className='responsive-bg' src={responsivebg}></Image>
            </div>

            <Container className='entercode-main'>
                <Container className='entercode-box'>

                    <Container className='logo-progressbar2'>
                        <Container className='logo-arrow2'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
                            <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                      
                    </Container>

                    <Container className='entercode-text'>
                        {/* <Image src={code} /> */}
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="30" cy="30" r="30" fill="#4E1173"/>
<path d="M34.5813 21.2786L34.5335 21.0958C34.515 21.0395 34.4793 20.9905 34.4313 20.9558C34.3833 20.921 34.3256 20.9023 34.2663 20.9023C34.2071 20.9023 34.1494 20.921 34.1014 20.9558C34.0534 20.9905 34.0177 21.0395 33.9992 21.0958L33.9373 21.2786H33.6898C33.6317 21.2789 33.5751 21.2972 33.5278 21.331C33.4806 21.3648 33.4449 21.4124 33.4258 21.4673C33.4067 21.5222 33.405 21.5816 33.4211 21.6375C33.4371 21.6933 33.4701 21.7428 33.5154 21.7792L33.7067 21.9339L33.611 22.2151C33.5963 22.255 33.5908 22.2978 33.5949 22.3401C33.599 22.3824 33.6127 22.4233 33.6349 22.4595C33.6571 22.4958 33.6873 22.5266 33.7231 22.5495C33.7589 22.5725 33.7994 22.587 33.8417 22.592C34.0048 22.6145 34.0863 22.5133 34.2523 22.3783C34.4351 22.5273 34.5335 22.6595 34.7304 22.578C35.0117 22.4626 34.8738 22.173 34.7979 21.9423C34.9779 21.7989 35.1579 21.6976 35.0792 21.4755C35.0004 21.2533 34.8373 21.2786 34.5813 21.2786ZM36.8313 21.2786L36.7835 21.0958C36.765 21.0395 36.7293 20.9905 36.6813 20.9558C36.6333 20.921 36.5756 20.9023 36.5163 20.9023C36.4571 20.9023 36.3994 20.921 36.3514 20.9558C36.3034 20.9905 36.2677 21.0395 36.2492 21.0958L36.1873 21.2786H35.9398C35.8817 21.2789 35.8251 21.2972 35.7778 21.331C35.7306 21.3648 35.6949 21.4124 35.6758 21.4673C35.6567 21.5222 35.655 21.5816 35.6711 21.6375C35.6871 21.6933 35.7201 21.7428 35.7654 21.7792L35.9567 21.9339L35.861 22.2151C35.8463 22.255 35.8408 22.2978 35.8449 22.3401C35.849 22.3824 35.8627 22.4233 35.8849 22.4595C35.9071 22.4958 35.9373 22.5266 35.9731 22.5495C36.0089 22.5725 36.0494 22.587 36.0917 22.592C36.2548 22.6145 36.3363 22.5105 36.5023 22.3783C36.6851 22.5273 36.7835 22.6595 36.9804 22.578C37.2617 22.4626 37.1238 22.173 37.0479 21.9423C37.2279 21.7989 37.4079 21.6976 37.3292 21.4755C37.2504 21.2533 37.0873 21.2786 36.8313 21.2786ZM32.3313 21.2786L32.2835 21.0958C32.265 21.0395 32.2293 20.9905 32.1813 20.9558C32.1333 20.921 32.0756 20.9023 32.0163 20.9023C31.9571 20.9023 31.8994 20.921 31.8514 20.9558C31.8034 20.9905 31.7677 21.0395 31.7492 21.0958L31.6873 21.2786H31.4398C31.3817 21.2789 31.3251 21.2972 31.2778 21.331C31.2306 21.3648 31.1949 21.4124 31.1758 21.4673C31.1567 21.5222 31.155 21.5816 31.1711 21.6375C31.1871 21.6933 31.2201 21.7428 31.2654 21.7792L31.4567 21.9339L31.361 22.2151C31.3463 22.255 31.3408 22.2978 31.3449 22.3401C31.349 22.3824 31.3627 22.4233 31.3849 22.4595C31.4071 22.4958 31.4373 22.5266 31.4731 22.5495C31.5089 22.5725 31.5494 22.587 31.5917 22.592C31.7548 22.6145 31.8363 22.5133 32.0023 22.3783C32.1851 22.5273 32.2835 22.6595 32.4804 22.578C32.7617 22.4626 32.6238 22.173 32.5479 21.9423C32.7279 21.7989 32.9079 21.6976 32.8292 21.4755C32.7504 21.2533 32.5873 21.2786 32.3313 21.2786ZM39.0813 21.2786L39.0335 21.0958C39.015 21.0395 38.9793 20.9905 38.9313 20.9558C38.8833 20.921 38.8256 20.9023 38.7663 20.9023C38.7071 20.9023 38.6494 20.921 38.6014 20.9558C38.5534 20.9905 38.5177 21.0395 38.4992 21.0958L38.4373 21.2786H38.1898C38.1317 21.2789 38.0751 21.2972 38.0278 21.331C37.9806 21.3648 37.9449 21.4124 37.9258 21.4673C37.9067 21.5222 37.905 21.5816 37.9211 21.6375C37.9371 21.6933 37.9701 21.7428 38.0154 21.7792L38.2067 21.9339L38.111 22.2151C38.0963 22.255 38.0908 22.2978 38.0949 22.3401C38.099 22.3824 38.1127 22.4233 38.1349 22.4595C38.1571 22.4958 38.1873 22.5266 38.2231 22.5495C38.2589 22.5725 38.2994 22.587 38.3417 22.592C38.502 22.6117 38.5835 22.5133 38.7523 22.3783C38.9351 22.5273 39.0335 22.6595 39.2304 22.578C39.5117 22.4626 39.3738 22.173 39.2979 21.9423C39.4779 21.7989 39.6579 21.6976 39.5792 21.4755C39.5004 21.2533 39.3373 21.2786 39.0813 21.2786ZM41.3313 21.2786L41.2835 21.0958C41.265 21.0395 41.2293 20.9905 41.1813 20.9558C41.1333 20.921 41.0756 20.9023 41.0163 20.9023C40.9571 20.9023 40.8994 20.921 40.8514 20.9558C40.8034 20.9905 40.7677 21.0395 40.7492 21.0958L40.6873 21.2786H40.4398C40.3817 21.2789 40.3251 21.2972 40.2778 21.331C40.2306 21.3648 40.1949 21.4124 40.1758 21.4673C40.1567 21.5222 40.155 21.5816 40.1711 21.6375C40.1871 21.6933 40.2201 21.7428 40.2654 21.7792L40.4567 21.9339L40.361 22.2151C40.3463 22.255 40.3408 22.2978 40.3449 22.3401C40.349 22.3824 40.3627 22.4233 40.3849 22.4595C40.4071 22.4958 40.4373 22.5266 40.4731 22.5495C40.5089 22.5725 40.5494 22.587 40.5917 22.592C40.752 22.6117 40.8335 22.5133 41.0023 22.3783C41.1851 22.5273 41.2835 22.6595 41.4804 22.578C41.7617 22.4626 41.6238 22.173 41.5479 21.9423C41.7279 21.7989 41.9079 21.6976 41.8292 21.4755C41.7504 21.2533 41.5873 21.2786 41.3313 21.2786Z" fill="white"/>
<path d="M41.8477 19.5H31.1602C30.7872 19.5 30.4295 19.6482 30.1658 19.9119C29.9021 20.1756 29.7539 20.5333 29.7539 20.9062V22.5937C29.7539 22.9667 29.9021 23.3244 30.1658 23.5881C30.4295 23.8518 30.7872 24 31.1602 24H35.2636L36.3042 25.0434C36.3304 25.0698 36.3615 25.0907 36.3957 25.105C36.43 25.1193 36.4668 25.1266 36.5039 25.1266C36.541 25.1266 36.5778 25.1193 36.6121 25.105C36.6463 25.0907 36.6774 25.0698 36.7036 25.0434L37.7442 24H41.8477C42.0323 24 42.2152 23.9636 42.3858 23.893C42.5564 23.8223 42.7114 23.7187 42.842 23.5881C42.9726 23.4575 43.0762 23.3025 43.1469 23.1319C43.2175 22.9613 43.2539 22.7784 43.2539 22.5937V20.9062C43.2539 20.7216 43.2175 20.5387 43.1469 20.3681C43.0762 20.1975 42.9726 20.0425 42.842 19.9119C42.7114 19.7813 42.5564 19.6777 42.3858 19.607C42.2152 19.5364 42.0323 19.5 41.8477 19.5ZM42.6914 22.5937C42.6914 22.8175 42.6025 23.0321 42.4443 23.1904C42.286 23.3486 42.0714 23.4375 41.8477 23.4375H37.6289C37.4686 23.4375 37.508 23.4375 36.5039 24.4472C35.4914 23.4375 35.5364 23.4375 35.3789 23.4375H31.1602C30.9364 23.4375 30.7218 23.3486 30.5635 23.1904C30.4053 23.0321 30.3164 22.8175 30.3164 22.5937V20.9062C30.3164 20.6825 30.4053 20.4679 30.5635 20.3096C30.7218 20.1514 30.9364 20.0625 31.1602 20.0625H41.8477C42.0714 20.0625 42.286 20.1514 42.4443 20.3096C42.6025 20.4679 42.6914 20.6825 42.6914 20.9062V22.5937Z" fill="white"/>
<path d="M26.1677 24.7979C25.8812 21.5024 22.4432 19.8854 22.2977 19.8194C22.1617 19.7555 22.0092 19.735 21.8612 19.7609C17.8922 20.4194 17.2952 22.7294 17.2712 22.8254C17.2385 22.9592 17.2437 23.0994 17.2862 23.2304C22.0202 37.9184 31.8587 40.6409 35.0927 41.5364C35.3417 41.6054 35.5472 41.6609 35.7032 41.7119C35.8812 41.7701 36.0746 41.7588 36.2447 41.6804C36.3437 41.6354 38.6807 40.5344 39.2522 36.9434C39.2775 36.7866 39.2523 36.6259 39.1802 36.4844C39.1292 36.3854 37.9067 34.0589 34.5167 33.2369C34.4017 33.2075 34.2812 33.2065 34.1658 33.2339C34.0503 33.2613 33.9432 33.3164 33.8537 33.3944C32.7842 34.3079 31.3067 35.2814 30.6692 35.3819C26.3957 33.2924 24.0092 29.2829 23.9192 28.5224C23.8667 28.0949 24.8462 26.5934 25.9727 25.3724C26.0435 25.2956 26.0974 25.2047 26.131 25.1058C26.1646 25.0068 26.1771 24.902 26.1677 24.7979Z" fill="white"/>
</svg>

                    </Container>

                    <Form onSubmit={handleSubmit} className='entercode-form'>
                        <Container className='entercode-content'>
                            <div>
                                <Form.Group controlId="formCode" className='entercode-form-group'>
                                    <Form.Label className='entercode-lable'>Enter Verification Code</Form.Label>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                        <Form.Control
                                            className={`entercode-input ${errorMessage ? 'error' : ''}`}
                                            type="tel"
                                            ref={code1ref}
                                            placeholder=""
                                            value={code1}
                                            onChange={(e) => handleCodeChange(e, setCode1, code2ref)}
                                            onKeyDown={(e) => handleKeyDown(e, null)}
                                            style={{ flex: 1 }}
                                        />
                                        <Form.Control
                                            className={`entercode-input ${errorMessage ? 'error' : ''}`}
                                            type="tel"
                                            ref={code2ref}
                                            placeholder=""
                                            value={code2}
                                            onChange={(e) => handleCodeChange(e, setCode2, code3ref)}
                                            onKeyDown={(e) => handleKeyDown(e, code1ref)}
                                            style={{ flex: 1, marginLeft: '10px' }}
                                        />
                                        <Form.Control
                                            className={`entercode-input ${errorMessage ? 'error' : ''}`}
                                            type="tel"
                                            ref={code3ref}
                                            placeholder=""
                                            value={code3}
                                            onChange={(e) => handleCodeChange(e, setCode3, code4ref)}
                                            onKeyDown={(e) => handleKeyDown(e, code2ref)}
                                            style={{ flex: 1, marginLeft: '10px' }}
                                        />
                                        <Form.Control
                                            className={`entercode-input ${errorMessage ? 'error' : ''}`}
                                            type="tel"
                                            ref={code4ref}
                                            placeholder=""
                                            value={code4}
                                            onChange={(e) => handleCodeChange(e, setCode4, null)}
                                            onKeyDown={(e) => handleKeyDown(e, code3ref)}
                                            style={{ flex: 1, marginLeft: '10px' }}
                                        />
                                    </div>
                                    <div style={{marginTop : "5px"}}>
                                    {errorMessage && <Form.Text className="text-danger error-message">{errorMessage}</Form.Text>}
                                    </div>
                                </Form.Group>

                                <div className='resend-timer'>
                                    <a href="#" onClick={resendotp} disabled={isResendDisabled}
                                    style={{ color : isResendDisabled ? "#cbcbcb" : "#5E5E5E" }}>Resend code</a>
                                    <span>{formatTime(resendTimer)} sec</span>
                                </div>
                            </div>
                            <button  type="submit" className='global-next-btn'>
                                Next
                            </button>
                        </Container>
                    </Form>
                </Container>
            </Container>
        </div>
    );
};
