import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../.././education.css';

import { useNavigate } from 'react-router-dom';
import { Container, Image, Button } from 'react-bootstrap';

import edu from "../../../../../assets/images/education.png";
import { API_URL } from '../../../../../api';
import { useCookies } from '../../../../../hooks/useCookies';
import Sidebar from '../../../../userflow/components/sidebar/sidebar';

const educationLevels = [
    'Associate', 'Bachelors', 'Doctorate', 'High school', 'Masters', 'Trade school', 'Prefer not to say'
];


export const EducationUpdate = () => {
    const navigate = useNavigate();
    const { getCookie } = useCookies();
    const [selectedOption, setSelectedOption] = React.useState(null);

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
        navigate("/updateprofile");
    };

    async function saveEducation() {
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
        <Sidebar>
<div style={{
                flex: "1",
                marginInline: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
                scrollbarWidth: "none",
                  
                
                  padding : "2rem"
            }}>
      
        <div className='education-container' style={{ overflow: 'hidden' }}>
            
            <Container className='education-main'>
                <Container className='education-content'>
                   
                    <Container className='education-details'>
    <div className='your-education'>
        <Container className='education-text'>
            <Image className='about-yourself-icon' src={edu} alt="Education Icon" />
            <p>What’s the highest level you’ve attained?</p>
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
{/* 
                    <Button variant="primary" type="submit" className='education-nxt-btn' onClick={saveEducation}>
                        Next
                    </Button> */}

                    <div className="d-flex justify-content-center" style={{ position: "fixed", bottom: "30px", width: "100%",gap: "30px" }}>
    <button className="global-cancel-button" onClick={ ()=> navigate('/updateprofile')}>
        Cancel
    </button>
    <button  type="submit" className="global-save-button" onClick={saveEducation}>
        Save
    </button>
</div>
                </Container>
            </Container>
        </div>
        </div>
        </Sidebar>
    );
};







