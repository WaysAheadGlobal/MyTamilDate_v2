import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './video.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container, Image, Form, Button } from 'react-bootstrap';

import vd1 from '../assets/images/vd1.png'
import vd2 from '../assets/images/vd2.png'
import vd3 from '../assets/images/vd3.png'


export const Video = () => {
    return (
        <>
            <Container fluid className='video-main'>
                <div className='video-text'>
                   
                    <p className='video-heading' >Dating While Tamil?</p>
                    <p className='video-sub'>Check out the MTD community's tips & insights!</p>
                </div>
                <Container className='video-content'>
                <p>jkfnjnf</p>
                <Row  fluid className="video-row">
                <p>nkjnskjfn</p>
                        <Col fluid className="video-col" xs={12} md={3}>
                        <p>nfknkjfn</p>
                            <a  href="https://www.instagram.com/mytamildate/" target="_blank"  className="video-item">
                                <img fluid className='video-image' src={vd1} />
                                <div className='play-btn'></div>
                               <p>ndfkn</p>
                            </a>
                        </Col>
                        <Col className="video-col" xs={12} md={3}>
                        <p>ndfkjns</p>
                            <a href='https://www.instagram.com/mytamildate/' target="_blank"  className="video-item">
                                <Image fluid className='video-image' src={vd2} />
                                <div className='play-btn'></div>
                                <p>nkfnk</p>
                            </a>
                        </Col>
                        <Col className="video-col" xs={12} md={3}>
                            <a href='https://www.instagram.com/mytamildate/' target="_blank" className="video-item">
                                <Image fluid className='video-image' src={vd3} />
                                <div className='play-btn'></div>
                            </a>
                        </Col>
                    </Row>
                </Container>
               
            </Container> 

        </>





    );}
