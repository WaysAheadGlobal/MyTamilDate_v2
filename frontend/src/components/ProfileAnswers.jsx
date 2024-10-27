import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import BModal from 'react-bootstrap/Modal';
import logo from "../assets/images/MTDlogo.png";
import backarrow from "../assets/images/backarrow.jpg";
import responsivebg from "../assets/images/responsive-bg.png";
import './job-title.css';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../api';
import { useCookies } from '../hooks/useCookies';

const answer = [
    "I invented mutton rolls. I've visited 5 countries. I can speak 2 languages.",
    "Drive 12 hours to New York just to eat some amazing pizza.",
    "I’d buy my amma her dream home.",
    "Laugh at my bad jokes.",
    "I’m free spirited, curious about people and places and always up for a new challenge!",
    "Family time, working out and trying out a new recipe in the kitchen. Cheesy kotthu roti anyone?",
    "“And when you want something, all the universe conspires in helping you achieve it”",
    "Values family, loves Tamil films and music as much as I do and is looking for something serious.",
    "To visit every country in the world!"
]

export default function ProfileAnswers() {

    const [show, setShow] = useState(false);
    const[count, setCount] = useState(0);
    const [modalData, setModalData] = useState({
        heading: "",
        apiURL: "",
    });
    const { getCookie } = useCookies();
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);

    // useEffect(() => {
    //     (async () => {
    //         const response = await fetch(`${API_URL}/customer/users/questions`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${getCookie('token')}`
    //             },
    //         });
    //         const data = await response.json();
    //         console.log(data);

    //         if (response.ok) {
    //             setQuestions(data.questions);
    //         }
    //     })()
    // }, [])
const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/customer/update/questionss`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setQuestions(data.questions);
            }
        })()
    }, [refresh]);
    
    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/customer/users/answers/count`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });
            const data = await response.json();
            
            setCount(data.count);
            console.log(count);
        })()
    }, [refresh]);


    const refreshpage = ()=>{
        setRefresh(!refresh)
    }

    return (
        <div className='job-container'>
            <Modal show={show} onHide={() => setShow(false)} modalData={modalData} />
            <AlertModal show={alert} count = {count} onHide={() => setAlert(false)} />
            <div className='job-bg'>
                <Image className='responsive-bg' src={responsivebg} alt="Background"></Image>
            </div>
            <Container className='job-main'>
                <Container className='job-content'>
                    <Container className='logo-progressbar10'>
                        <Container className='logo-arrow10'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} alt="Back Arrow" />
                            <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        <div className='track-btn10'>
                            <div></div>
                        </div>
                    </Container>
                    <Container className='job-details'>
                        <div className='your-job'>
                            <Container className='job-text'>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="18" fill="#4E1173" />
                                    <path d="M27.875 26.75C27.8 26.75 27.725 26.75 27.65 26.675L24.725 24.5H19.625C18.575 24.5 17.75 23.675 17.75 22.625V17.375C17.75 16.325 18.575 15.5 19.625 15.5H28.625C29.675 15.5 30.5 16.325 30.5 17.375V22.625C30.5 23.675 29.675 24.5 28.625 24.5H28.25V26.375C28.25 26.525 28.175 26.675 28.025 26.675C27.95 26.75 27.95 26.75 27.875 26.75ZM19.625 16.25C19.025 16.25 18.5 16.775 18.5 17.375V22.625C18.5 23.225 19.025 23.75 19.625 23.75H24.875C24.95 23.75 25.025 23.75 25.1 23.825L27.5 25.625V24.125C27.5 23.9 27.65 23.75 27.875 23.75H28.625C29.225 23.75 29.75 23.225 29.75 22.625V17.375C29.75 16.775 29.225 16.25 28.625 16.25H19.625Z" fill="white" />
                                    <path d="M12.125 24.5C12.05 24.5 11.975 24.5 11.975 24.425C11.825 24.425 11.75 24.275 11.75 24.125V22.25H11.375C10.325 22.25 9.5 21.425 9.5 20.375V15.125C9.5 14.075 10.325 13.25 11.375 13.25H20.375C21.425 13.25 22.25 14.075 22.25 15.125V15.875C22.25 16.1 22.1 16.25 21.875 16.25H19.625C19.025 16.25 18.5 16.775 18.5 17.375V21.875C18.5 22.1 18.35 22.25 18.125 22.25H15.275L12.35 24.425C12.275 24.5 12.2 24.5 12.125 24.5ZM11.375 14C10.775 14 10.25 14.525 10.25 15.125V20.375C10.25 20.975 10.775 21.5 11.375 21.5H12.125C12.35 21.5 12.5 21.65 12.5 21.875V23.375L14.9 21.575C14.975 21.5 15.05 21.5 15.125 21.5H17.75V17.375C17.75 16.325 18.575 15.5 19.625 15.5H21.5V15.125C21.5 14.525 20.975 14 20.375 14H11.375Z" fill="white" />
                                    <path d="M15.125 20H14.375C13.775 20 13.25 19.475 13.25 18.875V16.625C13.25 16.025 13.775 15.5 14.375 15.5H15.125C15.725 15.5 16.25 16.025 16.25 16.625V18.875C16.25 19.475 15.725 20 15.125 20ZM14.375 16.25C14.15 16.25 14 16.4 14 16.625V18.875C14 19.1 14.15 19.25 14.375 19.25H15.125C15.35 19.25 15.5 19.1 15.5 18.875V16.625C15.5 16.4 15.35 16.25 15.125 16.25H14.375ZM25.625 22.25C25.4 22.25 25.25 22.1 25.25 21.875V18.875C25.25 18.65 25.1 18.5 24.875 18.5H23.375C23.15 18.5 23 18.65 23 18.875V21.875C23 22.1 22.85 22.25 22.625 22.25C22.4 22.25 22.25 22.1 22.25 21.875V18.875C22.25 18.275 22.775 17.75 23.375 17.75H24.875C25.475 17.75 26 18.275 26 18.875V21.875C26 22.1 25.85 22.25 25.625 22.25Z" fill="white" />
                                    <path d="M25.2484 20.7516H22.9984C22.7734 20.7516 22.6234 20.6016 22.6234 20.3766C22.6234 20.1516 22.7734 20.0016 22.9984 20.0016H25.2484C25.4734 20.0016 25.6234 20.1516 25.6234 20.3766C25.6234 20.6016 25.4734 20.7516 25.2484 20.7516ZM16.6234 20.0016C16.5484 20.0016 16.3984 20.0016 16.3234 19.9266L14.8234 18.4266C14.6734 18.2766 14.6734 18.0516 14.8234 17.9016C14.9734 17.7516 15.1984 17.7516 15.3484 17.9016L16.8484 19.4016C16.9984 19.5516 16.9984 19.7766 16.8484 19.9266C16.8484 19.9266 16.6984 20.0016 16.6234 20.0016Z" fill="white" />
                                </svg>

                                <p>Write your profile answers</p>
                            </Container>
                            <p style={{
                                color: "#4E1173",
                                fontSize: "16px",
                                lineHeight: "20px",
                                textAlign: "left",
                                fontWeight: "600",
                                marginLeft : "10px"
                            }}>
                          Answer 2 prompts only
                            </p>
                            <div style={{
                                maxHeight: "45vh",
                                overflow: "auto",
                                scrollbarColor: "transparent transparent",
                                scrollBehavior: "smooth",
                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                }}>
                                   {
                                                questions.map((question, index) => (
                                                    <div
                                                        tabIndex={0}
                                                        key={index}
                                                        style={{
                                                            border: question.answer ? "2px solid #4E1173" : "2px solid #cbcbcb",
                                                            padding: "1rem",
                                                            borderRadius: "10px",
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>  {
                                                            if (count === 2 && question.answer == null) {
                                                                setAlert(true);
                                                            } else {
                                                                setModalData({
                                                                    heading: question.prompt,
                                                                   apiURL: `${API_URL}/customer/users/answer/${question.question_id}`,
                                                                   refreshpage : refreshpage,
                                                                   placeholder : answer[index]
                                                                });
                                                                setShow(true);
                                                            }
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{
                                                                color: "black",
                                                                fontSize: "18px",
                                                                lineHeight: "24px",
                                                                fontWeight: "600",
                                                            }}>
                                                                {question.question}
                                                            </div>
                                                            <div style={{
                                                                color: "#6C6C6C",
                                                                fontSize: "16px",
                                                                lineHeight: "20px",
                                                                fontWeight: "400",
                                                            }} >
                                                            {question.answer || answer[index].substring(0,30)+"..."}
                                                            </div>
                                                            <div style={{
                                                                color: "#6C6C6C",
                                                                fontSize: "16px",
                                                                lineHeight: "20px",
                                                                fontWeight: "400",
                                                            }}>
                                                                {question.description}
                                                            </div>
                                                        </div>
                                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12.8346 5.5L7.33464 11V14.6667H11.0013L16.5013 9.16667M12.8346 5.5L15.5846 2.75L19.2513 6.41667L16.5013 9.16667M12.8346 5.5L16.5013 9.16667M9.16797 3.66667L3.66797 3.66667L3.66797 18.3333L18.3346 18.3333V12.8333" stroke="url(#paint0_linear_778_6844)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <defs>
                                                                <linearGradient id="paint0_linear_778_6844" x1="12.0869" y1="2.10069" x2="12.0869" y2="19.9566" gradientUnits="userSpaceOnUse">
                                                                    <stop stopColor="#FC8C66" />
                                                                    <stop offset="1" stopColor="#F76A7B" />
                                                                </linearGradient>
                                                            </defs>
                                                        </svg>
                                                    </div>
                                                ))
                                            }
                                </div>
                            </div>
                        </div>
                    </Container>
                    {/* <Button variant="primary" type="submit" className='job-nxt-btn' onClick={() => {
                        const answers = getCookie('answers');

                        if (count == 2) {
                            navigate('/kids-family');
                        } else {
                            setAlert(true);
                        }
                    }}>
                        Next
                    </Button> */}

                    <button  type="submit" className='global-next-bottom-fix-btn'  onClick={() => {
                        const answers = getCookie('answers');

                        if (count == 2) {
                            navigate('/kids-family');
                        } else {
                            setAlert(true);
                        }
                    }}>
                                Next
                            </button>
                </Container>
            </Container>
        </div>
    );
};

function Modal({ show, onHide, modalData, alert ,placeholder}) {
    const [text, setText] = useState("");
    const { getCookie, setCookie } = useCookies();

    useEffect(() => {
        setText("");

        (async () => {
            if (!modalData.apiURL) return;
  
            const response = await fetch(modalData.apiURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setText(data.answer);
            }
        })()
    }, [modalData.apiURL]);

    async function saveAnswer() {
        const finalanswer = text ? text : modalData.placeholder
        const response = await fetch(modalData.apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({ answer: finalanswer }),
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            onHide();
            const answers = getCookie('answers');
            setCookie('answers', answers ? Number(answers) + 1 : 0, { path: '/' });
            modalData.refreshpage();
        }
    }

    return (
        <BModal centered show={show} onHide={onHide} >
            <BModal.Header closeButton>
                <p style={{
                    fontSize: "large",
                    lineHeight: "24px",
                    fontWeight: "600",
                }}>{modalData.heading}</p>
            </BModal.Header>
            <div style={{
                width: "100%",
                position: "relative",
            }}>
                <textarea
                    name={modalData.heading}
                    id={modalData.heading}
                    value={text}
                    placeholder={modalData.placeholder}
                    onChange={(e) => { setText(e.target.value) }}
                    maxLength={200}
                    style={{
                        height: "300px",
                        marginBlock: "1rem",
                        borderRadius: "10px",
                        border: "2px solid #cbcbcb",
                        padding: "1rem",
                        width: "100%",
                    }}
                ></textarea>
                <p style={{
                    position: "absolute",
                    right: "1rem",
                    bottom: "2rem",
                    color: "#6C6C6C",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: "400",
                }}>{text.length}/200</p>
            </div>
            <div style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                gap: "1rem",
            }}>
                <button className='global-cancel-button' onClick={() => { onHide(); setText(""); }}>
                    Close
                </button>
                <button className='global-save-button' onClick={saveAnswer}>
                    Save
                </button>
            </div>
        </BModal>
    )
}

function AlertModal({ show, onHide,count }) {
    return (
        <BModal centered show={show} onHide={onHide}>
            <div>
                <p style={{
                     fontSize: "var(--modal-font-size-16)",
                     lineHeight: "var(--modal-line-height-24)",
                    fontWeight: "500",
                    textAlign: "center",
                    marginTop: "1rem",
                      color: "#515151"
                }}>
                    {
                        count != 2 ? "Answer 2 prompts, please! Contact info (e.g., phone, social handles) will be rejected." : "You can answer only 2 prompts"
                    }
                    
                </p>
            </div>
{/* 
            <Button style={{
                backgroundColor: "white",
                borderColor: "#6c6c6c",
                borderRadius: "9999px",
                padding: "0.5rem 1rem",
                color: "#6c6c6c",
                fontWeight: "600",
                margin: "1rem auto",
                width: "50%",
            }} onClick={() => { onHide(); }}>
                Okay
            </Button> */}


           <div style={{
            display : "flex",
            alignItems : "center",
            justifyContent : "center",
            marginTop : "60px",
          
           }}>
            <button  type="submit" className='global-save-button' onClick={() => { onHide(); }}>
                                Okay
                            </button>
                            </div>
        </BModal>
    )
}

