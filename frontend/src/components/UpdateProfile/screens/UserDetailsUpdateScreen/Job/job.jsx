import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../.././job-title.css';
import backarrow from "../../../../../assets/images/backarrow.jpg";
import logo from "../../../../../assets/images/MTDlogo.png";
import { Container, Image, Button, Form, Modal, InputGroup } from 'react-bootstrap';
import responsivebg from "../../../../../assets/images/responsive-bg.png";
import job from "../../../../../assets/images/job.png";

import { IoIosSearch } from "react-icons/io";
import { API_URL } from '../../../../../api';
import { useCookies } from '../../../../../hooks/useCookies';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../../userflow/components/sidebar/sidebar';

const jobTypes = [
    'Anesthesiologist', 'Actor', 'Analyst', 'Anthropologist', 'Biologist', 'Business owner', 'Chef', 'Civil Engineer', 'Designer', 'Entrepreneur',
    'Accountant', 'Architect', 'Astronomer', 'Attorney', 'Barber', 'Bartender', 'Carpenter', 'Cashier', 'Chemist', 'Dentist', 'Economist',
    'Electrician', 'Farmer', 'Geologist', 'Graphic Designer', 'Hairdresser', 'Journalist', 'Librarian', 'Mathematician', 'Mechanical Engineer',
    'Nurse', 'Pharmacist', 'Photographer', 'Physicist', 'Pilot', 'Plumber', 'Police Officer', 'Professor', 'Psychologist', 'Radiologist',
    'Real Estate Agent', 'Sales Manager', 'Scientist', 'Software Developer', 'Surgeon', 'Teacher', 'Therapist', 'Veterinarian', 'Waiter', 'Writer',
    'Web Developer', 'UX/UI Designer', 'Marketing Specialist', 'Content Creator', 'Social Media Manager', 'Financial Advisor', 'Project Manager',
    'Consultant', 'Data Scientist', 'Data Analyst', 'Environmental Engineer', 'Logistician', 'Statistician', 'Event Planner', 'Fashion Designer',
    'Film Director', 'Game Developer', 'Interior Designer', 'Investment Banker', 'IT Specialist', 'Kindergarten Teacher', 'Music Producer',
    'Occupational Therapist', 'Operations Manager', 'Paralegal', 'Pet Groomer', 'Physical Therapist', 'Public Relations Specialist', 'Researcher',
    'Robotics Engineer', 'Sound Engineer', 'Speech Pathologist', 'Tax Advisor', 'Translator', 'Travel Agent', 'Urban Planner', 'Video Editor',
    'Zoologist'
];

export const JobTitleUpdate = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [customJobs, setCustomJobs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newJobTitle, setNewJobTitle] = useState('');
    const jobListEndRef = useRef(null);
    const [hasAddedJob, setHasAddedJob] = useState(false);
    const { getCookie } = useCookies();
    const [selectedOption, setSelectedOption] = React.useState(null);
    const navigate = useNavigate();

    const filteredJobs = jobTypes.filter(job => job.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSave = () => {
        setCustomJobs([...customJobs, newJobTitle]);
        setShowModal(false);
        setNewJobTitle('');
        setHasAddedJob(true);
    };

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/customer/users/jobs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setSelectedOption(data.jobs[0]?.name);
            }
        })();
    }, [])

    useEffect(() => {
        if (hasAddedJob && jobListEndRef.current) {
            jobListEndRef.current.scrollIntoView({ behavior: 'smooth' });
            setHasAddedJob(false);
        }
    }, [customJobs, hasAddedJob]);

    async function saveJobTitle() {
        const response = await fetch(`${API_URL}/customer/users/jobs`, {
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
            navigate("/updateprofile");
        } else {
            console.log(data.message);
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
                
                  padding : "2rem"
            }}>
   
        <div className='job-container' style={{ overflow: 'hidden' }}>
            
            <Container className='job-main'>
                <Container className='job-content'>
                 
                    <Container className='job-details'>
                        <div className='your-job'>
                            <Container className='job-text'>
                                <Image className='about-yourself-icon' src={job} alt="Job Icon" />
                                <p>What’s your job title?</p>
                            </Container>
                            <InputGroup className='job-search-bar'>
                                <Form.Control
                                    className='job-search'
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <InputGroup.Text className='search-icon'><IoIosSearch /></InputGroup.Text>
                            </InputGroup>
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
                                <div className="job-columns">
                                    {filteredJobs.map((job, index) => (
                                        <div onClick={() => setSelectedOption(job)} key={index} className='job-item' style={{
                                            backgroundColor: selectedOption === job ? '#F7ECFF' : 'transparent'
                                        }}>
                                            {job}
                                        </div>
                                    ))}
                                    {customJobs.map((job, index) => (
                                        <div key={index + filteredJobs.length} onClick={() => setSelectedOption(job)} className='job-item' style={{
                                            backgroundColor: selectedOption === job ? '#F7ECFF' : 'transparent'
                                        }}>
                                            {job}
                                        </div>
                                    ))}
                                    <div ref={jobListEndRef} />
                                </div>
                            </Container>
                            <div className='not-seeing-job'>
                                Not seeing your job?
                                <a href='#' onClick={() => setShowModal(true)}>Add here</a>
                            </div>
                        </div>
                    </Container>
                    {/* <Button variant="primary" type="submit" onClick={saveJobTitle} className='job-nxt-btn'>
                        Next
                    </Button> */}
                    <div className="d-flex justify-content-center" style={{gap : "30px", position: "fixed", bottom: "30px", width: "100%" }}>
    <button className="global-cancel-button" onClick={()=> navigate('/updateprofile')}>
        Cancel
    </button>
    <Button  type="submit" variant="primary" className="btn-yes" onClick={saveJobTitle}>
        Save
    </Button>
</div>
                </Container>
            </Container>
            <Modal show={showModal} centered onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title className='job-model-title'>Add your job title</Modal.Title>
                </Modal.Header>
                <Modal.Body className='job-modal-body'>
                    <Form.Control
                        className='job-model-form'
                        type="text"
                        placeholder="Type here...!"
                        value={newJobTitle}
                        onChange={(e) => setNewJobTitle(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer className='job-model-footer'>
                    <button className="global-cancel-button" onClick={() => setShowModal(false)}>
                        Cancel
                    </button>
                    <button className="global-save-button" onClick={handleSave}>
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
        </div>
        </Sidebar>
    );
};



