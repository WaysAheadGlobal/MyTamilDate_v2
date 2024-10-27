import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './signup-verifyphone.css';
import { useNavigate } from 'react-router-dom';
import logo2 from "../assets/images/logo2.png";
import blank from "../assets/images/blank.png";
import responsivebg from "../assets/images/responsive-bg.png";
import Flag from 'react-world-flags';
import backarrow from "../assets/images/backarrow.jpg";
import { Container, Image, Form, Button, Dropdown, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { useAppContext } from '../Context/UseContext';
import { useCookies } from '../hooks/useCookies';
import { API_URL } from '../api';
import { countries } from "country-list-json";

export const SignupPhone = () => {
    const navigate = useNavigate();
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
    const { phoneNumber, setPhoneNumber, } = useAppContext();
    const [selectedCountry, setSelectedCountry] = useState('CA');
    const [selectedCountryInfo, setSelectedCountryInfo] = useState(countries.find(country => country.code === 'CA'));
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    
    const[loading, setLoading] = useState(false);
    const { setCookie } = useCookies();

    const searchInputRef = useRef(null); // Reference for the search input

    const handleCountrySelect = (countryCode) => {
        setSelectedCountry(countryCode);
        const countryInfo = countries.find(country => country.code === countryCode);
        setSelectedCountryInfo(countryInfo);
        setPhoneNumber('');
        toggleModal();
    };

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dial_code.includes(searchTerm)
    );

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handlePhoneNumberChange = (e) => {
        let rawValue = e.target.value.replace(/\D/g, ''); // Store the raw value without formatting

        // Format the value for display
        let formattedValue = rawValue;
        if (rawValue.length > 6) {
            formattedValue = `(${rawValue.substring(0, 3)}) ${rawValue.substring(3, 6)}-${rawValue.substring(6, 10)}`;
        } else if (rawValue.length > 3) {
            formattedValue = `(${rawValue.substring(0, 3)}) ${rawValue.substring(3, 6)}`;
        } else if (rawValue.length > 0) {
            formattedValue = `(${rawValue}`;
        }

        setFormattedPhoneNumber(formattedValue); // Update the formatted value for display
        console.log(rawValue)
        setPhoneNumber(rawValue); // Store the raw value in the state
    };

    const handleSubmit = async (e) => {
        if (isSendingOtp) return;
        console.log("clicked")
        e.preventDefault();
        const completePhoneNumber = selectedCountryInfo.dial_code + phoneNumber;
        if (phoneNumber.length === 0) {
            setErrorMessage('*Phone is required');
        } 
        else {
            setErrorMessage('');
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/user/signup/otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phone: completePhoneNumber,
                    }),
                });

                const result = await response.json();
                if (response.ok) {
                    
                    setCookie('phoneNumber', completePhoneNumber, 7);
                    navigate("/entercode");
                    setLoading(false)
                } else {
                    setErrorMessage(result.message || 'Failed to send OTP');
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
                setErrorMessage('An error occurred. Please try again later.');
            } finally {
                setIsSendingOtp(false); // Re-enable the button
              }
        }
    };

    useEffect(() => {
        if (showModal) {
            searchInputRef.current.focus(); 
        }
    }, [showModal]);
    

    return (
        <div className='signupphone-container'>
            <div className='signup-phone-bg'>
                <Image className='responsive-bg' src={responsivebg}></Image>
            </div>
            <Container className='signupphone-main'>
                <Container className='signupphone-content'>
                    <Container className='logo-progressbar1'>
                        <Container className='logo-arrow1'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
                            <Image src={logo2} alt="Logo" className='logo1' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        <div className='track-btn1'>
                            <div></div>
                        </div>
                    </Container>
                    <Container className='verify-phone-text'>
                        {/* <Image src={blank} /> */}
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="30" cy="30" r="30" fill="#4E1173"/>
<g clip-path="url(#clip0_3151_8417)">
<path d="M37.7009 35.8232L35.5859 33.7007C35.3769 33.4909 35.1285 33.3245 34.855 33.2109C34.5815 33.0973 34.2883 33.0389 33.9922 33.0389C33.696 33.0389 33.4028 33.0973 33.1293 33.2109C32.8558 33.3245 32.6074 33.4909 32.3984 33.7007L31.3109 34.7882C30.0865 34.0111 28.952 33.1005 27.9284 32.0732C26.9033 31.0476 25.9929 29.9134 25.2134 28.6907L26.3009 27.6032C26.5107 27.3941 26.6771 27.1457 26.7907 26.8723C26.9042 26.5988 26.9627 26.3055 26.9627 26.0094C26.9627 25.7133 26.9042 25.4201 26.7907 25.1466C26.6771 24.8731 26.5107 24.6247 26.3009 24.4157L24.1784 22.3007C23.9723 22.0902 23.726 21.9233 23.4542 21.8099C23.1823 21.6966 22.8905 21.639 22.5959 21.6407C22.2993 21.6399 22.0054 21.6979 21.7313 21.8111C21.4571 21.9244 21.208 22.0908 20.9984 22.3007L19.9784 23.3132C19.4922 23.8359 19.1294 24.4609 18.9165 25.1423C18.7037 25.8237 18.6462 26.5441 18.7484 27.2507C18.9884 30.0632 20.8334 33.4457 23.6759 36.2957C26.5184 39.1457 29.9384 40.9832 32.7509 41.2532C32.9608 41.2644 33.1711 41.2644 33.3809 41.2532C33.9863 41.2786 34.5907 41.1829 35.1587 40.9717C35.7266 40.7605 36.2467 40.438 36.6884 40.0232L37.7009 39.0032C37.9108 38.7935 38.0772 38.5445 38.1904 38.2703C38.3037 37.9962 38.3616 37.7023 38.3609 37.4057C38.3626 37.1111 38.305 36.8192 38.1916 36.5474C38.0782 36.2755 37.9114 36.0292 37.7009 35.8232Z" fill="white"/>
<path d="M37.7032 37.5616L36.6907 38.5741C36.2513 38.9927 35.7318 39.3181 35.1634 39.5308C34.595 39.7435 33.9894 39.839 33.3832 39.8116C33.1732 39.8116 32.9632 39.8116 32.7532 39.8116C29.9407 39.5716 26.5582 37.7266 23.7082 34.8766C20.8582 32.0266 19.0732 28.7116 18.7957 25.9141C18.7504 26.3579 18.7504 26.8052 18.7957 27.2491C19.0357 30.0616 20.8807 33.4441 23.7232 36.2941C26.5657 39.1441 29.9407 40.9816 32.7532 41.2516C32.963 41.2628 33.1733 41.2628 33.3832 41.2516C33.9886 41.277 34.593 41.1813 35.1609 40.9701C35.7289 40.7589 36.249 40.4364 36.6907 40.0216L37.7032 39.0016C37.9131 38.7919 38.0794 38.5429 38.1927 38.2687C38.306 37.9946 38.3639 37.7007 38.3632 37.4041C38.363 37.1609 38.3198 36.9197 38.2357 36.6916C38.1291 37.0194 37.9467 37.3175 37.7032 37.5616Z" fill="white"/>
<path d="M40.5 30.8325C40.3011 30.8325 40.1103 30.7535 39.9697 30.6128C39.829 30.4722 39.75 30.2814 39.75 30.0825C39.7609 28.7952 39.5167 27.5185 39.0316 26.326C38.5465 25.1335 37.8301 24.0489 36.9236 23.1348C36.0172 22.2207 34.9387 21.4951 33.7503 21C32.562 20.5049 31.2874 20.25 30 20.25C29.8011 20.25 29.6103 20.171 29.4697 20.0303C29.329 19.8897 29.25 19.6989 29.25 19.5C29.25 19.3011 29.329 19.1103 29.4697 18.9697C29.6103 18.829 29.8011 18.75 30 18.75C31.485 18.75 32.9553 19.0439 34.3261 19.6149C35.6969 20.1859 36.9411 21.0226 37.9869 22.0768C39.0328 23.131 39.8596 24.3818 40.4196 25.7572C40.9797 27.1325 41.2619 28.6051 41.25 30.09C41.248 30.2876 41.1681 30.4765 41.0277 30.6155C40.8873 30.7545 40.6976 30.8325 40.5 30.8325Z" fill="white"/>
<path d="M35.7602 30.3257C35.5612 30.3257 35.3705 30.2467 35.2298 30.1061C35.0892 29.9654 35.0102 29.7747 35.0102 29.5757C35.0182 28.9766 34.9064 28.3819 34.6815 27.8265C34.4566 27.2711 34.123 26.7662 33.7004 26.3415C33.2777 25.9167 32.7745 25.5807 32.2203 25.353C31.666 25.1254 31.0718 25.0107 30.4727 25.0157C30.2737 25.0157 30.083 24.9367 29.9423 24.7961C29.8017 24.6554 29.7227 24.4647 29.7227 24.2657C29.7227 24.0668 29.8017 23.8761 29.9423 23.7354C30.083 23.5948 30.2737 23.5157 30.4727 23.5157C31.2701 23.5107 32.0605 23.6647 32.7978 23.9686C33.535 24.2726 34.2042 24.7205 34.7664 25.2861C35.3285 25.8518 35.7723 26.5238 36.0717 27.2629C36.3711 28.002 36.5201 28.7934 36.5102 29.5907C36.5062 29.787 36.4255 29.974 36.2853 30.1114C36.145 30.2488 35.9565 30.3258 35.7602 30.3257Z" fill="white"/>
<path d="M41.25 30.09C41.25 30.2889 41.171 30.4797 41.0303 30.6203C40.8897 30.761 40.6989 30.84 40.5 30.84C40.5119 29.3551 40.2297 27.8825 39.6696 26.5072C39.1096 25.1318 38.2828 23.881 37.2369 22.8268C36.1911 21.7726 34.9469 20.9359 33.5761 20.3649C32.2053 19.7939 30.735 19.5 29.25 19.5C29.25 19.3011 29.329 19.1103 29.4697 18.9697C29.6103 18.829 29.8011 18.75 30 18.75C31.485 18.75 32.9553 19.0439 34.3261 19.6149C35.6969 20.1859 36.9411 21.0226 37.9869 22.0768C39.0328 23.131 39.8596 24.3818 40.4196 25.7572C40.9797 27.1325 41.2619 28.6051 41.25 30.09Z" fill="white"/>
<path d="M36.5078 29.5832C36.5078 29.7822 36.4288 29.9729 36.2881 30.1136C36.1475 30.2542 35.9567 30.3332 35.7578 30.3332C35.7667 29.5397 35.6181 28.7522 35.3206 28.0164C35.0231 27.2806 34.5825 26.6112 34.0245 26.0469C33.4665 25.4826 32.802 25.0346 32.0696 24.7288C31.3372 24.4231 30.5515 24.2657 29.7578 24.2657C29.7578 24.0668 29.8368 23.8761 29.9775 23.7354C30.1181 23.5948 30.3089 23.5157 30.5078 23.5157C31.3052 23.5107 32.0957 23.6647 32.8329 23.9686C33.5702 24.2726 34.2394 24.7205 34.8015 25.2861C35.3637 25.8518 35.8074 26.5238 36.1068 27.2629C36.4062 28.002 36.5553 28.7934 36.5453 29.5907L36.5078 29.5832Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_3151_8417">
<rect width="24" height="24" fill="white" transform="translate(18 18)"/>
</clipPath>
</defs>
</svg>

                    </Container>
                    <Container className='verify-phone-details'>
                        <Form onSubmit={handleSubmit} className='verify-phone-form'>
                            <Form.Group controlId="formPhoneNumber" className='verify-form-group'>
                                <Form.Label className='num-verify-lable'> What's your phone number?</Form.Label>
                                <div  style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Dropdown  >
                                        <div id="dropdown-basic"  onClick={() => setShowModal(true)} className='flag-box' style={{
                                        borderColor  : errorMessage ? "red" : "",
                                    }}>
                                            <Flag code={selectedCountry} style={{ width: '34px', height: '25px', marginRight: '10px' }} className='flag' />
                                            <span>{selectedCountryInfo.dial_code}</span>
                                        </div>
                                    </Dropdown>
                                    <Form.Control
                                        className={`num-verify-input ${errorMessage ? 'error' : ''}`}
                                        type="tel"
                                        placeholder="(xxx)xxx-xxx"
                                        value={formattedPhoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        
                                        style={{ flex: 1, marginLeft: '10px' }}
                                    />
                                </div>
                                <div  style={{marginTop : "5px"}}>

                                {errorMessage && <Form.Text style={{marginTop : "10px"}} className="text-danger error-message">{errorMessage}</Form.Text>}
                                </div>
                            </Form.Group>
                            <button  type="submit" disabled={isSendingOtp} className='global-next-btn'>
                                Next
                            </button>
                        </Form>
                        <Container className='or-option'>
                            <Container className='or-line'>
                                <div className='line'></div>
                                <span>or</span>
                                <div className='line'></div>
                            </Container>
                            <p style={{
                                fontWeight: '600',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px',
                            }}>Already have an account? <a href='/signinoptions' className='signup-signin'>Sign in here</a></p>
                            <p style={{
                                fontWeight: '600',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px',
                            }}>By continuing you accept our <br /><a className="signup-links" href="/PrivacyPolicy">Privacy Policy</a> and <a className="signup-links" target="_blank" href='/Tnc'>Terms of Use</a></p>
                        </Container>
                    </Container>
                </Container>
            </Container>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered                
            >
                <Modal.Body style={{
                    maxHeight: "500px",
                    overflowY: "auto",
                    width: "100%",
                }}>
                    <InputGroup className="mb-3" style={{
                        position: 'sticky',
                        top: '0',
                        width: '100%',
                    }}>
                        <FormControl
                            placeholder="Search Country"
                            aria-label="Search Country"
                            aria-describedby="basic-addon2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            ref={searchInputRef} // Set reference for the input field
                        />
                    </InputGroup>
                    {filteredCountries.map((country) => (
                        <div key={country.code} className='flag-item' onClick={() => handleCountrySelect(country.code)}>
                            <Flag code={country.code} style={{ width: '24px', height: '18px', marginRight: '10px' }} />
                            {country.name} ({country.dial_code})
                        </div>
                    ))}
                </Modal.Body>
            </Modal>
        </div>
    );
};
