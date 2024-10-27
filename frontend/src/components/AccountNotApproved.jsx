import React, { useEffect, useState } from 'react'
import { Container, Image } from 'react-bootstrap'
import logo from "../assets/images/MTDlogo.png";
import logo2 from "../assets/images/logo2.png";
import responsivebg from "../assets/images/responsive-bg.png";
import './job-title.css';
import notApproved from "../assets/images/not-approved.png";
import { API_URL } from '../api';
import { useCookies } from '../hooks/useCookies';
import { useNavigate } from 'react-router-dom';

export default function AccountNotApproved() {
    const { getCookie } = useCookies();
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const Navigate = useNavigate();
    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/customer/users/latestrejection`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });

            const data = await response.json();
            setData(data);
            console.log(data);
        })()
    }, [])

    const updateStatus = async () => {
        try {
            const response = await fetch(`${API_URL}/customer/users/updatestatusagain`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const data = await response.json();
            console.log(data);
            // alert('Your request for approval has been resubmitted.');
            // Optionally navigate to a different page or update state
            window.location.href = `/user/home`;
        } catch (error) {
            console.error('Error updating status:', error);
            // alert('There was an error resubmitting your request. Please try again.');
        }
    };

    return (
        <div className='job-container'>
            {/* <div className='job-bg'>
                <Image className='responsive-bg' src={responsivebg} alt="Background"></Image>
            </div> */}
            <Container className='job-main'>
                <Container className='job-content' style={{
                    gap: "0px",
                    height: "95dvh"
                }}>
                    <Container className='logo-progressbar10'>
                        <Container className='logo-arrow10'>
                            <Image src={logo2} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                    </Container>
                    <div style={{

                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        alignItems: "center",
                        textAlign: "center",
                        justifyContent: "center",
                        // marginTop: "-34px"
                    }}>
                        {/* <img src={notApproved} alt="not-approved" /> */}
                        <svg width="87" height="87" viewBox="0 0 87 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M43.5 21.75C47.4875 21.75 50.75 25.0125 50.75 29C50.75 32.9875 47.4875 36.25 43.5 36.25C39.5125 36.25 36.25 32.9875 36.25 29C36.25 25.0125 39.5125 21.75 43.5 21.75ZM43.5 58C53.2875 58 64.525 62.6763 65.25 65.25H21.75C22.5837 62.64 33.7488 58 43.5 58ZM43.5 14.5C35.4888 14.5 29 20.9887 29 29C29 37.0112 35.4888 43.5 43.5 43.5C51.5112 43.5 58 37.0112 58 29C58 20.9887 51.5112 14.5 43.5 14.5ZM43.5 50.75C33.8212 50.75 14.5 55.6075 14.5 65.25V72.5H72.5V65.25C72.5 55.6075 53.1787 50.75 43.5 50.75Z" fill="#4E1173" />
                        </svg>

                        <div>

                        </div>
                        <p style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            lineHeight: "36px",
                            textAlign: "center",
                            marginTop: "-20px"
                        }}>Sorry, we can’t approve your profile just yet.</p>

                        <p style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            lineHeight: "20px",
                            textAlign: "center",
                            fontFamily: "Inter, sans-serif",
                            color: "#6c6c6c"
                        }}>
                            We're excited to help you find your perfect match! But we need a few more details to approve your profile. Please update the following information.
                        </p>
                    </div>


                    {data && (
                        <p style={{

                            marginBottom: "1rem",
                            fontSize: "16px",
                            fontWeight: "500",
                            textAlign: "center",

                            padding: "12px",
                            borderRadius: "16px"
                        }}>
                            Hi there! Having a complete profile helps you connect better with others. Please complete your bio and add real images which clearly show your face.

                        </p>
                    )}

                    {/* <button className='global-next-btn' onClick={()=> Navigate("/updateprofile")}>
                            Update
                        </button> */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        marginTop: "auto",
                        marginBottom: "3rem",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        marginTop: "-18px"
                    }}>

                        <button className='global-next-btn' style={{
                            width : "267px",
                            marginBottom : "10px"
                        }} onClick={updateStatus} >
                        Resubmit for Approval
                        </button>
                        <p
                            style={{
                                fontFamily: "Inter, sans-serif",
                                color: "#4e1173",
                                fontSize: "16px"
                            }}
                        >Almost there!</p>

                        <p style={{
                            marginTop: "1em",
                            fontSize: "16px"
                        }}>
                            Have questions? Contact us at hello@myTamilDate.com
                        </p>
                    </div>
                </Container>
            </Container>
        </div>
    )
}
