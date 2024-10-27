import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import './get-in-touch.css';

import { Button, Container, Form, Image } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { SlArrowDown } from "react-icons/sl";
import verify from '../assets/images/verified.png';
import { Footer } from './footer';
import { NavBar } from './nav';
import { API_URL } from '../api';

function SuccessfullModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            centered
            style={{
                width: '100%',
               height :"100%",
                border: 'none',
                backgroundColor: "#000000B2"
            }}
        >
            <Modal.Body className='getintouch-modal'>
                <div className='getetintouch-model-main'>
                    <div className='getintouch-close' >
                        <button type="button" className="btn-close" onClick={props.onHide} style={{ color: '#FFFFFF', padding: '10px' }} >
                        </button>
                    </div>
                    <div className='getintouch-model-content'>
                        <Image className='verify-img' src={verify}></Image>
                        <span>Thanks! <br /> We've received your submission and will be in touch.</span>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export const GetInTouch = () => {
    const [modalShow, setModalShow] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        areaOfConcern: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
      // Prevent invalid characters from being typed
      const handleNameKeyPress = (e) => {
        const char = String.fromCharCode(e.which);
        if (!/^[a-zA-Z\s]*$/.test(char)) {
            e.preventDefault(); // Prevent non-alphabetic characters
        }
    };

    const handlePhoneKeyPress = (e) => {
        const char = String.fromCharCode(e.which);
        if (!/^[0-9]*$/.test(char)) {
            e.preventDefault(); // Prevent non-numeric characters
        }
    };

 

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
    
        try {
            const response = await fetch(`${API_URL}/customer/users/contact`, {  // Adjusted URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    message: formData.message,
                    issue: formData.areaOfConcern  
                })
            });
    
            if (response.ok) {
                console.log('Contact form submitted successfully');
                setModalShow(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    areaOfConcern: '',
                    message: ''
                });
            } else {
                const errorData = await response.json();
                console.error('Error submitting contact form:', errorData);
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
        }
    };
    


    return (
        <>
            <NavBar />
            <div className='getintouch-main'>
                <p>Get in Touch</p>
                <Container className='getintouch-content'>
                    <Container className='getintouch-form-container'>
                        <span>Let’s connect</span>
                        <Form onSubmit={handleSubmit} className='getintouch-form'>
                            <Form.Group controlId="formName" className='getintouch-group'>
                                <Form.Control className='getintouch-input'
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onKeyPress={handleNameKeyPress}
                                />
                            </Form.Group>

                            <Form.Group controlId="formEmail" className='getintouch-group'>
                                <Form.Control className='getintouch-input'
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formPhone" className='getintouch-group'>
                                <Form.Control className='getintouch-input'
                                    type="text"
                                    placeholder="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onKeyPress={handlePhoneKeyPress}
                                />
                            </Form.Group>

                            <Form.Group controlId="formAreaOfConcern" className='getintouch-group with-icon'>
                                <Form.Control className='getintouch-input'
                                    as="select"
                                    name="areaOfConcern"
                                    value={formData.areaOfConcern}
                                    onChange={handleChange}
                                    size="sm"
                                    style={{ fontFamily: '"Inter"', fontSize: '18px', fontWeight: 400, lineHeight: '27px', letterSpacing: '-0.01em', textAlign: 'left', color: '#5E5E5E' }}
                                >
                                    <option value="" className="option-style" style={{ fontFamily: '"Inter"', fontSize: '18px', fontWeight: 400, lineHeight: '27px', letterSpacing: '-0.01em', textAlign: 'left', color: '#5E5E5E' }}>Select</option>
                                    <option value="I have a technical issue" className="option-style" style={{ fontFamily: '"Inter"', fontSize: '18px', fontWeight: 400, lineHeight: '27px', letterSpacing: '-0.01em', textAlign: 'left', color: '#5E5E5E' }}>I have a technical issue</option>
                                    <option value="I have a question" className="option-style" style={{ fontFamily: '"Inter"', fontSize: '18px', fontWeight: 400, lineHeight: '27px', letterSpacing: '-0.01em', textAlign: 'left', color: '#5E5E5E' }}>I have a question</option>
                                    <option value="I have a billing issue" className="option-style" style={{ fontFamily: '"Inter"', fontSize: '18px', fontWeight: 400, lineHeight: '27px', letterSpacing: '-0.01em', textAlign: 'left', color: '#5E5E5E' }}>I have a billing issue</option>
                                </Form.Control>
                                <SlArrowDown className="arrow-icon" />
                            </Form.Group>

                            <Form.Group controlId="formMessage" className='getintouch-group'>
                                <Form.Control className='getintouch-message'
                                    as="textarea"
                                    placeholder="Message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <div className='connect-btn-box'>
                                {/* <Button variant="primary" className='getintouch-btn' type="submit">
                                    Submit
                                </Button> */}
                                <button  type="submit" className='global-next-btn'>
                                Submit
                            </button>
                            </div>
                        </Form>
                    </Container>

                    <Container className='get-bg-container'>
                        {/* <Image className='get-bg' src={getbg}></Image> */}
                    </Container>
                </Container>
            </div>
            <Footer />

            <SuccessfullModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
};
