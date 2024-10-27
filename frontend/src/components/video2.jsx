import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button, Container } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import "./video2.css";

import CloseIcon from '@mui/icons-material/Close';
import vd1 from '../assets/images/vd1.png';
import vd2 from '../assets/images/vd2.png';
import vd3 from '../assets/images/vd3.png';

export const Video2 = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [videoURL, setVideoURL] = React.useState("https://www.instagram.com/reel/CbiMcvWDt_V/embed/");

    return (

        <Container className='video2-main' style={{ marginTop: "4rem" }}>
            <VerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                videoURL={videoURL} />
            <p>Dating While Tamil?</p>
            <span style={{ textAlign: "center" }}>Check out the MTD community's tips & insights! </span>

            <Container className='video2-content'>
                <a onClick={(e) => {
                    setModalShow(true);
                    setVideoURL("https://www.instagram.com/reel/CbiMcvWDt_V/embed/");
                    document.querySelector('.vid2.active').classList.remove('active');
                    e.target.parentNode.classList.add('active');
                    document.querySelector('.controls div.active').classList.remove('active');
                    document.querySelector('.controls div:nth-child(1)').classList.add('active');
                }} className='vid2' style={{ cursor: "pointer" }}>
                    <img className='video2-img' src={vd1}>
                    </img>
                    <div className='play-icon'></div>

                </a>
                <a onClick={(e) => {
                    setModalShow(true);
                    setVideoURL("https://www.instagram.com/reel/C6EPQwmvOPp/embed/");
                    document.querySelector('.vid2.active').classList.remove('active');
                    e.target.parentNode.classList.add('active');
                    document.querySelector('.controls div.active').classList.remove('active');
                    document.querySelector('.controls div:nth-child(2)').classList.add('active');
                }} className='vid2 active' style={{ cursor: "pointer" }}>
                    <img className='video2-img' src={vd2} >
                    </img>
                    <div className='play-icon'></div>

                </a>
                <a onClick={(e) => {
                    setModalShow(true);
                    setVideoURL("https://www.instagram.com/reel/CsT1_nlB5VR/embed/");
                    document.querySelector('.vid2.active').classList.remove('active');
                    e.target.parentNode.classList.add('active');
                    document.querySelector('.controls div.active').classList.remove('active');
                    document.querySelector('.controls div:nth-child(3)').classList.add('active');
                }} className='vid2' style={{ cursor: "pointer" }}>
                    <img className='video2-img' src={vd3}>
                    </img>
                    <div className='play-icon'></div>
                </a>
            </Container>
            <div className='controls'>
                <div onClick={(e) => {
                    document.querySelector('.vid2.active').classList.remove('active');
                    document.querySelector('.vid2').classList.add('active');
                    document.querySelector('.controls div.active').classList.remove('active');
                    e.target.classList.add('active');
                }}></div>
                <div className='active' onClick={(e) => {
                    document.querySelector('.vid2.active').classList.remove('active');
                    document.querySelector('.vid2:nth-child(2)').classList.add('active');
                    document.querySelector('.controls div.active').classList.remove('active');
                    e.target.classList.add('active');
                }}></div>
                <div onClick={(e) => {
                    document.querySelector('.vid2.active').classList.remove('active');
                    document.querySelector('.vid2:nth-child(3)').classList.add('active');
                    document.querySelector('.controls div.active').classList.remove('active');
                    e.target.classList.add('active');
                }}></div>
            </div>
        </Container>
    );
}

function VerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Button onClick={props.onHide} style={{
                marginLeft: "auto",
                position: "relative",
              
                right: "1rem",
                cursor: "pointer"
            }}>
                <CloseIcon
                    className='close-icon'
                ></CloseIcon>
            </Button>
            <Modal.Body>
                <iframe
                    style={{
                        height: "37rem",
                        width: "100%",
                        objectFit: "cover"
                    }}
                    title='reel'
                    src={props.videoURL}
                    frameborder="0"
                    allowfullscreen
                ></iframe>
            </Modal.Body>
        </Modal>
    );
}