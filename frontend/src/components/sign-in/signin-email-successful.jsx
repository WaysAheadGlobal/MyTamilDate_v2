
import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './signin-email-successful.css';
import { useNavigate } from 'react-router-dom';
import responsivebg from "../../assets/images/responsive-bg.png";
import backarrow from "../../assets/images/backarrow.jpg";
import logo from "../../assets/images/MTDlogo.png";
import Approve from "../../assets/images/Approve.png";

import { Container, Image, Form, Button } from 'react-bootstrap';

export const SignInEmailSuccessful = () => {
    const navigate = useNavigate();
    const goToSigninEmail = () => {
        navigate("/signinemail");
    };







    return (
        <div className='signinphone-successful-container'>
            <div className='signinphone-successful-bg'>
                <Image className='responsive-bg' src={responsivebg}></Image>
            </div>

            <Container className='signinphone-successful-main'>
                <Container className='signinphone-successful-box'>

                    <Container className='logo-progressbar2'>

                        <Container className='logo-arrow2'>
                            {/* <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} /> */}
                            <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        {/* <div className='track-btn2'>
                        <div></div>
                    </div> */}
                    </Container>
                    <Container className='signinphone-successful-text-box'>

                    <Container className='signinphone-successful-text'>
                        <Image src={Approve} />
                        <span className='signinphone-successful-t1'>
                            Successful
                        </span>

                        <span className='signinphone-successful-t2'>
                            Login has been successfulplease click on on continue to start discovering new people
                        </span>


                        <Button > Continue</Button>

                       
                    </Container>
                 
</Container>










                </Container>
            </Container>
        </div>
    );
}