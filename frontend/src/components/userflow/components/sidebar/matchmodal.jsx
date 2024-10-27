import React, { useState } from 'react';
import styles from './CustomModal.module.css';
import HorizontalLogo from '../../../../assets/images/HorizontalLogo.png';
import profilepic from '../../../../assets/images/profilepic.png'; // Default image for fallback
import { API_URL } from '../../../../api';
import { useCookies } from '../../../../hooks/useCookies';
import UpgradeModal from '../upgradenow/upgradenow';
import { useSocket } from '../../../../Context/SockerContext';
import { useNavigate } from 'react-router-dom';

const MatchCustomModal = ({ matchmodal, handleClose, MatchuserDetails }) => {
    const cookies = useCookies();
    const [showmodal, setshowmodal] = useState(false);
    const { socket } = useSocket();
    const navigate = useNavigate();
    const userId = cookies.getCookie("userId");
   console.log(MatchuserDetails);
    if (!matchmodal || !MatchuserDetails) return null;
 const{withUserIdP,
    userDetailsP,
    mediaP,
    withUserIdU,
    userDetailsU,
    mediaU}  = MatchuserDetails


    // Function to get image URL
    const getImageURL = (type, hash, extension, userId) => {
        console.log(type, hash, extension, userId)
        if (type === 1) {
            return `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${extension}`;
        } else {
            return `${API_URL}media/avatar/${hash}.${extension}`;
        }
    };

    // Default to profilepic if no media is available
    const user2Image =  mediaP && mediaP[0]
        ? getImageURL(mediaP[0].type, mediaP[0].hash, mediaP[0].extension, withUserIdP)
        : profilepic;
 
    const user1Image = mediaU && mediaU[0]
        ? getImageURL(mediaU[0].type, mediaU[0].hash, mediaU[0].extension, withUserIdU)
        : profilepic;

    async function getRoom() {
        if (cookies.getCookie("isPremium") !== "true") {
            setshowmodal(true);
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
                    participantId: withUserIdP
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (sessionStorage.getItem("conversationId")) {
                    socket?.emit("leave-room", sessionStorage.getItem("conversationId"));
                }
                sessionStorage.setItem("conversationId", data.conversationId);
                navigate(`/user/chat/with/${userDetailsP.first_name}`, {
                    state: {
                        name: userDetailsP.first_name,
                        img: user2Image,
                        recepientId: userId
                    }
                });
            }

        } catch (error) {
            console.error(error);
        }
    }
     
      
           
    

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={handleClose}>&times;</button>
                <img className={styles.img} src={HorizontalLogo} alt="Horizontal Logo" />
                <p className={styles.text}>
                    It’s a <span style={{ color: "#4B164C" }}>match!</span>
                </p>

                <div className={styles.bothimg}>
                    <div className={`${styles.maincontainer} ${styles.left}`}>
                        <div className={styles.imgContainer}>
                            <img
                                src={user1Image}
                                alt="User 1"
                                width={270}
                                height={270}
                                style={{
                                    borderRadius: "9999px",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    </div>

                    <div className={`${styles.maincontainer} ${styles.right}`}>
                        <div className={styles.imgContainer}>
                            <img
                                src={user2Image}
                                alt="User 2"
                                width={270}
                                height={270}
                                style={{
                                    borderRadius: "9999px",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <button className={styles.button} onClick={getRoom}>Send a message</button>
                <p className={styles.keepbrowsing} onClick={handleClose}>Keep browsing</p>
            </div>
            <UpgradeModal show={showmodal} setShow={setshowmodal} />
        </div>
    );
};

export default MatchCustomModal;
