import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './education.css';
import backarrow from "../assets/images/backarrow.jpg";
import logo from "../assets/images/MTDlogo.png";
import logo2 from "../assets/images/logo2.png";
import { useNavigate } from 'react-router-dom';
import { Container, Image, Button } from 'react-bootstrap';
import responsivebg from "../assets/images/responsive-bg.png";
import edu from "../assets/images/education.png";
import { API_URL } from '../api';
import { useCookies } from '../hooks/useCookies';

const educationLevels = [
    'Associate', 'Bachelors', 'Doctorate', 'High school', 'Masters', 'Trade school', 'Prefer not to say'
];

/* studies */

export const Education = () => {
    const navigate = useNavigate();
    const { getCookie } = useCookies();
    const [selectedOption, setSelectedOption] = React.useState(null);
    const[errorMessage, setErrorMessege] = useState("");

    useEffect(() => {

        (async () => {
            const response = await fetch(`${API_URL}/customer/users/studies`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setSelectedOption(data.studies?.[0]?.name);
            }
        })()

    }, [])



    const goTojobTitle = () => {
        navigate("/jobtitle");
    };

    async function saveEducation() {
        
        if(!selectedOption){
            setErrorMessege("*Please make a selection")
            return;
        }
        const response = await fetch(`${API_URL}/customer/users/studies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({ name: selectedOption }),
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            goTojobTitle();
        } else {
            console.log(data.message

            )
            
        }
    }


    return (
        <div className='education-container'>
            <div className='education-bg'>
                <Image className='responsive-bg' src={responsivebg} alt="Background"></Image>
            </div>
            <Container className='education-main'>
                <Container className='education-content'>
                    <Container className='logo-progressbar9'>
                        <Container className='logo-arrow9'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} alt="Back Arrow" />
                            <Image src={logo2} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        <div className='track-btn9'>
                            <div></div>
                        </div>
                    </Container>
                    <Container className='education-details'>
    <div className='your-education'>
        <Container className='education-text'>
            <Image className='about-yourself-icon' src={edu} alt="Education Icon" />
            <p>What’s the highest level of education you’ve attained?</p>
        </Container>
       
        <Container className='all-education'>
            <div className="outer-div">
                <div className="first-div">
                    <div className="inner-div">
                        <div
                            onClick={() => setSelectedOption("High school")}
                            className="sub-inner-div"
                            style={{
                                backgroundColor: selectedOption === "High school" ? '#F7ECFF' : 'transparent',
                            }}
                        >High school</div>
                        <div
                            onClick={() => setSelectedOption("Trade school")}
                            className="sub-inner-div"
                            style={{
                                backgroundColor: selectedOption === "Trade school" ? '#F7ECFF' : 'transparent',
                            }}
                        >Trade school</div>
                    </div>
                    <div className="inner-div">
                        <div
                            onClick={() => setSelectedOption("Associates")}
                            className="sub-inner-div"
                            style={{
                                backgroundColor: selectedOption === "Associates" ? '#F7ECFF' : 'transparent',
                            }}
                        >Associate</div>
                        <div
                            onClick={() => setSelectedOption("Bachelors")}
                            className="sub-inner-div"
                            style={{
                                backgroundColor: selectedOption === "Bachelors" ? '#F7ECFF' : 'transparent',
                            }}
                        >Bachelors</div>
                    </div>
                    <div className="inner-div">
                        <div
                            onClick={() => setSelectedOption("Masters")}
                            className="sub-inner-div"
                            style={{
                                backgroundColor: selectedOption === "Masters" ? '#F7ECFF' : 'transparent',
                            }}
                        >Masters</div>
                        <div
                            onClick={() => setSelectedOption("Doctorate")}
                            className="sub-inner-div"
                            style={{
                                backgroundColor: selectedOption === "Doctorate" ? '#F7ECFF' : 'transparent',
                            }}
                        >Doctorate</div>
                    </div>
                    {errorMessage && <p className="text-danger error-message" style={{
            marginLeft :"10px",
            marginTop :"-10px"
        }}>{errorMessage}</p>}
                </div>
                {/* <div
                    onClick={() => setSelectedOption("Prefer not to say")}
                    className="second-div"
                    style={{
                        backgroundColor: selectedOption === "Prefer not to say" ? '#F7ECFF' : 'transparent',
                    }}
                >
                    Prefer not to say
                </div> */}
            </div>
        </Container>
    </div>
</Container>

                    {/* <Button variant="primary" type="submit" className='education-nxt-btn' onClick={saveEducation}>
                        Next
                    </Button> */}
                    <button  type="submit" onClick={saveEducation} className='global-next-bottom-fix-btn'>
                                Next
                            </button>
                </Container>
            </Container>
        </div>
    );
};







