import { Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../api';
import chatPlaceholder from '../../../../assets/images/chatPlaceholder.svg';
import { useSocket } from '../../../../Context/SockerContext';
import { useCookies } from '../../../../hooks/useCookies';
import styles from './matches.module.css';
import { useAlert } from '../../../../Context/AlertModalContext';
import { MdClose } from "react-icons/md";
import { Modal } from 'react-bootstrap';
import Button from '../button/Button';
import UpgradeModal from '../upgradenow/upgradenow';

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [currentMatches, setCurrentMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(true);
    const [conversations, setConversations] = useState([]);
    const[showmodal, setshowmodal] = useState(false);
    const cookies = useCookies();
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const { socket } = useSocket();
    const alert = useAlert();
    const dialogRef = useRef(null);
    const [imageURL, setImageURL] = useState("");

    const getImageURL = (type, hash, extension, userId) => {
        
        const ext = extension === "png" ? "jpg" : extension;
      
        return type === 1 
          ? `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${ext}` 
          : `${API_URL}media/avatar/${hash}.${ext}`;
      };
      
const handleClose = ()=> setshowmodal(false)
const handleupgrade = ()=>{
    setshowmodal(false);
    navigate("/selectplan");
}


    useEffect(() => {
        (async () => {
            try {
                setLoadingMatches(true);
                const response = await fetch(`${API_URL}customer/matches?page=${page}`, {
                    headers: {
                        'Authorization': `Bearer ${cookies.getCookie("token")}`
                    }
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setMatches([...matches, ...data]);
                    setCurrentMatches(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingMatches(false);
            }
        })()
    }, [page]);
    
    
    useEffect(() => {
        if (currentMatches.length < 10) return;

        const lastProfileObserver = new IntersectionObserver(entries => {
            const lastProfile = entries[0];

            if (!lastProfile.isIntersecting) return;

            setPage(page + 1);
        });
        lastProfileObserver.observe(document.querySelector(`.profile:last-child`));
        return () => {
            lastProfileObserver.disconnect()
        };
    }, [matches]);

    async function getRoom(userId, name, img) {
        if (cookies.getCookie("isPremium") !== "true") {

            // alert.setModal({
            //     show: true,
            //     title: "Upgrade to premium",
            //     message: "You need to be a premium user to chat with other users. Would you like to upgrade now?",
            //     onButtonClick: () => navigate("/selectplan"),
            //     showCancelButton: true
            // });
            setshowmodal(true)
            return;
        }

        try {
            const response = await fetch(`${API_URL}customer/chat/create-room`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${cookies.getCookie("token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    participantId: userId
                })
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                if (sessionStorage.getItem("conversationId")) {
                    socket?.emit("leave-room", sessionStorage.getItem("conversationId"));
                }
                sessionStorage.setItem("conversationId", data.conversationId);
                navigate(`/user/chat/with/${name}`, {
                    state: {
                        name,
                        img,
                        recepientId: userId
                    }
                })
            }

        } catch (error) {
            console.error(error)
        }
    }

    // useEffect(() => {
    //     console.log("this from the mathc coomponent");
    //     const handleNewMatch = ({ withUserId }) => {
    //         console.log(`You have a new match with user ID: ${withUserId}`)
    //         alert.setModal({
    //             show: true,
    //             title: "New Match!",
    //             message: `You have a new match`,
    //             onButtonClick: () => {
    //                 // Optional: Redirect to the new match's profile or chat
    //             }
    //         });
    //     };
    
    //     // Listen for the 'new-match' event from the server
    //     socket?.on("new-match", handleNewMatch);
    
    //     // Clean up the event listener on component unmount
    //     return () => {
    //         socket?.off("new-match", handleNewMatch);
    //     };
    // });
    

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}customer/chat/get-conversations`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.getCookie('token')}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setConversations(data);
            }
        })()
    }, [])

    useEffect(() => {
        socket?.on("fetch-messages", async (data) => {
            const response = await fetch(`${API_URL}customer/chat/get-conversations?limit=1`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.getCookie('token')}`
                }
            });
            const result = await response.json();

            if (response.ok) {
                console.log("messages", result);
                setConversations([
                    result[0],
                    ...conversations.filter(conversation => conversation.conversation_id !== result[0].conversation_id)
                ])
            }
        });

        return () => {
            socket?.off("fetch-messages");
        }
    });

    useEffect(() => {
        socket?.on("block", (data) => {
            const personId = data.personId;
            setConversations(conversations.filter(conversation => conversation.user_id !== personId));
        });

        return () => {
            socket?.off("block");
        }
    });

    /**
     * 
     * @param {string | Date} date
     * @returns {string} 
     */
    function getDateDifference(date) {
        const today = dayjs();
        const messageDate = dayjs(date);
        const diff = today.diff(messageDate, 'day');
        const diffInHours = today.diff(messageDate, 'hour');
        const diffInMinutes = today.diff(messageDate, 'minute');

        if (diff === 0) {
            if (diffInHours < 1) {
                if (diffInMinutes > 1) {
                    return `${diffInMinutes} minutes ago`;
                } else if (diffInMinutes === 1) {
                    return "A minute ago";
                } else {
                    return "Just Now"
                }
            } else {
                return `${diffInHours} hours ago`;
            }
        } else if (diff === 1) {
            return "Yesterday";
        } else {
            return messageDate.format("DD/MM/YYYY");
        }
    }

    return (
        <>
            <p style={{
                fontSize: "large",
                fontWeight: "600",
                marginBottom: "-1rem"
            }}>Matches</p>
            {
                Array.isArray(matches) && !loadingMatches && matches.length === 0 && (
                    <div className={styles.chatPlaceholder}>
                        <img src={chatPlaceholder} alt="chat placeholder" />
                        <p>You don't have any chats yet. Make the first move & say hello!</p>
                    </div>
                )
            }
            {
                loadingMatches && (
                    <div className={styles.profiles}>
                        {
                            Array(5).fill(0).map((_, i) => (
                                <div key={i}>
                                    <Skeleton
                                        animation="pulse"
                                        variant="circular"
                                        width={75}
                                        height={75}
                                    />
                                </div>
                            ))
                        }
                    </div>
                )
            }
            <div className={styles.profiles}>
                {
                    Array.isArray(matches) && matches.map((match) => (
                        <div key={match.user_id} className='profile' onClick={() => getRoom(match.user_id, match.first_name, getImageURL(match.type, match.hash, match.extension, match.user_id))}>
                            <img
                                src={getImageURL(match.type, match.hash, match.extension, match.user_id)}
                                alt="profile"
                                width={75}
                                height={75}
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                            />
                            <p>{match.first_name}</p>
                        </div>
                    ))
                }
            </div>
            {
                matches.length !== 0 && (
                    <>
                        <p style={{
                            fontSize: "large",
                            fontWeight: "600",
                        }}>Messages</p>
                        <div className={styles.messagesContainer}>
                            {
                                conversations.map((conversation, i) => (
                                    <div key={i} className={styles.message} onClick={() => getRoom(conversation.user_id, conversation.first_name, getImageURL(conversation.type, conversation.hash, conversation.extension, conversation.user_id))}>
                                        <img
                                            src={getImageURL(conversation.type, conversation.hash, conversation.extension, conversation.user_id)}
                                            alt="profile"
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                objectFit: "cover"
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dialogRef.current.showModal();
                                                setImageURL(getImageURL(conversation.type, conversation.hash, conversation.extension, conversation.user_id));
                                            }}
                                        />
                                        <div>
                                            <p>{conversation.first_name} </p>
                                            <p style={{
                                                filter: cookies.getCookie("isPremium") === "true" ? "none" : "blur(5px)",
                                            }}>{conversation.message}</p>
                                        </div>
                                        <div style={{ flexGrow: "1" }}></div>
                                        <p>{getDateDifference(conversation.sent_at)}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                )
            }
            <dialog ref={dialogRef} className={styles.profileDialog}>
                <MdClose size={30} color='white' onClick={() => dialogRef.current.close()} style={{
                    position: "absolute",
                    right: "1rem",
                    top: "1rem",
                    cursor: "pointer"
                }} />
                <img src={imageURL} alt="profile" />
            </dialog>
        <UpgradeModal show={showmodal} setShow={setshowmodal} />
            {/* <Modal show={showmodal} onHide={handleClose} centered>
                        <Modal.Body className="pause-modal-content">

                            <div className="pause-modal-title" style={{
                                 fontSize: "20px",
                                 fontWeight: "600",
                                 margin: "0",
                                 marginBottom: "1rem",
                                 color: "#6c6c6c"
                            }}>Upgrade to Premium & 
                        Unlock Exclusive Features</div>
                            <div className="pause-modal-message" style={{
                        fontSize: "16px",
                        margin: "0",
                        textAlign: "center",
                        color: "#6c6c6c"
                    }}>
                            As a Premium member, you can send unlimited messages, see who liked you, view all matches, access special events, and much more!
                            </div>
                            <div className="d-flex justify-content-center" style={{
                                gap : "30px",
                              
                            }}>
                                <button  className="global-cancel-button" onClick={handleClose}>
                                    Close
                                </button>
                                <button  className={styles.upgradebutton} onClick={handleupgrade}>
                                Upgrade
                                </button>
                            </div>
                        </Modal.Body>
                    </Modal> */}
        </>
    )
}

// function UpgradeModal({ show, setShow }) {
//     const navigate = useNavigate();

//     return (
//         <Modal size='lg' centered show={show}>
//             <Modal.Body>
//                 <p style={{
//                     fontSize: "20px",
//                     fontWeight: "600",
//                     margin: "0",
//                     marginBottom: "1rem",
//                     color: "#6c6c6c"
//                 }}>Upgrade to Premium & 
//                         Unlock Exclusive Features</p>
//                 <p
//                     style={{
//                         fontSize: "16px",
//                         margin: "0",
//                         textAlign: "center",
//                         color: "#6c6c6c"
//                     }}
//                 >Premium members can see who liked them, Send unlimited messages & more!</p>
//                 <div style={{
//                     marginTop: "4rem",
//                     display: "flex",
//                     gap: "1rem",
//                     marginInline: "auto",
//                 }}>
//                     <button
//                         type='button'
//                         style={{
//                             borderRadius: "9999px",
//                             padding: "0.75rem 1.5rem",
//                             // border: "2px solid #6c6c6c",
//                             // color: "#6c6c6c",
//                             // backgroundColor: "transparent"
//                         }}
//                         className='global-cancel-button'
//                         onClick={() => setShow(false)}
//                     >
//                         Close
//                     </button>
//                     <Button
//                         onClick={() => navigate("/selectplan")}
//                         style={{
//                             borderRadius: "9999px",
//                             padding: "0.75rem 1.5rem",
//                             fontSize: "16px",
//                             fontWeight: "600"
//                         }}
//                     >
//                         Upgrade Now
//                     </Button>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     )
// }