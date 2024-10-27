import { useGoogleLogin } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import backarrow from "../../assets/images/backarrow.jpg";
import google from "../../assets/images/google 1.jpg";
import logo2 from "../../assets/images/logo2.png";
import responsivebg from "../../assets/images/responsive-bg.png";
import './sign-in-options.css';
import { API_URL } from '../../api';
import { useCookies } from '../../hooks/useCookies';
import { useAlert } from '../../Context/AlertModalContext';


export const SignInOptions = () => {

    const navigate = useNavigate();
    const cookies = useCookies();
    const alertmodal = useAlert();
    const [errorMessage, setErrorMessage] = useState('');

    const goToSignsuccessful = () => {
        window.location.assign('/user/home');
    };

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    "Authorization": `Bearer ${tokenResponse.access_token}`
                }
            });
            const data = await response.json();
            const userEmail = data.email;

            const res = await fetch(`${API_URL}/user/login/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userEmail,
                    usingGoogle: true
                })
            });
            const result = await res.json();
            
            if (res.ok) {
                cookies.setCookie('token', result.token, 30);
                cookies.setCookie('userId', result.Result[0].user_id);                
                if (result.Result && result.Result.length > 0) {
              

                    if (result.Result[0].approval === 10) {
                        goToSignsuccessful();
                        } else if (result.Result[0].approval === 30) {
                            goToSignsuccessful();
                        } else if (result.Result[0].approval === 20 || result.Result[0].approval === 15) {
                         cookies.setCookie('Name', result.Result[0].first_name, 20);
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
                            setErrorMessage('Please signup firsttt');
                        }
                    }
            }
        },
        onError: (error) => {
            console.log(error);
        },

    });

    const goToSignIn = () => {
        navigate("/signIn");
    };


    const goToSignInEmail = () => {
        navigate("/signinemail");
    };

    return (
        <div className='signin-options-container'>
            <div className='signin-options-bg'>
                <Image className='responsive-bg' src={responsivebg}></Image>
            </div>
            <Container className='signin-options-main'>
                <Container className='signin-options-content'>

                    <Container className='logo-progressbar1'>

                        <Container className='logo-arrow1'>
                            <Image src={backarrow} className='backarrow' onClick={() => navigate("/")} />
                            <Image src={logo2} alt="Logo" className='logo1' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        {/* <div className='track-btn1'>
                            <div></div>
                        </div> */}
                    </Container>

                    <Container className='signin-options-text'>
                        {/* <Image src={blank} /> */}
                        <span>Hi! It's good to see you again.</span>
                        <div className='signin-option-btn'>
                            <Button className='opt1' onClick={goToSignIn}>Login with phone number</Button>
                            <Button className='opt2' onClick={goToSignInEmail}>Login with email</Button>
                        </div>
                    </Container>
                    <Container className='signin-options-details'>
                        <Container className='sign-in-or-option'>
                            <Container className='or-line'>
                                <div className='line'></div>
                                <span>or</span>
                                <div className='line'></div>
                            </Container>
                            <button
                                className='google-option'
                                style={{
                                    position: 'relative',
                                    backgroundColor: 'white',
                                }}
                                onClick={login}
                            >
                                <Image src={google} alt="Google" />Login using Google
                            </button>
                            {errorMessage && <p className="text-danger error-message">{errorMessage}</p>}
                            <p>New here? Create an account. <a href='./signup' className='signup-signin'> Sign Up</a></p>
                            {/* <p>By continuing you accept our <br /><a className="signup-links" href="/PrivacyPolicy">Privacy Policy</a> and <a className="signup-links" target="_blank" href='/Tnc'>Terms of Use</a></p> */}
                        </Container>
                    </Container>
                </Container>
            </Container>








        </div >
    );
};
