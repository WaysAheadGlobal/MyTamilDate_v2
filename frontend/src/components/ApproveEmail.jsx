import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Image, Modal } from 'react-bootstrap';
import { API_URL } from '../api';
import logo from "../assets/images/MTDlogo.png";
import logo2 from "../assets/images/logo2.png";
import responsivebg from "../assets/images/responsive-bg.png";
import { useCookies } from '../hooks/useCookies';
import './job-title.css';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../Context/AlertModalContext';

export default function ApproveEmail() {
    const { getCookie } = useCookies();
    const [email, setEmail] = React.useState('');
    const navigate = useNavigate();
    const alert = useAlert();
    const [showModal, setShowModal] = useState(false);
    const [showModalverified, setShowModalVerified] = useState(false);
    
    React.useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${API_URL}customer/user/email`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('token')}`
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    setEmail(result.email);
                } else {
                    console.error('Error fetching user data:', result.message);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        })()
    }, []);

    const resendMail = async () => {
        setShowModal(false);
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
    useEffect(() => {
        const intervalId = setInterval(checkVerificationfivesec, 5000);

        return () => clearInterval(intervalId);
    }, []);
    
    const checkVerificationfivesec = async () => {
        try {
            const response = await fetch(`${API_URL}/user/check-email-verification`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Email verified successfully!');
                console.log(data)
                if (data.emailVerified) {
                    // alert.setModal({
                    //     show: true,
                    //     title: "Email Verified",
                    //     message: "Your email has been verified successfully!",
                    //     buttonText: "Okay",
                    //     onButtonClick: () => {
                    //         navigate("/pending");  
                    //     }
                    // })      
                    setShowModalVerified(true);     

                } else {
                    // alert.setModal({
                    //     show: true,
                    //     title: "Email Verification",
                    //     message: "Your email has not been verified yet. Please check your email and verify your email address.",
                    //     buttonText: "Resend mail",
                    //     showCancelButton: true,
                    //     onButtonClick: () => {
                    //         resendMail();
                    //     }
                    // }) 
                    // setShowModal(true);      
                }
            }

        } catch (err) {
            console.error(err);
        }
    }

    const checkVerification = async () => {
        try {
            const response = await fetch(`${API_URL}/user/check-email-verification`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Email verified successfully!');
                if (data.emailVerified) {
                    // alert.setModal({
                    //     show: true,
                    //     title: "Email Verified",
                    //     message: "Your email has been verified successfully!",
                    //     buttonText: "Okay",
                    //     onButtonClick: () => {
                    //         navigate("/pending");  
                    //     }
                    // })      
                    setShowModalVerified(true);     

                } else {
                    // alert.setModal({
                    //     show: true,
                    //     title: "Email Verification",
                    //     message: "Your email has not been verified yet. Please check your email and verify your email address.",
                    //     buttonText: "Resend mail",
                    //     showCancelButton: true,
                    //     onButtonClick: () => {
                    //         resendMail();
                    //     }
                    // }) 
                    setShowModal(true);      
                }
            }

        } catch (err) {
            console.error(err);
        }
    }

    const EmailVerifiedSuccess = ()=>{
        setShowModalVerified(false);
        navigate("/user/home");  

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
                            <Image src={logo2} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                    </Container>
                    <div style={{
                        marginTop: "auto",
                        fontSize: "24px",
                        fontWeight: "500",
                        lineHeight: "36px",
                        textAlign: "center",

                    }}>
                        <svg width="67" height="54" viewBox="0 0 67 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M56.6667 0H10C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10V43.3333C0 45.9855 1.05357 48.529 2.92893 50.4044C4.8043 52.2798 7.34784 53.3333 10 53.3333H56.6667C59.3188 53.3333 61.8624 52.2798 63.7377 50.4044C65.6131 48.529 66.6667 45.9855 66.6667 43.3333V10C66.6667 7.34784 65.6131 4.8043 63.7377 2.92893C61.8624 1.05357 59.3188 0 56.6667 0ZM54.4333 6.66667L33.3333 22.5L12.2333 6.66667H54.4333ZM56.6667 46.6667H10C9.11594 46.6667 8.2681 46.3155 7.64298 45.6904C7.01786 45.0652 6.66667 44.2174 6.66667 43.3333V10.8333L31.3333 29.3333C31.9103 29.7661 32.6121 30 33.3333 30C34.0546 30 34.7563 29.7661 35.3333 29.3333L60 10.8333V43.3333C60 44.2174 59.6488 45.0652 59.0237 45.6904C58.3986 46.3155 57.5507 46.6667 56.6667 46.6667Z" fill="#642F85"/>
</svg>


                        <p style={{
                            fontSize: "24px",
                            fontWeight: "500",
                            lineHeight: "36px",
                            textAlign: "center",
                        }}>You are almost there</p>
                        <p style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            lineHeight: "20px",
                            textAlign: "center",
                            marginTop: "1rem",
                        }}>Please verify your email address. We've sent a note to {email}.</p>
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems :"center",
                        justifyContent : "center",
                        width: "100%",
                        gap: "5rem",
                        marginTop: "auto",
                        marginBottom: "2rem",
                        
                    }}>
                        {/* <Button variant="primary" onClick={checkVerification} style={{
                            width: "100%",
                            marginTop: "1rem",
                            background: "linear-gradient(180deg, #FC8C66 -4.17%, #F76A7B 110.42%)",
                            border: "none",
                            borderRadius: "9999px",
                            padding: "0.75rem",
                            fontSize: "1.25rem",
                            fontWeight: "bold",
                        }}>
                            Submit
                        </Button> */}
                        <button   onClick={checkVerification} type="submit" className='global-next-btn'>
                                Next
                            </button>
                    </div>
                </Container>
                <Modal centered className="selfie-modal" show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body className='selfie-modal-body'>
                    Your email has not been verified yet. Please check your email and verify your email address.
                        {/* <Button variant="secondary" className='selfie-modal-btn' onClick={() => setShowModal(false)}>
                            Close
                        </Button> */}


                        <div style={{
                            display : "flex",
                            justifyContent :"space-between",
                            alignItems :"center",
                            gap : "40px"
                        }}>

                       
                        <button   className='global-save-button'  onClick={() => setShowModal(false)}>
                        Okay
                            </button>
                        <button   className='global-cancel-button'  onClick={resendMail}>
                        Resend
                            </button>
                            </div>
                    </Modal.Body>
                </Modal>
                
                
                <Modal centered className="selfie-modal" show={showModalverified} onHide={() => setShowModalVerified(false)}>
                    <Modal.Body className='selfie-modal-body'>
                    Your email has been verified successfully!
                        {/* <Button variant="secondary" className='selfie-modal-btn' onClick={() => setShowModal(false)}>
                            Close
                        </Button> */}
                        <div style={{
                            marginTop : "60px"
                        }}>

                        <button   className='global-save-button'  onClick={ EmailVerifiedSuccess}>
                        Okay
                            </button>
                        </div>
                     
                        
                    </Modal.Body>
                </Modal>


            </Container>
        </div >
    );
};