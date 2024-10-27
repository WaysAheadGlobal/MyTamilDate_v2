import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './religion.css';
import backarrow from "../assets/images/backarrow.jpg";
import logo from "../assets/images/MTDlogo.png";
import { Container, Image, Button } from 'react-bootstrap';
import responsivebg from "../assets/images/responsive-bg.png";
import religionIcon from "../assets/images/religion.png";
import langIcon from "../assets/images/lang.png";
import { useNavigate } from 'react-router-dom';
import { useCookies } from '../hooks/useCookies';
import { API_URL } from '../api';

const religions = [
    'Hindu', 'Catholic', 'Christian', 'Buddhist', 'Muslim', 'Jewish', 'Spiritual', 'Other', 'Prefer not to say'
];

export const Religion = () => {
    const { getCookie } = useCookies();
    const [allReligions, setAllReligions] = useState([]);
    const [selectedReligion, setSelectedReligion] = useState(null);
    const [allLanguages, setAllLanguages] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const[errorMessage, setErrorMessege] = useState("");
    const[lerrorMessage, setLErrorMessege] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/customer/users/religions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
        })
            .then(response => response.json())
            .then(data => {
                setAllReligions(data.religions);
                if (data.userReligion) {
                    setSelectedReligion(data.userReligion.name);
                }
            })
            .catch(error => {
                console.error('Error fetching religions:', error);
            });

        fetch(`${API_URL}/customer/users/language`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
        })
            .then(response => response.json())
            .then(data => {
                setAllLanguages(data.languages);
                console.log(allLanguages)
            })
            .catch(error => {
                console.error('Error fetching languages:', error);
            });

            fetch(`${API_URL}/customer/users/userlanguage`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            })
                .then(response => response.json())
                .then(data => {
                    setSelectedLanguages(data.selectedLanguages.map(lang => lang.language_id));
                })
                .catch(error => {
                    console.error('Error fetching user languages:', error);
                });
    }, []);



    const handleLanguageClick = (languageId) => {
        setSelectedLanguages(prevSelected => {
            if (prevSelected.includes(languageId)) {
                return prevSelected.filter(id => id !== languageId);
            } else {
                return [...prevSelected, languageId];
            }
        });
    };

    // const handleReligionClick = (e) => {
    //     e.preventDefault();
    //           if(!selectedReligion){
    //             setErrorMessege("*Please make a selection.")
    //             return;
    //           }
    //           if(selectedLanguages.length <1){
    //             setLErrorMessege("*Please make a selection.")
    //             return;
    //           }
             

    //     const religionId = allReligions.find(r => r.name === selectedReligion)?.id;

    //     if (religionId) {
    //         fetch(`${API_URL}/customer/users/religions`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${getCookie('token')}`
    //             },
    //             body: JSON.stringify({ religionId }),
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 console.log('Religion updated successfully:', data);
    //                 navigate("/edu");
    //             })
    //             .catch(error => {
    //                 console.error('Error updating religion:', error);
    //             });
    //     }
    //     console.log(selectedLanguages)
    //     fetch(`${API_URL}customer/users/language`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${getCookie('token')}`
    //         },
            
    //         body: JSON.stringify({ languages: selectedLanguages }),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log('Languages updated successfully:', data);
    //         })
    //         .catch(error => {
    //             console.error('Error updating languages:', error);
    //         });
    // };
   
    const handleReligionClick = (e) => {
        e.preventDefault();
        if (!selectedReligion) {
            setErrorMessege("*Please make a selection.");
            return;
        }
        if (selectedLanguages.length < 1) {
            setLErrorMessege("*Please make a selection.");
            return;
        }
    
        const religionId = allReligions.find(r => r.name === selectedReligion)?.id;
    
        if (religionId) {
            // Update religion
            fetch(`${API_URL}/customer/users/religions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({ religionId }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Religion updated successfully:', data);
    
                    // Update preferences with the selected religion ID
                    return fetch(`${API_URL}customer/user/preferences/save/religion_id`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getCookie('token')}`
                        },
                        body: JSON.stringify({ value: religionId })
                    });
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Preferences updated successfully:', data);
    
                    // Update languages
                    return fetch(`${API_URL}/customer/users/language`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getCookie('token')}`
                        },
                        body: JSON.stringify({ languages: selectedLanguages }),
                    });
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Languages updated successfully:', data);
                    navigate("/edu");
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };
    

    return (
        <div className='religion-container'>
            <div className='religion-bg'>
                <Image className='responsive-bg' src={responsivebg}></Image>
            </div>
            <Container className='religion-main'>
                <Container className='religion-content'>
                    <Container className='logo-progressbar8'>
                        <Container className='logo-arrow8'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.location.href = '/located'} />
                            <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        <div className='track-btn8'>
                            <div></div>
                        </div>
                    </Container>
                    <Container className='religion-details'>
                        <div className='your-religion'>
                            <Container className='religion-text'>
                                <Image className='about-yourself-icon' src={religionIcon}></Image>
                                <p>What are your religious beliefs?</p>
                            </Container>
                        
                            <Container className='all-religion'>
                                {allReligions.map((religion, index) => (
                                    <div
                                        key={index}
                                        className={`religion-item ${selectedReligion === religion.name ? 'active' : ''}`}
                                        onClick={() => setSelectedReligion(religion.name)}
                                    >
                                        {religion.name}
                                    </div>
                                ))}
                            </Container>
                            <div style={{marginTop : "-20px"}}>

                            {errorMessage && <p className="text-danger error-message">{errorMessage}</p>}
                            </div>
                        </div>
                        <div className='your-lang'>
                            <Container className='religion-text'>
                                <Image className='about-yourself-icon' src={langIcon}></Image>
                                <p>What language(s) do you speak?</p>
                            </Container>
                            <Container className='all-lang'>
                                {allLanguages.map((language, index) => (
                                    <div
                                        key={index}
                                        className={`lang-item ${selectedLanguages.includes(language.id) ? 'active' : ''}`}
                                        onClick={() => handleLanguageClick(language.id)}
                                    >
                                        {language.name}
                                    </div>
                                ))}
                            </Container>
                            <div style={{marginTop : "-13px",marginLeft : "20px"}}>

                            {lerrorMessage && <p className="text-danger error-message">{lerrorMessage}</p>}
                            </div>
                        </div>
                    </Container>
                    {/* <Button variant="primary" type="submit" className='religion-nxt-btn' onClick={handleReligionClick}>
                        Next
                    </Button> */}
                    <button  type="submit" className='global-next-bottom-fix-btn'  onClick={handleReligionClick}>
                                Next
                            </button>
                </Container>
            </Container>
        </div>
    );
};
