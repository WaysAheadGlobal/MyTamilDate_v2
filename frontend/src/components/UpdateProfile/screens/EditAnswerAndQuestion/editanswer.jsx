import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import BModal from 'react-bootstrap/Modal';
import ans from './editanswer.module.css';
import { Link, Router, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../api';
import deleteicon from "../../../../assets/images/deleteicon.png";
import { useCookies } from '../../../../hooks/useCookies';
import Sidebar from '../../../userflow/components/sidebar/sidebar';
import answer from '../../../../assets/images/answer.png';
import { useAlert } from '../../../../Context/AlertModalContext';
const answers = [
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

export default function UpdateAnswers() {
    const [show, setShow] = useState(false);
    const [count, setCount] = useState(0)
    const [updatecount, setUpdatecount] = useState(0)
    const [modalData, setModalData] = useState({
        heading: "",
        apiURL: "",
    });
    const [refresh, setRefresh] = useState(true);

    const { getCookie } = useCookies();
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const alertmodal = useAlert();
    const approvalstatus = getCookie('approval')
    const Totalcount = count + updatecount;
    console.log(Totalcount);

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

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}customer/update/updateanswers/count`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });
            const data = await response.json();

            setUpdatecount(data.count);
            console.log(updatecount);
            console.log(count);
        })()
    }, [refresh]);

    const handleDeleteAnswer = async (questionId) => {
        try {
            const response = await fetch(`${API_URL}customer/update/answer/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });
            //   const response = await axios.delete(`${API_URL}/answer/${questionId}`);
            if (response.status === 200) {
                // Update the state or refetch the data to reflect the deletion
                refreshpage();


            }
        } catch (error) {
            console.error('Error deleting answer:', error);

        }
    };

    const refreshpage = () => {
        setRefresh(!refresh)
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

            }}>
                <div className={ans.jobcontainer}>
                    <Modal show={show} alertmodal={alertmodal} count={count} onHide={() => setShow(false)} modalData={modalData} />
                    <AlertModal show={alert} updatecount={updatecount} alertmodal={alertmodal} count={count} onHide={() => setAlert(false)} />

                    <Container className={ans.jobmain}>
                        <Container className={ans.jobcontent}>
                            <Container className={ans.jobdetails}>
                                <div className={ans.yourjob}>
                                    <Container className='job-text'>
                                        <Image width="40px" height="40px" src={answer} />
                                        <p>Update: Write your profile answers</p>
                                    </Container>
                                    <p style={{
                                        color: "#4E1173",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                        textAlign: "center",
                                        fontWeight: "400",
                                        fontWeight: "600"
                                    }}>
                                        Answer 2 prompts only
                                    </p>
                                    <div style={{
                                        maxHeight: "60vh",
                                        overflow: "auto",
                                        paddingRight: "5px",
                                        scrollBehavior: "smooth",
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "1rem",
                                            overflowY: "auto",

                                        }}>
                                            {
                                                questions.map((question, index) => (
                                                    <div
                                                        tabIndex={0}
                                                        key={index}
                                                        style={{
                                                            border: question.answer ? "2px solid #F76A7B" : "2px solid #cbcbcb",
                                                            padding: "1rem",
                                                            borderRadius: "10px",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            justifyContent: "space-between",
                                                            
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            if (count === 2 && question.answer == null) {
                                                                setAlert(true);
                                                            }

                                                            else if (updatecount === 2) {
                                                                setAlert(true);
                                                            }
                                                            else if (updatecount === 1 && count === 1 && question.answer == null) {
                                                                setAlert(true);
                                                            }
                                                            else {
                                                                setShow(true);
                                                                setModalData({
                                                                    heading: question.question,

                                                                    placeholder: answers[index],
                                                                    refreshpage: refreshpage,
                                                                    apiURL: approvalstatus === 'APPROVED' ? `${API_URL}/customer/update/answer/${question.question_id}` : `${API_URL}/customer/users/answer/${question.question_id}`
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{
                                                                color: "black",
                                                                fontSize: "16px",
                                                                lineHeight: "24px",
                                                                fontWeight: "600",
                                                            }}>
                                                                {question.question}
                                                            </div>
                                                            <div style={{
                                                                color: "#6C6C6C",
                                                                fontSize: "14px",
                                                                lineHeight: "20px",
                                                                fontWeight: "400",
                                                            }}>
                                                                {question.answer ? question.answer.substring(0, 100) + "..." : (answers[index].substring(0, 30) + "...")}
                                                            </div>
                                                            <div style={{
                                                                color: "#6C6C6C",
                                                                fontSize: "14px",
                                                                lineHeight: "20px",
                                                                fontWeight: "400",
                                                            }}>
                                                                {question.description}
                                                            </div>
                                                        </div>

                                                        <div style={{
                                                            marginTop :"3px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent : "flex-end",
                                                            gap : "30px"
                                                            
                                                        }}>
                                                            {question.answer ? (

                                                                <div onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteAnswer(question.question_id);
                                                                }} >
                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M15 1L1 15M1.00001 1L15 15" stroke="#424242" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                    </svg>

                                                                </div>

                                                            ) : ""}

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
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Container>
                            <div style={{
                                position: "absolute",
                                display: "flex",
                                alignItems: "left",
                                justifyContent: "center",
                                gap: "30px",
                                bottom: "38px"
                            }}>
                                <Button type="submit" className={ans.jobnxtbtn} onClick={() => {
                                    const answers = getCookie('answers');
                                    if (count == 2 || updatecount == 2 || Totalcount === 2) {
                                        navigate('/updateprofile');
                                    } else {
                                        setAlert(true);
                                    }
                                    // if (answers && Number(answers) >= 2) {
                                    //     navigate('/updateprofile');
                                    // } else {
                                    //     setAlert(true);
                                    // }
                                }}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" className={ans.jobnxtbtn2} onClick={() => {
                                    const answers = getCookie('answers');

                                    if (count == 2 || updatecount == 2 || Totalcount === 2) {
                                        navigate('/updateprofile');
                                    } else {
                                        setAlert(true);
                                    }
                                    // if (answers && Number(answers) >= 2) {
                                    //     navigate('/updateprofile');
                                    // } else {
                                    //     setAlert(true);
                                    // }
                                }}>
                                    Save
                                </Button>
                            </div>
                        </Container>
                    </Container>
                </div>
            </div>
        </Sidebar>
    );
};

function Modal({ show, onHide, modalData, alert, alertmodal, placeholder, refreshpage }) {
    const [text, setText] = useState("");
    const { getCookie, setCookie } = useCookies();
    const approvalstatus = getCookie('approval')
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
        onHide();
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

            if (approvalstatus === 'APPROVED') {
                alertmodal.setModal({
                    show: true,
                    title: 'Update Profile Answer',
                    message: "Thanks for updating your profile answer! It's now under review by myTamilDate. You'll receive an update within 24 hours.",
                });
            }

            onHide();
            modalData.refreshpage();
            const answers = getCookie('answers');
            setCookie('answers', answers ? Number(answers) + 1 : 0, { path: '/' });
        }
    }

    return (
        <BModal centered show={show} onHide={onHide}>
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
                        borderRadius: "10px",
                        border: "2px solid #cbcbcb",
                        padding: "1rem",
                        width: "100%",
                    }}
                ></textarea>
                <p style={{
                    position: "absolute",
                    right: "1rem",
                    bottom: "1rem",
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
                <button
                    className='global-cancel-button'
                    onClick={() => { onHide(); setText(""); }}
                >
                    Cancel
                </button>

                <button
                    className='global-save-button'
                    onClick={saveAnswer}
                >
                    Save
                </button>
            </div>
        </BModal >
    )
}

function AlertModal({ show, onHide, count, updatecount }) {
    return (
        <BModal centered show={show} onHide={onHide}>
            <div>
                <p style={{
                    fontSize: "large",
                    lineHeight: "24px",
                    fontWeight: "600",
                    textAlign: "center",
                    marginTop: "1rem",
                }}>

                    {
                        updatecount === 2 ? "You can Update Only 2 prompts" : (

                            count === 2 ? "You can answer only 2 prompts" : (updatecount === 1 && count === 1 ? "Since only two prompts can be answered, and one has already been submitted for review. You'll receive an update within 24 hours." : "Answer at least 2 prompts.")
                        )
                    }
                    {
                    }


                </p>
            </div>
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
            </Button>
        </BModal>
    )
}
