import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../.././religion.css';
import lang from './languages.module.css'

import { Container, Image, Button } from 'react-bootstrap';

import langIcon from "../../../../../assets/images/lang.png";
import { useNavigate } from 'react-router-dom';
import { useCookies } from '../../../../../hooks/useCookies';
import { API_URL } from '../../../../../api';
import Sidebar from '../../../../userflow/components/sidebar/sidebar';

const religions = [
    'Hindu', 'Catholic', 'Christian', 'Buddhist', 'Muslim', 'Jewish', 'Spiritual', 'Other', 'Prefer not to say'
];

export const LanguageUpdate = () => {
    const { getCookie } = useCookies();
    const [allReligions, setAllReligions] = useState([]);
    const [selectedReligion, setSelectedReligion] = useState(null);
    const [allLanguages, setAllLanguages] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
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

    const handleReligionClick = (e) => {
        console.log(selectedLanguages);
        e.preventDefault();
        fetch(`${API_URL}/customer/users/language`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
           
            body: JSON.stringify({ languages: selectedLanguages }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Languages updated successfully:', data);
                navigate("/updateprofile");
            })
            .catch(error => {
                console.error('Error updating languages:', error);
            });
    };

    
    return (
        <Sidebar>
             <div style={{
                flex: "1",
                marginInline: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
                
                padding : "2rem"
            }}>
        <div className='religion-container'style={{ overflow: 'hidden' }} >
         
            <Container className='religion-main'>
                <Container className='religion-content'>
               
                    <Container className='religion-details'>
                        {/* <div className='your-religion'>
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
                        </div> */}
                        <div className="your-lang" >
                            <Container className='religion-text'>
                                <Image className='about-yourself-icon' src={langIcon}></Image>
                                <p>What is your preferred language?</p>
                            </Container>
                            <Container style={{
    display: "flex",
    flexWrap: "wrap",
    maxHeight: "39vh",
    overflowY: "auto",
    borderRadius: "8px",
    padding: "10px",
    width: "100%",
    paddingRight: "calc(1.5rem * 0.5)",
    paddingLeft: "calc(1.5rem * 0.5)",
    marginRight: "auto",
    marginLeft: "auto"
  }}>
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
                        </div>
                    </Container>
                    {/* <Button variant="primary" type="submit" className='religion-nxt-btn' onClick={handleReligionClick}>
                        Next
                    </Button> */}

                    <div className="d-flex justify-content-center" style={{ position: "fixed", bottom: "30px", width: "100%",gap: "30px" }}>
    <button className="global-cancel-button" onClick={()=> navigate('/updateprofile')}>
        Cancel
    </button>
    <button  type="submit" className="global-save-button" onClick={handleReligionClick}>
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
