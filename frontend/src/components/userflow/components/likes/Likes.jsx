import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './likes.module.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API_URL } from '../../../../api';
import { useCookies } from '../../../../hooks/useCookies';
import { Skeleton } from '@mui/material';
import chatPlaceholder from '../../../../assets/images/chatPlaceholder.svg';
import Button from '../button/Button';
import { useSocket } from '../../../../Context/SockerContext';
import { Modal } from 'react-bootstrap';
import UpgradeModal from '../upgradenow/upgradenow';
import { ChatReqeustRejected } from '../card/Card';

export default function Likes() {
    const navigate = useNavigate();
    const searchParams = useSearchParams();
    const [showmodal, setshowmodal] = useState(false);
    const cookies = useCookies();
    const [likes, setLikes] = useState([]);
    const[chatshow, setChatshow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const observerRef = useRef(null);
    const [currentLikes, setCurrentLikes] = useState([]);
    const [selected, setSelected] = useState(null);
    const { socket } = useSocket();

    const handleupgrade = () => {
        setshowmodal(false);
        navigate("/selectplan");
    }

    const handleClose = () => {
        console.log("handleClose called");
        setshowmodal(false);
    };

    const getImageURL = (type, hash, extension, userId) => {
        
        const ext = extension === "png" ? "jpg" : extension;
      
        return type === 1 
          ? `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${ext}` 
          : `${API_URL}media/avatar/${hash}.${ext}`;
      };
      
    const fetchLikes = useCallback(async () => {
        const path = searchParams[0].get("t") === "s" ? "sent" : "received";
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}customer/matches/likes/${path}?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${cookies.getCookie("token")}`
                }
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setLikes([...likes, ...data]);
                setCurrentLikes(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, searchParams[0].get("t"), cookies.getCookie("token")]);

    useEffect(() => {
        fetchLikes();
    }, [page, searchParams[0].get("t")]);

    useEffect(() => {
        if (currentLikes.length < 10) return;

        if (observerRef.current) observerRef.current.disconnect();

        const lastLikeElement = document.querySelector('.like:last-child');

        if (lastLikeElement) {
            observerRef.current = new IntersectionObserver((entries) => {
                const lastLike = entries[0];
                if (lastLike.isIntersecting) {
                    setPage((prevPage) => prevPage + 1);
                    observerRef.current.unobserve(lastLike.target);
                }
            });
            observerRef.current.observe(lastLikeElement);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [likes]);

    async function getRoom(userId, name, img) {
        if (cookies.getCookie("isPremium") !== "true") {
            setshowmodal(true);
            // alert.setModal({
            //     show: true,
            //     title: "Upgrade to premium",
            //     message: "You need to be a premium user to chat with other users. Would you like to upgrade now?",
            //     onButtonClick: () => navigate("/selectplan"),
            //     showCancelButton: true
            // });
            return;
        }

        try {
                // Check if the user is in the matches list
                const checkMatchResponse = await fetch(`${API_URL}customer/matches/check-match/${userId}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${cookies.getCookie("token")}`,
                        'Content-Type': 'application/json'
                    }
                });
                const checkMatchData = await checkMatchResponse.json();
        
                if (!checkMatchData.isMatch) {
                    // Show an alert if the user is not in the matches
                    console.log("This user is not in your matches. You cannot create a chat room.");
                    setChatshow(true);
                    console.log("chat show", chatshow)
                    return;
                }

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

    useEffect(() => {
        const isPremium = cookies.getCookie("isPremium") === "true";
        const isReferral = searchParams[0].get("t") === "s";
        if (!isPremium && !isReferral) {
            setshowmodal(true);
        }
    }, []);

    return (
        <>

        <ChatReqeustRejected chatshow={chatshow} setChatshow={setChatshow} />
            {/* {
                cookies.getCookie("isPremium") !== "true" && (
                    <div style={{
                        position: "absolute",
                        backgroundColor: "#606060A3",
                        backdropFilter: "blur(1rem)",
                        inset: 0,
                        top: "5.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                     
                    }}>
                        <div style={{
                            backgroundColor: "white",
                         
                            borderRadius: "1rem",
                            maxWidth: "330px",
                        }}>
                            <p style={{
                                fontSize: "20px",
                                fontWeight: "600",
                                margin: "0",
                               
                                color: "#424242",
                                textAlign: "center",
                                fontStyle: "Poppins",
                                padding: "1rem",

                            }}>Upgrade to Premium & 
                                Unlock Exclusive Features</p>
                            <div className={styles.likebox}>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        margin: "0",
                                        textAlign: "center",
                                        color: "#515151",
                                        fontStyle: "Poppins",
                                       fontWeight : "400"

                                    }}
                                >
                                   As a Premium member, you can send unlimited messages, see who liked you, view all matches, access special events, and much more!
                                </p>
                                <div style={{
                                    marginTop: "2rem",
                                    display: "flex",
                                    gap: "1rem",
                                    marginInline: "auto",
                                    width: "fit-content"
                                }}>
                                    <div>
                                        <button className='global-next-btn' style={{
                                            background: "#fff",
                                            color: "#F76A7B",
                                        }}
                                        onClick={()=> navigate("/selectplan")}
                                        >
                                            Upgrade Now
                                        </button>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                )
            } */}


            <ul className={styles.nav}>
                <li
                    onClick={() => {
                        navigate("?t=r");
                        if (searchParams[0].get("t") !== "r") {
                            setPage(1);
                            setLikes([]);
                        }
                    }}
                    className={(searchParams[0].get("t") === "r" || !searchParams[0].get("t")) ? styles.active : ""}
                >
                    Received
                    <div className={styles.indicator}></div>
                </li>
                <li
                    onClick={() => {
                        navigate("?t=s");
                        if (searchParams[0].get("t") !== "s") {
                            setPage(1);
                            setLikes([]);
                        }
                    }}
                    className={searchParams[0].get("t") === "s" ? styles.active : ""}
                >
                    Sent
                    <div className={styles.indicator}></div>
                </li>
            </ul>
            {
                Array.isArray(likes) && !loading && likes.length === 0 && (
                    <div className={styles.chatPlaceholder}>
                        <img src={chatPlaceholder} alt="chat placeholder" />
                        <p>New likes will appear here</p>
                    </div>
                )
            }
             {
                 cookies.getCookie("isPremium") !== "true" &&   <div className={styles.upgradesections}>
                        <p className={styles.heading} style={{

                        }}>Upgrade and Unlock this feature</p>
                        <p className={styles.discriptions} style={{

                        }}>premium member can see who liked them sent unlimited massages & more</p>
                        <button className="global-next-btn" style={{
                              padding: "0px 0px 0px 0px",
                              width : "150px",
                              marginTop : "10px"
                        }} 
                        onClick={()=> navigate("/paymentplan")}
                        >Upgrade Now</button>
                    </div>
                   }
            <div className={styles.profiles}>
                  

                {
                    loading && Array(6).fill(0).map((_, i) => (
                        <Skeleton
                            key={i}
                            animation="pulse"
                            sx={{
                                borderRadius: "12px",
                            }}
                            variant="rounded"
                            width={160}
                            height={180}
                        />
                    ))
                }
                {
                    Array.isArray(likes) && likes.map((like, i) => (
                        <div
                            key={i}
                            className={(selected === like.user_id ? styles.selected : "") + " like"}
                            style={{
                                backgroundImage: `url(${getImageURL(like.type, like.hash, like.extension, like.user_id)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative',
                                filter: cookies.getCookie("isPremium") === "true" ? 'none' : 'blur(3px)',
                            }}
                            onClick={() => {
                                if (selected === like.user_id) {
                                    setSelected(null);
                                    return;
                                }
                                setSelected(like.user_id);

                            }}
                        >
                            {
                                selected === like.user_id && (
                                    <section style={{
                                        position: "absolute",
                                        zIndex: 1,
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        {
                                            searchParams[0].get("t") === "s" && (
                                                <button
                                                    className='message-icon'
                                                    style={{
                                                        backgroundColor: "transparent",
                                                        border: "none",
                                                        borderRadius: "9999px"
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        getRoom(like.user_id, like.first_name, getImageURL(like.type, like.hash, like.extension, like.user_id));
                                                    }}
                                                >
                                                    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="23" cy="23" r="23" fill="white" />
                                                        <path d="M28.7609 12.5C30.3254 12.5 31.8304 13.1183 32.9375 14.2278C34.0459 15.335 34.6654 16.8283 34.6654 18.3917V27.6083C34.6654 30.8633 32.017 33.5 28.7609 33.5H17.2354C13.9792 33.5 11.332 30.8633 11.332 27.6083V18.3917C11.332 15.1367 13.9675 12.5 17.2354 12.5H28.7609ZM30.0804 18.5667C29.8354 18.5538 29.602 18.6367 29.4259 18.8L24.1654 23C23.4887 23.5612 22.5192 23.5612 21.832 23L16.582 18.8C16.2192 18.5317 15.7175 18.5667 15.4154 18.8817C15.1004 19.1967 15.0654 19.6983 15.3325 20.0483L15.4854 20.2L20.7937 24.3417C21.447 24.855 22.2392 25.135 23.0687 25.135C23.8959 25.135 24.702 24.855 25.3542 24.3417L30.617 20.13L30.7104 20.0367C30.9892 19.6983 30.9892 19.2083 30.6975 18.87C30.5354 18.6962 30.3125 18.59 30.0804 18.5667Z" fill="#D7D7D7" />
                                                    </svg>
                                                </button>
                                            )
                                        }
                                        <button
                                            className='profile-icon'
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "none",
                                                borderRadius: "9999px"
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (cookies.getCookie("isPremium") !== "true") {
                                                    setshowmodal(true);
                                                } else {
                                                    navigate(`/user/${like.first_name}/${like.user_id}`);
                                                }
                                            }}
                                        >
                                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M30 7.5C17.625 7.5 7.5 17.625 7.5 30C7.5 42.375 17.625 52.5 30 52.5C42.375 52.5 52.5 42.375 52.5 30C52.5 17.625 42.375 7.5 30 7.5ZM30 16.25C32.75 16.25 35 18.5 35 21.25C35 24 32.75 26.25 30 26.25C27.25 26.25 25 24 25 21.25C25 18.5 27.25 16.25 30 16.25ZM21.5 42.5C19.2909 42.5 17.4376 40.6633 18.1374 38.5679C19.795 33.6038 24.4971 30 30 30C35.5029 30 40.205 33.6038 41.8626 38.5679C42.5624 40.6633 40.7091 42.5 38.5 42.5H21.5Z" fill="white" />
                                                <path d="M21.5 42.5C19.2909 42.5 17.4376 40.6633 18.1374 38.5679C19.795 33.6038 24.4971 30 30 30C35.5029 30 40.205 33.6038 41.8626 38.5679C42.5624 40.6633 40.7091 42.5 38.5 42.5H21.5Z" fill="url(#paint0_linear_969_14272)" />
                                                <path d="M30 16.25C32.75 16.25 35 18.5 35 21.25C35 24 32.75 26.25 30 26.25C27.25 26.25 25 24 25 21.25C25 18.5 27.25 16.25 30 16.25Z" fill="url(#paint1_linear_969_14272)" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_969_14272" x1="7.5" y1="30" x2="52.5" y2="30" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#FC8C66" />
                                                        <stop offset="1" stop-color="#F76A7B" />
                                                    </linearGradient>
                                                    <linearGradient id="paint1_linear_969_14272" x1="7.5" y1="30" x2="52.5" y2="30" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#FC8C66" />
                                                        <stop offset="1" stop-color="#F76A7B" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </button>
                                    </section>
                                )
                            }
                            <div>
                                <p>{like.first_name}</p>
                                <p>{like.job}, {like.country}</p>
                            </div>
                        </div>
                    ))
                }
                <UpgradeModal show={showmodal} setShow={setshowmodal} />

                {/* <Modal show={showmodal} onHide={handleClose} centered>
                        <Modal.Body className="pause-modal-content">

                            <div className="pause-modal-title" style={{
                              fontSize: "large",
                              fontWeight: "600",
                              margin: "0",
                              marginBottom: "1rem",
                              color: "#6c6c6c"
                            }}> Upgrade to Premium & 
                        Unlock Exclusive Features</div>
                            <div className="pause-modal-message">
                            As a Premium member, you can send unlimited messages, see who liked you, view all matches, access special events, and much more!
                            </div>
                            <div className="d-flex justify-content-center" style={{
                                gap : "30px"
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
            </div>
        </>
    )
}
