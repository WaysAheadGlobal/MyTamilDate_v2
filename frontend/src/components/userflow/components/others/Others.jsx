import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './others.module.css';
import { API_URL } from '../../../../api';
import { useCookies } from '../../../../hooks/useCookies';
import { Skeleton } from '@mui/material';
import chatPlaceholder from '../../../../assets/images/chatPlaceholder.svg';
import { Button, Modal } from 'react-bootstrap';

export default function Others() {
    const navigate = useNavigate();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [text, setText] = useState("");
    
    const cookies = useCookies();
    
    const getImageURL = (type, hash, extension, userId) => {
        
        const ext = extension === "png" ? "jpg" : extension;
      
        return type === 1 
          ? `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${ext}` 
          : `${API_URL}media/avatar/${hash}.${ext}`;
      };
    useEffect(() => {
        setProfiles([]);
        (async () => {
            const path = searchParams[0].get("t") === "b" ? "blocked" : "skipped";
            const textshow = searchParams[0].get("t") === "b" ? "You haven’t blocked any members" : "You haven’t skipped any members";
            setText(textshow);
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}customer/matches/${path}`, {
                    headers: {
                        'Authorization': `Bearer ${cookies.getCookie("token")}`
                    }
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setProfiles(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })()
    }, [searchParams[0].get("t")]);

    const handleProfileClick = (profile) => {
        if (searchParams[0].get("t") === "b") {
            setSelectedPersonId(profile.user_id);
            setShowModal(true);
        } else {
            navigate(`/user/${profile.first_name}/${profile.user_id}`);
        }
    };

    return (
        <>
            <ul className={styles.nav}>
                <li
                    onClick={() => navigate("?t=s")}
                    className={(searchParams[0].get("t") === "s" || !searchParams[0].get("t")) ? styles.active : ""}
                >
                    <p>Skipped members</p>
                    <div className={styles.indicator}></div>
                </li>
                <li
                    onClick={() => navigate("?t=b")}
                    className={searchParams[0].get("t") === "b" ? styles.active : ""}
                >
                    <p>Blocked members</p>
                    <div className={styles.indicator}></div>
                </li>
            </ul>
            {
                Array.isArray(profiles) && !loading && profiles.length === 0 && (
                    <div className={styles.chatPlaceholder}>
                        <img src={chatPlaceholder} alt="chat placeholder" />
                        <p>{text}</p>
                    </div>
                )
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
                    Array.isArray(profiles) && profiles.map((profile, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundImage: `url(${getImageURL(profile.type, profile.hash, profile.extension, profile.user_id)})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                            onClick={() => handleProfileClick(profile)}
                        >
                            <div style={{
                                width: "100%",
                            }}>
                                <p>{profile.first_name} </p>
                                <p>{profile.location_string}, {profile.country}</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            <UnblockModal
                show={showModal}
                setShow={setShowModal}
                personId={selectedPersonId}
            />
        </>
    )
}

function UnblockModal({ show, setShow, personId }) {
    const cookies = useCookies();

    async function unblock() {
        const response = await fetch(`${API_URL}customer/matches/unblock`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.getCookie('token')}`
            },
            body: JSON.stringify({
                personId: personId
            })
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            window.location.reload();
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
                }}>Unblock user</p>
                <p
                    style={{
                        fontSize: "16px",
                        margin: "0",
                        textAlign: "center",
                        color: "#6c6c6c"
                    }}
                >Unblocking this member will allow them to message you and show up when you're browsing.</p>
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
                        onClick={unblock}
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
    );
}
