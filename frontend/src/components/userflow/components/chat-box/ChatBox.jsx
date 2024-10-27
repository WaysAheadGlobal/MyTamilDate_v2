import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../api';
import { useSocket } from '../../../../Context/SockerContext';
import { useCookies } from '../../../../hooks/useCookies';
import styles from './chatbox.module.css';
import Button from '../button/Button';
import { IoArrowBack } from "react-icons/io5";

export default function ChatBox({ className }) {
    /**
     * @typedef {Object} Message
     * @property {"you" | "other"} sender - The sender of the message.
     * @property {string} message - The content of the message.
     * @property {string} time - The date the message was sent.
     */

    /**
     * @typedef {Object.<string, Message[]>} Messages
     */

    /**
     * @type {[Messages, (messages: Messages) => void]}
     */

    const [messages, setMessages] = React.useState({});
    const [text, setText] = React.useState("");
    const cookies = useCookies();
    const location = useLocation();
    const [conversationId, setConversationId] = React.useState(null);
    const { socket } = useSocket();
    const [showReportModal, setShowReportModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showUnmatchModal, setShowUnmatchModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const conversationId = sessionStorage.getItem("conversationId");

        if (conversationId) {
            setConversationId(conversationId);
        }

    }, [window.location.pathname])

    useEffect(() => {
        setMessages({});

        if (!conversationId) return;

        if (!window.location.pathname.includes("with")) {
            return;
        }

        (async () => {
            const response = await fetch(`${API_URL}customer/chat/get-messages/${conversationId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.getCookie('token')}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setMessages(data);
            }
        })()
    }, [conversationId, window.location.pathname])

    useEffect(() => {
        if (!conversationId || !window.location.pathname.includes("with")) return;

        const chatContainer = document.querySelector(`#chat-container`);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [messages]);

    /**
     * 
     * @param {string | Date} date
     * @returns {string} 
     */
    function getDateDifference(date) {
        const today = dayjs();
        const messageDate = dayjs(date);
        const diff = today.diff(messageDate, 'day');

        if (diff === 0) {
            return "Today";
        } else if (diff === 1) {
            return "Yesterday";
        } else {
            return messageDate.format("DD/MM/YYYY");
        }
    }

    async function requestChat() {
        console.log(location.state)
        const response = await fetch(`${API_URL}customer/chat/request`, {
            method: "POST",
            body: JSON.stringify({
                participantId: location.state.user_id,
                message: text,
                conversationId: sessionStorage.getItem("conversationId")
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.getCookie('token')}`
            }
        });
        const data = await response.json();

        if (response.ok) {
            console.log(data);
            sessionStorage.setItem("conversationId", data.conversationId);
        }
    }

    useEffect(() => {
        if (socket) {
            socket.emit('join-room', sessionStorage.getItem("conversationId"));
        }
    });

    useEffect(() => {
        if (socket) {
            socket.on('receive-message', (data) => {
                console.log(data);
                setMessages({
                    ...messages,
                    [dayjs().format("YYYY-MM-DD")]: [
                        ...(messages[dayjs().format("YYYY-MM-DD")] ? messages[dayjs().format("YYYY-MM-DD")] : []),
                        {
                            sender: "other",
                            message: data,
                            time: dayjs().format("h:mm A")
                        }
                    ]
                });
            });
        }

        return () => {
            socket?.off('receive-message');
        }
    })

    /**
     * @param {React.FormEvent<HTMLFormElement>} e 
     * @returns {Promise<void>}
     */
    async function handleSubmit(e) {
        e.preventDefault();
        if (!text || !text.split(" ").join("")) return;

        if (location.state?.type === "request") {
            await requestChat();
        } else if (socket) {
            socket.emit('send-message', {
                message: text,
                roomId: sessionStorage.getItem("conversationId"),
                sentAt: Date.now(),
                type: 1,
                recepientId: location.state.recepientId
            });
            setMessages({
                ...messages,
                [dayjs().format("YYYY-MM-DD")]: [
                    ...(messages[dayjs().format("YYYY-MM-DD")] ? messages[dayjs().format("YYYY-MM-DD")] : []),
                    {
                        sender: "you",
                        message: text,
                        time: dayjs().format("h:mm A")
                    }
                ]
            });
        }

        setText("");
    }

    if (!conversationId || !window.location.pathname.includes("with")) {
        return <div id="chat-box"></div>
    }

    return (
        <section className={[styles.chatbox, className].join(" ")}>
            <UnmatchModal show={showUnmatchModal} setShow={setShowUnmatchModal} />
            <ReportModal show={showReportModal} setShow={setShowReportModal} />
            <BlockModal show={showBlockModal} setShow={setShowBlockModal} />
            <div className={styles.chatHeader}>
                {/* <img src="https://via.placeholder.com/75" alt="profile" /> */}
                <IoArrowBack size={24} cursor="pointer" onClick={() => window.history.back()} />
                <img src={location.state?.img ?? ""} alt="profile" style={{
                    objectFit: "cover"
                }} onClick={() => navigate(`/user/${location.state?.name}/${location.state?.recepientId}`)} />
                <p>{location.state?.name ?? ""}</p>
                <div style={{ flexGrow: "1" }}></div>
                <Dropdown>
                    <Dropdown.Toggle
                        as="div"
                        style={{
                            cursor: "pointer",
                        }}
                        id="dropdown-basic"
                    >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.3307 6.66536C17.3307 5.92898 16.7338 5.33203 15.9974 5.33203C15.261 5.33203 14.6641 5.92898 14.6641 6.66536C14.6641 7.40174 15.261 7.9987 15.9974 7.9987C16.7338 7.9987 17.3307 7.40174 17.3307 6.66536Z" stroke="#3A3A3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M17.3307 15.9987C17.3307 15.2623 16.7338 14.6654 15.9974 14.6654C15.261 14.6654 14.6641 15.2623 14.6641 15.9987C14.6641 16.7351 15.261 17.332 15.9974 17.332C16.7338 17.332 17.3307 16.7351 17.3307 15.9987Z" stroke="#3A3A3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M17.3307 25.332C17.3307 24.5957 16.7338 23.9987 15.9974 23.9987C15.261 23.9987 14.6641 24.5957 14.6641 25.332C14.6641 26.0684 15.261 26.6654 15.9974 26.6654C16.7338 26.6654 17.3307 26.0684 17.3307 25.332Z" stroke="#3A3A3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        backdropFilter: "blur(10px)",
                    }}>
                        <Dropdown.Item
                            as="button"
                            style={{
                                borderBottom: "1px solid #e0e0e0",
                                marginBottom: "0.5rem"
                            }}
                            onClick={() => setShowUnmatchModal(true)}
                        >
                            Unmatch
                        </Dropdown.Item>
                        <Dropdown.Item
                            as="button"
                            style={{
                                borderBottom: "1px solid #e0e0e0",
                                marginBottom: "0.5rem"
                            }}
                            onClick={() => setShowReportModal(true)}
                        >
                            Report
                        </Dropdown.Item>
                        <Dropdown.Item
                            as="button"
                            onClick={() => setShowBlockModal(true)}
                        >
                            Block
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div id="chat-container" className={styles.chatContainer}>
                {
                    Object.keys(messages).map(date => (
                        <React.Fragment key={date}>
                            <div className={styles.date}>
                                <hr />
                                <p>{getDateDifference(date)}</p>
                                <hr />
                            </div>
                            {
                                messages[date].map((message, i) => (
                                    <React.Fragment key={i}>
                                        <div key={i} className={styles.message}>
                                            <div className={message.sender === "you" ? styles.you : styles.other}>
                                                <p style={{
                                                    fontSize : "16px"
                                                }} >{message.message}</p>
                                                <p>{message.time}</p>
                                            </div>
                                        </div>
                                        {
                                            message.sender === "other" && <img src={location.state?.img ?? ""} alt="profile" style={{
                                                objectFit: "cover",
                                            }} />
                                        }
                                    </React.Fragment>
                                ))
                            }
                        </React.Fragment>
                    ))
                }
            </div>
            <form className={styles.chatInput} onSubmit={handleSubmit}>
                <input type="text" placeholder='Message...' value={text} onChange={(e) => setText(e.currentTarget.value)} />
                <button>Send</button>
            </form>
        </section>
    )
}

function UnmatchModal({ show, setShow }) {
    const cookies = useCookies();
    const [options, setOptions] = useState([]);
    const { socket } = useSocket();
    const location = useLocation();
    const formRef = useRef(null);

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}customer/matches/unmatch-reasons`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.getCookie('token')}`
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setOptions(data);
            }
        })()
    }, [show])

    async function unmatch(e) {
        e.preventDefault();
        console.log(location.state.recepientId);
        const response = await fetch(`${API_URL}customer/matches/unmatch`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.getCookie('token')}`
            },
            body: JSON.stringify({
                personId: location.state.recepientId,
                ...Object.fromEntries(new FormData(formRef.current))
            })
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            socket?.emit('leave-room', sessionStorage.getItem("conversationId"));
            sessionStorage.removeItem("conversationId");
            window.location.assign("/user/chat");
        }
    }

    return (
        <Modal size='sm' centered show={show}>
            <Modal.Body>
                <p style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    margin: "0",
                    marginBottom: "1rem",
                    color: "#6c6c6c"
                }}>Unmatch user?</p>
                <p
                    style={{
                        fontSize: "16px",
                        margin: "0",
                        textAlign: "center",
                        color: "#6c6c6c"
                    }}
                >Please let us know why you'd like to unmatch this user so we can improve your future experience.</p>
                <form
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        marginBlock: "1rem"
                    }}
                    onSubmit={unmatch}
                    ref={formRef}
                >
                    {
                        options.map(option => (
                            <label key={option.id} htmlFor={option.id} style={{
                                display: "flex",
                                gap: "1rem",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                fontSize: "14px",
                                color: "#6c6c6c"
                            }}>
                                <input
                                    type="radio"
                                    name="unmatchId"
                                    id={option.id}
                                    value={option.id}
                                    style={{
                                        accentColor: "#4E1173",
                                        width: "20px",
                                        height: "20px",
                                    }}
                                />
                                <span>{option.name}</span>
                            </label>
                        ))
                    }
                </form>
                <div style={{
                    marginTop: "1rem",
                    display: "flex",
                    gap: "1rem",
                    marginInline: "auto"
                }}>
                    <button
                        type='button'
                        // style={{
                        //     borderRadius: "9999px",
                        //     padding: "0.75rem 1.5rem",
                        //     border: "2px solid #6c6c6c",
                        //     color: "#6c6c6c",
                        //     backgroundColor: "transparent"
                        // }}
                         className='global-cancel-button'
                        onClick={() => setShow(false)}
                    >
                        Close
                    </button>
                    <button
                        type="submit"
                        // style={{
                        //     borderRadius: "9999px",
                        //     padding: "0.75rem 1.5rem",
                        // }}
                         className='global-save-button'
                        onClick={() => formRef.current?.requestSubmit()}
                    >
                        Submit
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

function ReportModal({ show, setShow }) {
    const cookies = useCookies();
    const [options, setOptions] = useState([]);
    const { socket } = useSocket();
    const location = useLocation();
    const formRef = useRef(null);

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}customer/matches/report-reasons`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.getCookie('token')}`
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setOptions(data);
            }
        })()
    }, [show])

    async function report(e) {
        e.preventDefault();
        console.log(location.state.recepientId);
        const response = await fetch(`${API_URL}customer/matches/report`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.getCookie('token')}`
            },
            body: JSON.stringify({
                personId: location.state.recepientId,
                ...Object.fromEntries(new FormData(formRef.current))
            })
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            socket?.emit('leave-room', sessionStorage.getItem("conversationId"));
            sessionStorage.removeItem("conversationId");
            window.location.assign("/user/chat");
        }
    }

    return (
        <Modal size='sm' centered show={show}>
            <Modal.Body>
                <p style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    margin: "0",
                    marginBottom: "1rem",
                    color: "#6c6c6c",
                
                }}>Report user?</p>
                <p
                    style={{
                        fontSize: "16px",
                        margin: "0",
                        textAlign: "center",
                        color: "#6c6c6c"
                    }}
                >Report this user for violating MTD's community guidelines. Please select a reason for reporting the user below to help us improve your experience.</p>
                <form
                    ref={formRef}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        marginBlock: "1rem"
                    }}
                    onSubmit={report}
                >
                    {
                        options.map(option => (
                            <label key={option.id} htmlFor={option.id} style={{
                                display: "flex",
                                gap: "1rem",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                fontSize: "16px",
                                textAlign: "left",
                                color: "#6c6c6c"
                            }}>
                                <input
                                    type="radio"
                                    name="reportId"
                                    id={option.id}
                                    value={option.id}
                                    style={{
                                        accentColor: "#4E1173",
                                        width: "20px",
                                        height: "20px",
                                    }}
                                />
                                <span>{option.name}</span>
                            </label>
                        ))
                    }
                </form>
                <div style={{
                    marginTop: "1rem",
                    display: "flex",
                    gap: "1rem",
                    marginInline: "auto"
                }}>
                    <button
                        type='button'
                               className='global-cancel-button'
                        // style={{
                        //     borderRadius: "9999px",
                        //     padding: "0.75rem 1.5rem",
                        //     border: "2px solid #6c6c6c",
                        //     color: "#6c6c6c",
                        //     backgroundColor: "transparent"
                        // }}
                        onClick={() => setShow(false)}
                    >
                        Close
                    </button>
                    <button
                        type="submit"
                           className='global-save-button'
                        // style={{
                        //     borderRadius: "9999px",
                        //     padding: "0.75rem 1.5rem",
                        // }}
                        onClick={() => formRef.current?.requestSubmit()}
                    >
                        Submit
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

function BlockModal({ show, setShow }) {
    const cookies = useCookies();
    const { socket } = useSocket();
    const location = useLocation();

    async function block() {
        console.log(location.state.recepientId);
        const response = await fetch(`${API_URL}customer/matches/block`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.getCookie('token')}`
            },
            body: JSON.stringify({
                personId: location.state.recepientId
            })
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            socket?.emit('leave-room', sessionStorage.getItem("conversationId"));
            sessionStorage.removeItem("conversationId");
            window.location.assign("/user/chat");
        }
    }


    return (
        <Modal size='sm' centered show={show}>
            <Modal.Body>
                <p style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    margin: "0",
                    marginBottom: "1rem",
                    color: "#6c6c6c"
                }}>Block user</p>
                <p
                    style={{
                        fontSize: "16px",
                        margin: "0",
                        textAlign: "center",
                        color: "#6c6c6c"
                    }}
                >Blocked members will no longer be able to message you and won't show up when you're browsing</p>
                <div style={{
                    marginTop: "3rem",
                    display: "flex",
                    gap: "1rem",
                    marginInline: "auto",
                }}>
                    <button
                        type='button'
                        className='global-cancel-button'
                        // style={{
                        //     borderRadius: "9999px",
                        //     padding: "0.75rem 1.5rem",
                        //     border: "2px solid #6c6c6c",
                        //     color: "#6c6c6c",
                        //     backgroundColor: "transparent"
                        // }}
                        onClick={() => setShow(false)}
                    >
                        Close
                    </button>
                    <button
                        onClick={block}
                         className='global-save-button'
                        // style={{
                        //     borderRadius: "9999px",
                        //     padding: "0.75rem 1.5rem",
                        // }}
                    >
                        Submit
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}