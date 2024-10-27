import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Image, Modal } from 'react-bootstrap';
import logo2 from "../assets/images/logo2.png";
import responsivebg from "../assets/images/responsive-bg.png";
import './job-title.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from '../hooks/useCookies';
import { API_URL } from '../api';

export default function AccountPending() {
    const { getCookie } = useCookies();
    const { token } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [sortcutmodal, setSortcutmodal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}user/verify/${token}`);
                const result = await response.json();
                if (response.ok) {
                    navigate("/pending");
                } else {
                    console.error('Error fetching user data:', result.message);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [token, navigate]);

    useEffect(() => {
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
        })();
    }, [getCookie]);



    const handleShowModal = () => {
        setShowModal(true);
    };

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        console.log(deferredPrompt)
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            console.log(deferredPrompt)
        };
    }, []);

    const handleAddToHomeScreen = () => {

        if (deferredPrompt) {

            console.log('User dismissed the A2HS prompt');
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    setShowModal(false);
                    
                    console.log('User dismissed the A2HS prompt');
                }
                setDeferredPrompt(null);
                setShowModal(false);
            });
        }
        else {
            setShowModal(false);
            setSortcutmodal(true)
        }
    };

    return (
        <div className='job-container'>
            {/* <div className='job-bg'>
                <Image className='responsive-bg' src={responsivebg} alt="Background"></Image>
            </div> */}
            <Container className='job-main'>
                <Container className='job-content' style={{
                    height : "94dvh"
                }}>
                    <Container className='logo-progressbar10'>
                        <Container className='logo-arrow10'>
                            <Image src={logo2} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                    </Container>
                    <div style={{
                        marginTop: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        alignItems: "center",
                        textAlign: "center",
                        justifyContent: "center",
                    }}>
                        <svg width="64" height="56" viewBox="0 0 64 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 27.9976C0 42.9541 12.1043 55.1281 26.9913 55.1281C32.487 55.1281 37.7739 53.4585 42.2957 50.3976C43.5478 49.4933 43.8957 47.8237 42.9913 46.502C42.087 45.2498 40.4174 44.902 39.0957 45.8063C35.5478 48.2411 31.3043 49.5628 26.9913 49.5628C15.1652 49.5628 5.56522 39.8933 5.56522 27.9976C5.56522 16.102 15.1652 6.4324 26.9913 6.4324C38.5391 6.4324 48 15.6846 48.4174 27.2324L41.9478 20.6933C40.8348 19.5802 39.0956 19.5802 37.9826 20.6933C36.8696 21.8063 36.8696 23.5454 37.9826 24.6585L48.6261 35.302C49.1826 35.8585 49.8783 36.1367 50.5739 36.1367C51.3391 36.1367 52.0348 35.8585 52.5217 35.302L63.1652 24.5889C64.2783 23.4759 64.2783 21.7368 63.1652 20.6237C62.0522 19.5107 60.313 19.5107 59.2 20.6237L53.913 25.9802C52.9391 11.9976 41.2522 0.867188 26.9913 0.867188C12.1043 0.867188 0 13.0411 0 27.9976ZM27.1304 12.2063C28.6609 12.2063 29.913 13.4585 29.913 14.9889V27.9976C29.913 28.7628 29.5652 29.4585 29.0087 29.9454L23.0261 35.9281C22.4696 36.4846 21.7739 36.7628 21.0087 36.7628C20.313 36.7628 19.5478 36.4846 19.0609 35.9281C17.9478 34.815 18.0174 33.0759 19.1304 31.9628L24.3478 26.815V14.9889C24.3478 13.4585 25.6 12.2063 27.1304 12.2063Z" fill="#4E1173" />
                        </svg>


                        <p style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            lineHeight: "36px",
                            textAlign: "center",
                        }}>Pending Approval</p>
                        <p style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            lineHeight: "24px",
                            textAlign: "center",
                            fontFamily: "Inter, sans-serif",
                        }}>
                            We're reviewing your account and will notify you via e-mail at {email}. In the meantime, you can update your profile information.
                        </p>
                        {/* <button className='global-next-btn' style={{
                            marginTop: "30px"
                        }} onClick={() => navigate("/updateprofile")}>
                            Update
                        </button> */}
                        <button className='global-cancel-button' style={{ marginTop: "30px", width: "236px" }} onClick={() => setShowModal(true)}>
                            Add Shortcut
                        </button>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        marginTop: "auto",
                        marginBottom: "2rem",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px"
                    }}>
                        <p>Chat and help support</p>
                        <p style={{
                            background: "linear-gradient(180deg, #FC8C66 -4.17%, #F76A7B 110.42%)",
                            backgroundClip: "text",
                            color: "transparent",
                            fontWeight: "bold",
                            fontSize: "16px"
                        }}>hello@mytamildate.com</p>
                    </div>
                </Container>
            </Container>
            <Modal centered className="selfie-modal" show={showModal} onHide={() => setShowModal(false)}
            >

                <Modal.Body className='selfie-modal-body' style={{
                    height: "440px"
                }}>
                    <div style={{
                        marginTop: "-40px"
                    }}>
                        <Image src={logo2} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                    </div>
                    <p style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        marginTop: "15px"
                    }}>
                        Add myTamilDate to your phone’s Homescreen
                    </p>
                    <p
                        style={{
                            fontSize: "16px",

                            marginTop: "-35px"
                        }}>
                        Access MTD effortlessly, just like other apps, without the need to download anything new.
                    </p>
                    <div>
                        <button style={{ width: "250px", marginTop: "-60px" }} type="submit" className='global-next-btn' onClick={() => handleAddToHomeScreen()}>
                            Add to homescreen
                        </button>
                        <button style={{ width: "250px", marginTop: "20px" }} type="submit" className='global-cancel-button' onClick={() => setShowModal(false)}>
                            Maybe later
                        </button>
                    </div>

                </Modal.Body>
            </Modal>
            <Modal centered className="selfie-modal" show={sortcutmodal} onHide={() => setSortcutmodal(false)}
            >
                <Modal.Body className='selfie-modal-body' style={{
                    height: "340px"
                }}>
                    <div style={{
                        marginTop: "-40px"
                    }}>
                        <Image src={logo2} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                    </div>

                    <p
                        style={{
                            fontSize: "16px",
                            marginTop: "30px",
                            lineHeight : "24px"
                        }}>
                        To add the app to your home screen, please open the browser's menu and select 'Add to Home Screen'.
                    </p>
                    <div>
                        <button type="submit" className='global-save-button' onClick={() => setSortcutmodal(false)}>
                            Okay
                        </button>
                    </div>

                </Modal.Body>
            </Modal>
        </div>
    );
};