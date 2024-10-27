import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../api';
import './card.css';
import { FaSuitcase } from "react-icons/fa";
import brifcase2 from '../../../../assets/images/brifcase2.png';
import IconButton from '../../../userflow/components/card/IconButton';
import { useCookies } from '../../../../hooks/useCookies';
import ladyIcon from '../../../../assets/images/ladyIcon.png';
import Briefcase from '../../../../assets/images/Briefcase.png';
import { FaLocationDot } from "react-icons/fa6";
import { PiSuitcase } from "react-icons/pi";
// import { useUserProfile } from '../context/UserProfileContext';
import ProfileDetails from '../../../userflow/components/card/ProfileDetails';
import { Dropdown, Modal } from 'react-bootstrap';
import Button from "../../../userflow/components/button/Button";
import { useAlert } from '../../../../Context/AlertModalContext';
import { useSocket } from '../../../../Context/SockerContext';
import { useUserProfile } from '../../../userflow/components/context/UserProfileContext';
import ProfileDetailsPreview from './previewmain';

/**
 * @typedef {Object} Profile
 * @property {number} id - The unique identifier for the user.
 * @property {number} user_id - The user ID associated with the user.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {string} birthday - The birthday of the user in ISO format.
 * @property {string} hash - A hash string associated with the user.
 * @property {string} extension - The file extension of the user's profile picture.
 * @property {number} type - The type of user.
 * @property {number} location_id - The location ID associated with the user.
 * @property {string} created_at - The creation timestamp of the user record in ISO format.
 * @property {number} job_id - The job ID associated with the user.
 * @property {string} country - The country of the user.
 * @property {string} continent - The continent of the user.
 * @property {string} location_string - The location string of the user.
 * @property {string} job - The job of the user.
 * @property {boolean} like - The like status of the user.
 * 
 * @property {Profile[]} profiles - The profiles of the user.
 * @property {React.Dispatch<React.SetStateAction<Profile[]>>} setProfiles - The setProfiles function to update the profiles.
 */

/**
 * Card component to display user information.
 * 
 * @param {Profile} props - The properties passed to the component.
 * @returns {JSX.Element} The Card component.
 */

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function Card({ show, ...props }) {
    const navigate = useNavigate();
    const image = props.type === 1 
    ? `https://data.mytamildate.com/storage/public/uploads/user/${props.user_id}/avatar/${props.hash}-large.${props.extension === "png" ? "jpg" : props.extension}` 
    : `${API_URL}media/avatar/${props.hash}.${props.extension === "png" ? "jpg" : props.extension}`;

    const cookies = useCookies();
    const cardRef = useRef(null);
    const [liked, setLiked] = useState(props.like);
    const { profiles, setProfiles } = useUserProfile();
    const { setPage } = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const alert = useAlert();
    const { socket } = useSocket();
    const [topNavVisible, setTopNavVisible] = useState(true);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    
    useEffect(() => {
        const bottomNav = document.querySelector("#bottomOptions");

        if (!bottomNav) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                setTopNavVisible(entry.isIntersecting);
            })
        });

        observer.observe(bottomNav);
    }, [])

    async function getRoom() {
        // if (cookies.getCookie("isPremium") !== "true") {
        //     alert.setModal({
        //         show: true,
        //         title: "Upgrade to premium",
        //         message: "You need to be a premium user to chat with other users. Would you like to upgrade now?",
        //         onButtonClick: () => navigate("/selectplan"),
        //         showCancelButton: true
        //     });
        //     return;
        // }

        // try {
        //     const response = await fetch(`${API_URL}customer/chat/create-room`, {
        //         method: "POST",
        //         headers: {
        //             'Authorization': `Bearer ${cookies.getCookie("token")}`,
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             participantId: props.user_id
        //         })
        //     });
        //     const data = await response.json();
        //     console.log(data);

        //     if (response.ok) {
        //         if (sessionStorage.getItem("conversationId")) {
        //             socket?.emit("leave-room", sessionStorage.getItem("conversationId"));
        //         }
        //         sessionStorage.setItem("conversationId", data.conversationId);
        //         navigate(`/user/chat/with/${props.first_name}`, {
        //             state: {
        //                 name: props.first_name,
        //                 img: image,
        //                 recepientId: props.user_id,
        //             }
        //         })
        //     }

        // } catch (error) {
        //     console.error(error)
        // }
    }

    async function handleIconButtonClick(type) {
        console.log(type);
        // if (type === "undo" && cookies.getCookie("isPremium") !== "true") {
        //     setShowUpgradeModal(true)
        //     return;
        // }

        // if (type === "chat") {
        //     await getRoom();
        //     return;
        // }
        // const response = await fetch(`${API_URL}customer/matches/${type}`, {
        //     method: "POST",
        //     body: JSON.stringify({
        //         personId: props.user_id
        //     }),
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${cookies.getCookie('token')}`
        //     }
        // });
        // const data = await response.json();

        // if (response.ok) {
        //     console.log(data);

        //     if (type === "undo") {
        //         const undoUser = data.user;
        //         const currentProfileIdx = profiles.findIndex(profile => profile.user_id === props.user_id);
        //         setProfiles([
        //             ...profiles.slice(0, currentProfileIdx),
        //             undoUser,
        //             ...profiles.slice(currentProfileIdx)
        //         ]);
        //         return;
        //     }

        //     if (type === "skip" || type === "like") {

        //         cardRef.current.scrollIntoView({ behavior: "smooth" });

        //         if (profiles.length === 1) {
        //             setPage(prev => prev + 1);
        //         }

        //         if (!window.location.pathname.endsWith(props.user_id)) {
        //             cardRef.current.style.transform = "translateX(-100%)";
        //             cardRef.current.style.transition = "transform 0.25s ease-in-out";
        //             setProfiles(profiles.filter(profile => profile.user_id !== props.user_id));
        //         }

        //         if (window.location.pathname.endsWith(props.user_id) && type === "skip") {
        //             window.location.assign("/user/home");
        //         }

        //         return;
        //     }
        // }
    }
    const capitalizeFirstLetter = (input) => {
        const string = String(input); // Convert the input to a string
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <>
            <UpgradeModal show={showUpgradeModal} setShow={setShowUpgradeModal} />
            <ReportModal show={showReportModal} setShow={setShowReportModal} personId={props.user_id} />
            <BlockModal show={showBlockModal} setShow={setShowBlockModal} personId={props.user_id} />
            <div className='card-and-details-container'>
                <div ref={cardRef} className={`card-container ${show ? 'show' : ''}`}
                    style={{
                        backgroundImage: `
                            linear-gradient(0.05deg, #000000 -1.48%, rgba(0, 0, 0, 0.1) 29.79%, rgba(0, 0, 0, 0) 99.96%),
                            url(${image})
                        `,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: '8px'
                    }}
                >
                    {/* <span className="firstUndoBtn" style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                    }}>
                        <IconButton type='undo' onClick={(e) => {
                            e.stopPropagation();
                            handleIconButtonClick("undo");
                        }} />
                    </span> */}
                    <div className='details-container' style={{
                        width: "100%",
                    }}>
                        <div className='details' style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
                            <p style={{
                                marginBottom: "-10px"
                            }}> <span style={{
                                fontSize: "32px",
                                fontWeight: "600",
                                lineHeight: "48px"
                            }}>{capitalizeFirstLetter(props.first_name)}</span>,  <span style={{
                                fontSize: "32px",
                                fontWeight: "300",
                                lineHeight: "48px"
                            }}>{dayjs().diff(props.birthday, "y")}</span></p>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                gap: "0.5rem",
                                marginBottom: "-10px"
                            }}>
                                <FaSuitcase size={25} />
                                {/* <img  width="25px" height="25px" src={brifcase2} alt="" /> */}
                                <p style={{
                                    fontSize: "medium",
                                }}>{props.job}</p>
                            </div>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                gap: "0.5rem"
                            }}>
                                <FaLocationDot size={25} />
                                <p style={{
                                    fontSize: "medium",
                                }}>{props.location_string}, {props.country}</p>
                            </div>
                        </div>
                        <div className='options' style={{
                            opacity: !topNavVisible ? "1" : "0",
                        }}>
                            {/* <IconButton type='undo' onClick={(e) => {
                                e.stopPropagation();
                                handleIconButtonClick("undo");
                            }} /> */}
                            <IconButton type='skip' onClick={(e) => {
                                e.stopPropagation();
                                handleIconButtonClick("skip");
                            }} />
                            {/* <div style={{
                                position: "relative",
                                top: "1.5rem"
                            }} className='scrollBtn'>
                                <IconButton
                                    type={"details"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.querySelector("#scroll-anchor").scrollIntoView({ behavior: "smooth" });
                                    }} />
                            </div> */}
                            <div style={{
                                display: "flex",
                                // gap: "1rem",
                                alignItems: "end",
                                justifyContent: "center",
                            }}>
                                <IconButton type='chat' onClick={(e) => {
                                    e.stopPropagation();
                                    handleIconButtonClick("chat");
                                }} />
                                <IconButton type={liked ? 'likeActive' : 'like'} onClick={(e) => {
                                    e.stopPropagation();
                                    setLiked(!liked);
                                    handleIconButtonClick("like");
                                }} />
                            </div>
                        </div>
                    </div>
                    <div className='menu' style={{
                        flexDirection: "row !important",
                        justifyContent: "space-between",
                        width: "93%",
                    }}>
                        {
                            window.location.pathname.endsWith(props.user_id) ? (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.history.back();
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 12L20 12M4 12L10 6M4 12L10 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            ) : (<div></div>)
                        }

                        <Dropdown show={showDropdown}
                            onToggle={() => setShowDropdown(!showDropdown)}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate("/user/preferences");
                            }}
                            style={{
                                cursor: "pointer"
                            }}>
                            <Dropdown.Toggle
                                as="div"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z" stroke="#4B164C" stroke-width="1.5" stroke-linecap="round" />
                                </svg>


                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(10px)",
                                border: "none",
                            }}>
                                <Dropdown.Item
                                    as="button"
                                    className='dropdown-hover-button'
                                    style={{
                                        // borderBottom: "1px solid #8b807f",
                                        // marginBottom: "0.5rem",
                                        color: "white"
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate("/user/preferences");
                                    }}
                                >
                                    Preferences
                                </Dropdown.Item>
                                {/* <Dropdown.Item
                                    as="button"
                                    className='dropdown-hover-button'
                                    style={{
                                        borderBottom: "1px solid #8b807f",
                                        marginBottom: "0.5rem",
                                        color: "white"
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowReportModal(true);
                                        setShowDropdown(false);
                                    }}
                                >
                                    Report
                                </Dropdown.Item>
                                <Dropdown.Item
                                    as="button"
                                    className='dropdown-hover-button'
                                    style={{
                                        color: "white"
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowBlockModal(true);
                                        setShowDropdown(false);
                                    }}
                                >
                                    Block
                                </Dropdown.Item> */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div>

                    <ProfileDetails
                        userId={props.user_id}
                        handleIconButtonClick={handleIconButtonClick}
                        liked={liked}
                        setLiked={setLiked}
                    />
                </div>
            </div></>
    )
}

function ReportModal({ show, setShow, personId }) {
    const cookies = useCookies();
    const [options, setOptions] = useState([]);
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
        const response = await fetch(`${API_URL}customer/matches/report`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.getCookie('token')}`
            },
            body: JSON.stringify({
                personId: personId,
                ...Object.fromEntries(new FormData(formRef.current))
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
                    fontSize: "large",
                    fontWeight: "600",
                    margin: "0",
                    marginBottom: "1rem",
                    color: "#6c6c6c"
                }}>Report user?</p>
                <p
                    style={{
                        fontSize: "14px",
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
                                fontSize: "14px",
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
                        style={{
                            borderRadius: "9999px",
                            padding: "0.75rem 1.5rem",
                            border: "2px solid #6c6c6c",
                            color: "#6c6c6c",
                            backgroundColor: "transparent"
                        }}
                        onClick={() => setShow(false)}
                    >
                        Close
                    </button>
                    <Button
                        type="submit"
                        style={{
                            borderRadius: "9999px",
                            padding: "0.75rem 1.5rem",
                        }}
                        onClick={() => formRef.current?.requestSubmit()}
                    >
                        Submit
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

function BlockModal({ show, setShow, personId }) {
    const cookies = useCookies();

    async function block() {
        const response = await fetch(`${API_URL}customer/matches/block`, {
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
                    fontSize: "large",
                    fontWeight: "600",
                    margin: "0",
                    marginBottom: "1rem",
                    color: "#6c6c6c"
                }}>Block user</p>
                <p
                    style={{
                        fontSize: "14px",
                        margin: "0",
                        textAlign: "center",
                        color: "#6c6c6c"
                    }}
                >Blocked members will no longer be able to message you and won't show up when you're browsing</p>
                <div style={{
                    marginTop: "1rem",
                    display: "flex",
                    gap: "1rem",
                    marginInline: "auto",
                }}>
                    <button
                        type='button'
                        style={{
                            borderRadius: "9999px",
                            padding: "0.75rem 1.5rem",
                            border: "2px solid #6c6c6c",
                            color: "#6c6c6c",
                            backgroundColor: "transparent"
                        }}
                        onClick={() => setShow(false)}
                    >
                        Close
                    </button>
                    <Button
                        onClick={block}
                        style={{
                            borderRadius: "9999px",
                            padding: "0.75rem 1.5rem",
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

function UpgradeModal({ show, setShow }) {
    return (
        <Modal size='sm' centered show={show}>
            <Modal.Body style={{
                position: "relative",
                padding: "1rem"
            }}>
                <span
                    style={{
                        position: "absolute",
                        top: "-7px",
                        right: "-7px",
                    }}
                    onClick={() => {
                        setShow(false);
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="white" />
                        <path d="M16 8L8 16M8.00001 8L16 16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M19 5L5 19M5.00001 5L19 19" stroke="#5E5E5E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <p style={{
                    fontSize: "large",
                    fontWeight: "500",
                    margin: "0",
                    marginBottom: "1rem",
                    color: "#6c6c6c"
                }}>You can undo matches that you've passed on if you change your mind.</p>
                <div style={{
                    marginTop: "1rem",
                    display: "flex",
                    gap: "1rem",
                    marginInline: "auto",
                }}>
                    <Button
                        onClick={() => window.location.assign("/selectplan")}
                        style={{
                            borderRadius: "9999px",
                            padding: "0.75rem 1.5rem",
                        }}
                    >
                        Upgrade now
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}