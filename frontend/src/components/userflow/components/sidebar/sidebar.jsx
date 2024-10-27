import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../api';
import { useSocket } from '../../../../Context/SockerContext';
import logo from "../../../../assets/images/MTDlogo.png";
import heartLogo from "../../../../assets/images/heart-logo.png";
import { useCookies } from '../../../../hooks/useCookies';
import { useAlert } from '../../../../Context/AlertModalContext';

import Navbar from '../navbar/Navbar';
import styles from './sidebar.module.css';
import Suggestions from './suggestions';
import ProfileCompletion from './ProfileCompletion';
import { Modal } from 'react-bootstrap';
import LogoutModal from '../../../Account-Settings/logout';
import MatchCustomModal from './matchmodal';

export default function Sidebar({ children }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [Rejected, setRejected] = useState(false);
    const [view, setView] = useState(false);
    const [userDetails, setUserDetails] = useState({}); // To store media data
    const [pathname, setPathname] = useState([]);
    const location = useLocation();
    const suffix = pathname.at(-1);
    const navigate = useNavigate();
    const cookies = useCookies();
    const { socket } = useSocket();
    const alert = useAlert();
    const RejectedorNot = cookies.getCookie('approval');
    const [showRejectedModal, setShowRejectedModal] = useState(false);
    const [matchmodal, setMatchmodal] = useState(false);
    const handleShowLogout = () => setShowLogoutModal(true);
    const handleCloseLogout = () => setShowLogoutModal(false);
    const handleLogout = () => {
        cookies.deleteCookie("token");
        cookies.deleteCookie("approval");
        cookies.deleteCookie("isPremium");
        navigate("/");
        setShowLogoutModal(false);
    };
    useEffect(() => {
        if (RejectedorNot === 'REJECTED') {
            setRejected(true);
        }
    }, []);

    useEffect(() => {
        if (!socket) {
            console.log("Socket is not initialized.");
            return;
        }
        const handleNewMatch = ({ withUserIdP, userDetailsP, mediaP,withUserIdU, userDetailsU, mediaU }) => {
            console.log("New match event received:", withUserIdU,);
            cookies.setCookie("NewMatch", withUserIdU, 1);
            const newUserDetails = {
                withUserIdP,
                userDetailsP,
                mediaP,
                withUserIdU,
                userDetailsU,
                mediaU
            };
        
            // Update state with the new details object
            setUserDetails(newUserDetails); // Store the media and user details
        
            console.log(userDetails); // This should log the updated details object
            setMatchmodal(true);
            // alert.setModal({
            //     show: true,
            //     title: "New Match!",
            //     message: `You have a new match`,
            //     onButtonClick: () => {
            //         // Optional: Redirect to the new match's profile or chat
            //     }
            // });
        };
        console.log("Setting up 'new-match' listener.");
        // Listen for the 'new-match' event from the server
        socket.on("new-match", handleNewMatch);
        // Clean up the event listener on component unmount
        return () => {
            console.log("Cleaning up 'new-match' listener.");
            socket.off("new-match", handleNewMatch);
        };
    }, [socket]);

    useEffect(() => {
        console.log("Updated userDetails:", userDetails);
        // setMatchmodal(true);
    }, [userDetails]);

    const noNavbarRoutes = [
        '/updatelocations',
        '/updatereligion',
        '/updateheight',
        '/updatejob',
        '/updatesmoke',
        '/updatedrink',
        '/updatefamilyplan',
        '/updatekids',
        '/updatelanguage',
        '/updateeducations',
        '/updateage',
        '/updateanswer',
        '/personalityupdate',
        '/unsubscribe',
        '/selectplan',
        '/editpicture',
        '/updategender',
        '/wantgender'
    ];

    const showNavbar = isMobile && !noNavbarRoutes.includes(location.pathname);

    useEffect(() => {
        setPathname(window.location.pathname.split("/"));
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1000 || window.location.pathname === "/paymentplan") {
                setIsTablet(true);
                console.log("Tablet view enabled");
            } else {
                setIsTablet(false);
                console.log("Tablet view disabled");
            }

            if (window.innerWidth < 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (window.location.pathname === "/user/pause") {
            return;
        }

        (async () => {
            const response = await fetch(`${API_URL}/user/check-approval`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.getCookie('token')}`,
                },
            });

            const result = await response.json();
            cookies.setCookie('approval', result.approval);
            cookies.setCookie('active', result.active);

            if (!result.active) {
                window.location.replace("/user/pause");
                return;
            }

            if (result.approval === "PENDING") {
                setView(true);
            }

            if (result.approval === "REJECTED") {
                setView(true);
                // if (window.location.pathname.includes("user")) {
                //     window.location.replace("/not-approved");
                // }
            }
        })()
    }, [pathname]);

    function navigateTo(path) {

        navigate(path);

    }

    return (
        <section className={styles['section-container']}>
          <MatchCustomModal
                matchmodal={matchmodal}
                handleClose={() => setMatchmodal(false)}
                MatchuserDetails={userDetails} // Pass the user media data
            />
            <RejectModal show={showRejectedModal} setShow={setShowRejectedModal} />
            <aside className={`${styles['sidebar']} ${location.pathname === "/paymentplan" ? styles['paymentplanSidebar'] : ''}`}>
                {
                    isTablet ? <img src={heartLogo} alt="" style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'contain',
                    }} /> : <img src={logo} alt="" />
                }
                {
                    cookies.getCookie('isPremium') !== "true" && (
                        <button className={styles["upgradeBtn"]} onClick={() => navigateTo("/selectplan")}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.84167 9.06245C8.53827 9.06245 9.10527 9.62945 9.10527 10.326C9.10527 10.7778 8.86767 11.1846 8.46987 11.415C8.28267 11.523 8.21967 11.7624 8.32767 11.9496L12.5829 19.3189C12.6531 19.4395 12.7809 19.5151 12.9213 19.5151C13.0617 19.5151 13.1895 19.4413 13.2597 19.3189L17.5149 11.9479C17.6229 11.7607 17.5599 11.523 17.3727 11.415C16.9749 11.1846 16.7391 10.7779 16.7391 10.3279C16.7391 9.63125 17.3061 9.06425 18.0027 9.06425C18.6993 9.06425 19.2663 9.63125 19.2663 10.3279C19.2663 10.7797 19.0287 11.1865 18.6291 11.4169C18.5391 11.4691 18.4743 11.5536 18.4473 11.6544C18.4203 11.7552 18.4347 11.8614 18.4869 11.9514L22.7457 19.3207C22.8159 19.4412 22.9437 19.5169 23.0841 19.5169C23.2245 19.5169 23.3523 19.4431 23.4225 19.3207L27.6777 11.9514C27.7857 11.7642 27.7209 11.5249 27.5355 11.4169C27.1377 11.1865 26.9001 10.7797 26.9001 10.3279C26.9001 9.63125 27.4671 9.06425 28.1637 9.06425C28.8603 9.06425 29.4273 9.63125 29.4273 10.3279C29.4273 11.0245 28.8603 11.5914 28.1637 11.5914C27.9477 11.5914 27.7731 11.766 27.7731 11.982V23.1493H19.0107C18.7947 23.1493 18.6201 23.3239 18.6201 23.5399C18.6201 23.7559 18.7947 23.9304 19.0107 23.9304H27.7731V26.9328H8.23407V11.9803C8.23407 11.7643 8.05947 11.5896 7.84348 11.5896C7.14688 11.5896 6.57987 11.0226 6.57987 10.326C6.57987 9.62945 7.14507 9.06245 7.84167 9.06245Z" fill="white" />
                            </svg>
                            <span style={{ fontSize: "16px" }}>Upgrade Account</span>
                        </button>
                    )
                }
                <ul>
                    <li className={suffix === "home" ? styles["active"] : ""} onClick={() => window.location.href = '/user/home'}>
                        <div className={styles['indicator']}></div>
                        <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.66406 12.1667L13.9974 4L23.3307 12.1667L23.3307 23.8333H17.4974V19.1667C17.4974 18.2384 17.1287 17.3482 16.4723 16.6918C15.8159 16.0354 14.9257 15.6667 13.9974 15.6667C13.0691 15.6667 12.1789 16.0354 11.5225 16.6918C10.8661 17.3482 10.4974 18.2384 10.4974 19.1667V23.8333H4.66407L4.66406 12.1667Z" stroke="#515151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span style={{ fontSize: "16px" }}>Home</span>
                    </li>
                    <li className={suffix === "preferences" ? styles["active"] : ""} onClick={() => navigateTo("/user/preferences")}>
                        <div className={styles['indicator']}></div>
                        <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.66406 6.33333L11.6641 6.33333M11.6641 6.33333C11.6641 7.622 12.7087 8.66667 13.9974 8.66667C15.2861 8.66667 16.3307 7.622 16.3307 6.33333M11.6641 6.33333C11.6641 5.04467 12.7087 4 13.9974 4C15.2861 4 16.3307 5.04467 16.3307 6.33333M16.3307 6.33333L23.3307 6.33333M4.66406 14.5H18.6641M18.6641 14.5C18.6641 15.7887 19.7087 16.8333 20.9974 16.8333C22.2861 16.8333 23.3307 15.7887 23.3307 14.5C23.3307 13.2113 22.2861 12.1667 20.9974 12.1667C19.7087 12.1667 18.6641 13.2113 18.6641 14.5ZM9.33073 22.6667H23.3307M9.33073 22.6667C9.33073 21.378 8.28606 20.3333 6.9974 20.3333C5.70873 20.3333 4.66406 21.378 4.66406 22.6667C4.66406 23.9553 5.70873 25 6.9974 25C8.28606 25 9.33073 23.9553 9.33073 22.6667Z" stroke="#515151" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        <span style={{ fontSize: "16px" }}>Preferences</span>
                    </li>
                    <li className={pathname.includes("chat") ? styles["active"] : ""} onClick={() => navigateTo("/user/chat")}>
                        <div className={styles['indicator']}></div>
                        <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.0012 4.23438C8.33684 4.23438 3.73458 8.83664 3.73458 14.501C3.73458 16.1577 4.15831 17.7798 4.92458 19.2461L3.74718 24.1928C3.72861 24.2704 3.73026 24.3515 3.75198 24.4283C3.77369 24.5051 3.81474 24.575 3.8712 24.6315C3.92765 24.6879 3.99764 24.7289 4.07446 24.7505C4.15128 24.7722 4.23237 24.7737 4.30998 24.7551L9.25664 23.5777C10.7224 24.344 12.3446 24.7677 14.0012 24.7677C19.6652 24.7677 24.2679 20.1659 24.2679 14.501C24.2679 8.83617 19.6661 4.23438 14.0012 4.23438ZM14.0012 5.16771C19.1616 5.16771 23.3346 9.34111 23.3346 14.501C23.3346 19.661 19.1612 23.8344 14.0012 23.8344C12.4309 23.8344 10.8853 23.4377 9.50864 22.6817C9.40713 22.626 9.28854 22.61 9.17591 22.6369L4.83124 23.671L5.86538 19.3264C5.89238 19.2138 5.87658 19.0952 5.82104 18.9936C5.06484 17.617 4.66822 16.0717 4.66791 14.501C4.66791 9.34064 8.84131 5.16771 14.0012 5.16771Z" fill="#2B2B2B" />
                            <path d="M9.3375 13.1016C8.56983 13.1016 7.9375 13.7339 7.9375 14.5016C7.9375 15.2692 8.56983 15.9016 9.3375 15.9016C10.1052 15.9016 10.7375 15.2692 10.7375 14.5016C10.7375 13.7339 10.1052 13.1016 9.3375 13.1016ZM9.3375 14.0349C9.6007 14.0349 9.80417 14.2384 9.80417 14.5016C9.80417 14.7648 9.6007 14.9682 9.3375 14.9682C9.0743 14.9682 8.87083 14.7648 8.87083 14.5016C8.87083 14.2384 9.0743 14.0349 9.3375 14.0349ZM14.0042 13.1016C13.2365 13.1016 12.6042 13.7339 12.6042 14.5016C12.6042 15.2692 13.2365 15.9016 14.0042 15.9016C14.7718 15.9016 15.4042 15.2692 15.4042 14.5016C15.4042 13.7339 14.7718 13.1016 14.0042 13.1016ZM14.0042 14.0349C14.2674 14.0349 14.4708 14.2384 14.4708 14.5016C14.4708 14.7648 14.2674 14.9682 14.0042 14.9682C13.741 14.9682 13.5375 14.7648 13.5375 14.5016C13.5375 14.2384 13.741 14.0349 14.0042 14.0349ZM18.6708 13.1016C17.9032 13.1016 17.2708 13.7339 17.2708 14.5016C17.2708 15.2692 17.9032 15.9016 18.6708 15.9016C19.4385 15.9016 20.0708 15.2692 20.0708 14.5016C20.0708 13.7339 19.4385 13.1016 18.6708 13.1016ZM18.6708 14.0349C18.934 14.0349 19.1375 14.2384 19.1375 14.5016C19.1375 14.7648 18.934 14.9682 18.6708 14.9682C18.4076 14.9682 18.2042 14.7648 18.2042 14.5016C18.2042 14.2384 18.4076 14.0349 18.6708 14.0349Z" fill="#2B2B2B" />
                        </svg>
                        <span style={{ fontSize: "16px" }}>Matches</span>
                    </li>
                    <hr style={{
                        marginBlock: "2rem",
                        border: "1px solid #939393",
                        padding: "0",
                    }} />
                    <li className={suffix === "updateprofile" ? styles["active"] : ""} onClick={() => navigate("/updateprofile")}>
                        <div className={styles['indicator']}></div>
                        <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 22.3264C21 20.4366 19.633 17.9999 17.5 18H10.5C8.367 17.9999 7 20.4366 7 22.3264M3.5 14.5C3.5 8.70101 8.20101 4 14 4C19.799 4 24.5 8.70101 24.5 14.5C24.5 20.299 19.799 25 14 25C8.20101 25 3.5 20.299 3.5 14.5ZM17.5 11C17.5 12.933 15.933 14.5 14 14.5C12.067 14.5 10.5 12.933 10.5 11C10.5 9.067 12.067 7.5 14 7.5C15.933 7.5 17.5 9.067 17.5 11Z" stroke="#515151" stroke-width="2" />
                        </svg>
                        <span style={{ fontSize: "16px" }}>Profile</span>
                    </li>
                    <li className={suffix === "accoutsetting" ? styles["active"] : ""} onClick={() => navigate("/accoutsetting")}>
                        <div className={styles['indicator']}></div>
                        <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.8333 4H15.1667C15.811 4 16.3333 4.52233 16.3333 5.16667V5.83025C16.3333 6.32935 16.6683 6.76296 17.1293 6.95433C17.5904 7.14578 18.1273 7.07281 18.4803 6.71977L18.9497 6.25039C19.4053 5.79478 20.144 5.79478 20.5996 6.25039L22.2495 7.90031C22.7051 8.35592 22.7051 9.09461 22.2495 9.55022L21.7802 10.0195C21.4271 10.3726 21.3542 10.9095 21.5456 11.3707C21.737 11.8317 22.1707 12.1667 22.6698 12.1667L23.3333 12.1667C23.9777 12.1667 24.5 12.689 24.5 13.3333V15.6667C24.5 16.311 23.9777 16.8333 23.3333 16.8333H22.6698C22.1707 16.8333 21.737 17.1683 21.5457 17.6293C21.3542 18.0904 21.4272 18.6273 21.7802 18.9804L22.2496 19.4497C22.7052 19.9053 22.7052 20.644 22.2496 21.0996L20.5996 22.7496C20.144 23.2052 19.4053 23.2052 18.9497 22.7496L18.4804 22.2802C18.1273 21.9272 17.5904 21.8542 17.1293 22.0457C16.6683 22.237 16.3333 22.6707 16.3333 23.1698V23.8333C16.3333 24.4777 15.811 25 15.1667 25H12.8333C12.189 25 11.6667 24.4777 11.6667 23.8333V23.1698C11.6667 22.6707 11.3317 22.237 10.8707 22.0456C10.4095 21.8542 9.8726 21.9271 9.51953 22.2802L9.05021 22.7495C8.59459 23.2052 7.8559 23.2052 7.40029 22.7495L5.75037 21.0996C5.29476 20.644 5.29476 19.9053 5.75037 19.4497L6.21977 18.9803C6.57281 18.6273 6.64578 18.0904 6.45433 17.6293C6.26296 17.1683 5.82935 16.8333 5.33025 16.8333H4.66667C4.02233 16.8333 3.5 16.311 3.5 15.6667V13.3333C3.5 12.689 4.02233 12.1667 4.66667 12.1667L5.33023 12.1667C5.82934 12.1667 6.26296 11.8317 6.45434 11.3707C6.6458 10.9096 6.57283 10.3727 6.21977 10.0196L5.75039 9.55023C5.29478 9.09462 5.29478 8.35592 5.75039 7.90031L7.40031 6.2504C7.85592 5.79479 8.59461 5.79479 9.05023 6.2504L9.5196 6.71977C9.87266 7.07283 10.4096 7.1458 10.8707 6.95434C11.3317 6.76296 11.6667 6.32934 11.6667 5.83022V5.16667C11.6667 4.52233 12.189 4 12.8333 4Z" stroke="#515151" stroke-width="2" />
                            <path d="M16.3333 14.5C16.3333 15.7887 15.2887 16.8333 14 16.8333C12.7113 16.8333 11.6667 15.7887 11.6667 14.5C11.6667 13.2113 12.7113 12.1667 14 12.1667C15.2887 12.1667 16.3333 13.2113 16.3333 14.5Z" stroke="#515151" stroke-width="2" />
                        </svg>
                        <span style={{ fontSize: "16px" }}>Account</span>
                    </li>
                </ul>
                {/* <button className={styles['recommendation']} onClick={() => navigate("/user/recommendations")}>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_i_3340_10418)">
                            <path d="M27 15C27 21.6274 21.6274 27 15 27C8.37258 27 3 21.6274 3 15C3 8.37258 8.37258 3 15 3C21.6274 3 27 8.37258 27 15Z" stroke="url(#paint0_angular_3340_10418)" stroke-width="6" />
                        </g>
                        <defs>
                            <filter id="filter0_i_3340_10418" x="-1" y="0" width="31" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="-1" dy="4" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3340_10418" />
                            </filter>
                            <radialGradient id="paint0_angular_3340_10418" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(159.167 95) rotate(90) scale(15)">
                                <stop stop-color="#4B164C" />
                                <stop offset="0.580224" stop-color="#872889" />
                                <stop offset="1" stop-color="#B034B2" />
                            </radialGradient>
                        </defs>
                    </svg>
                    <span>AI Recommendation</span>
                </button> */}
                <div className={styles['last-section']}>
                    <div style={{
                        marginTop: '1.5rem',
                        cursor: "pointer"
                    }} onClick={() => navigate("/helpsupport")}>
                        <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 20.3333V20.325M14 17.8333C14 14.0833 17.5 14.9167 17.5 12C17.5 10.1591 15.933 8.66667 14 8.66667C12.4328 8.66667 11.1062 9.64763 10.6602 11M24.5 14.5C24.5 20.299 19.799 25 14 25C8.20101 25 3.5 20.299 3.5 14.5C3.5 8.70101 8.20101 4 14 4C19.799 4 24.5 8.70101 24.5 14.5Z" stroke="#515151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span style={{ fontSize: "16px" }}>Help & Support</span>
                    </div>
                    <div style={{ cursor: "pointer" }}
                        onClick={() => setShowLogoutModal(true)}
                    // onClick={() => {
                    //     cookies.deleteCookie("token");
                    //     cookies.deleteCookie("approval");
                    //     cookies.deleteCookie("isPremium");
                    //     window.location.replace("/");
                    // }}
                    >
                        <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.4974 5.16797H20.9974C22.2861 5.16797 23.3307 6.21264 23.3307 7.5013V21.5013C23.3307 22.79 22.2861 23.8346 20.9974 23.8346H17.4974M9.33073 9.83464L4.66406 14.5013M4.66406 14.5013L9.33073 19.168M4.66406 14.5013L18.6641 14.5013" stroke="#515151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span style={{ fontSize: "16px" }}>Logout</span>
                    </div>
                </div>
            </aside>
            <div className={styles['main-contains']}>
                {children}
                {showNavbar && <Navbar />}
                {Rejected}
            </div>
            <aside className={`${styles['upcoming']} ${location.pathname === "/paymentplan" ? styles['paymentplanupcoming'] : ''}`}>
                <ProfileCompletion />
                <Suggestions Rejected={view} />

            </aside>
            <LogoutModal
                showLogoutModal={showLogoutModal}
                handleCloseLogout={handleCloseLogout}
                handleLogout={handleLogout}
            />
        </section>
    )
}

export function MobileSidebar() {
    const [pathname, setPathname] = useState([]);
    const [Rejected, setRejected] = useState(false);
    const suffix = pathname.at(-1);
    const navigate = useNavigate();
    const cookies = useCookies();
    const [showRejectedModal, setShowRejectedModal] = useState(false);

    useEffect(() => {
        setPathname(window.location.pathname.split("/"));
    }, []);

    useEffect(() => {
        async function checkApproval() {
            const response = await fetch(`${API_URL}/user/check-approval`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.getCookie('token')}`,
                },
            });

            const result = await response.json();

            cookies.setCookie('approval', result.approval);
            console.log(result);
            if (!result.active) {
                window.location.replace("/user/pause");
                return;
            }

            // if (result.approval === "PENDING") {
            //     window.location.replace("/pending");
            //     return;
            // }

            // if (result.approval === "REJECTED") {
            //     setRejected(true);
            //     if (window.location.pathname.includes("user")) {
            //         window.location.replace("/not-approved");
            //     }

            // }
        }
        if (window.location.pathname !== "/user/pause") {
            checkApproval();
        }
    }, [pathname]);

    function navigateTo(path) {

        navigate(path);
    }

    return (
        <aside className={styles['sidebar']}>
            <RejectModal show={showRejectedModal} setShow={setShowRejectedModal} />
            <img src={heartLogo} alt="" style={{
                width: '50px',
                height: '50px',
                objectFit: 'contain',
            }} />
            <ul>
                <li className={suffix === "home" ? styles["active"] : ""} onClick={() => window.location.href = '/user/home'}>
                    <div className={styles['indicator']}></div>
                    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.66406 12.1667L13.9974 4L23.3307 12.1667L23.3307 23.8333H17.4974V19.1667C17.4974 18.2384 17.1287 17.3482 16.4723 16.6918C15.8159 16.0354 14.9257 15.6667 13.9974 15.6667C13.0691 15.6667 12.1789 16.0354 11.5225 16.6918C10.8661 17.3482 10.4974 18.2384 10.4974 19.1667V23.8333H4.66407L4.66406 12.1667Z" stroke="#515151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </li>
                <li className={suffix === "preferences" ? styles["active"] : ""} onClick={() => navigateTo("/user/preferences")}>
                    <div className={styles['indicator']}></div>
                    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.66406 6.33333L11.6641 6.33333M11.6641 6.33333C11.6641 7.622 12.7087 8.66667 13.9974 8.66667C15.2861 8.66667 16.3307 7.622 16.3307 6.33333M11.6641 6.33333C11.6641 5.04467 12.7087 4 13.9974 4C15.2861 4 16.3307 5.04467 16.3307 6.33333M16.3307 6.33333L23.3307 6.33333M4.66406 14.5H18.6641M18.6641 14.5C18.6641 15.7887 19.7087 16.8333 20.9974 16.8333C22.2861 16.8333 23.3307 15.7887 23.3307 14.5C23.3307 13.2113 22.2861 12.1667 20.9974 12.1667C19.7087 12.1667 18.6641 13.2113 18.6641 14.5ZM9.33073 22.6667H23.3307M9.33073 22.6667C9.33073 21.378 8.28606 20.3333 6.9974 20.3333C5.70873 20.3333 4.66406 21.378 4.66406 22.6667C4.66406 23.9553 5.70873 25 6.9974 25C8.28606 25 9.33073 23.9553 9.33073 22.6667Z" stroke="#515151" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </li>
                <li className={pathname.includes("chat") ? styles["active"] : ""} onClick={() => navigateTo("/user/chat")}>
                    <div className={styles['indicator']}></div>
                    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.0012 4.23438C8.33684 4.23438 3.73458 8.83664 3.73458 14.501C3.73458 16.1577 4.15831 17.7798 4.92458 19.2461L3.74718 24.1928C3.72861 24.2704 3.73026 24.3515 3.75198 24.4283C3.77369 24.5051 3.81474 24.575 3.8712 24.6315C3.92765 24.6879 3.99764 24.7289 4.07446 24.7505C4.15128 24.7722 4.23237 24.7737 4.30998 24.7551L9.25664 23.5777C10.7224 24.344 12.3446 24.7677 14.0012 24.7677C19.6652 24.7677 24.2679 20.1659 24.2679 14.501C24.2679 8.83617 19.6661 4.23438 14.0012 4.23438ZM14.0012 5.16771C19.1616 5.16771 23.3346 9.34111 23.3346 14.501C23.3346 19.661 19.1612 23.8344 14.0012 23.8344C12.4309 23.8344 10.8853 23.4377 9.50864 22.6817C9.40713 22.626 9.28854 22.61 9.17591 22.6369L4.83124 23.671L5.86538 19.3264C5.89238 19.2138 5.87658 19.0952 5.82104 18.9936C5.06484 17.617 4.66822 16.0717 4.66791 14.501C4.66791 9.34064 8.84131 5.16771 14.0012 5.16771Z" fill="#2B2B2B" />
                        <path d="M9.3375 13.1016C8.56983 13.1016 7.9375 13.7339 7.9375 14.5016C7.9375 15.2692 8.56983 15.9016 9.3375 15.9016C10.1052 15.9016 10.7375 15.2692 10.7375 14.5016C10.7375 13.7339 10.1052 13.1016 9.3375 13.1016ZM9.3375 14.0349C9.6007 14.0349 9.80417 14.2384 9.80417 14.5016C9.80417 14.7648 9.6007 14.9682 9.3375 14.9682C9.0743 14.9682 8.87083 14.7648 8.87083 14.5016C8.87083 14.2384 9.0743 14.0349 9.3375 14.0349ZM14.0042 13.1016C13.2365 13.1016 12.6042 13.7339 12.6042 14.5016C12.6042 15.2692 13.2365 15.9016 14.0042 15.9016C14.7718 15.9016 15.4042 15.2692 15.4042 14.5016C15.4042 13.7339 14.7718 13.1016 14.0042 13.1016ZM14.0042 14.0349C14.2674 14.0349 14.4708 14.2384 14.4708 14.5016C14.4708 14.7648 14.2674 14.9682 14.0042 14.9682C13.741 14.9682 13.5375 14.7648 13.5375 14.5016C13.5375 14.2384 13.741 14.0349 14.0042 14.0349ZM18.6708 13.1016C17.9032 13.1016 17.2708 13.7339 17.2708 14.5016C17.2708 15.2692 17.9032 15.9016 18.6708 15.9016C19.4385 15.9016 20.0708 15.2692 20.0708 14.5016C20.0708 13.7339 19.4385 13.1016 18.6708 13.1016ZM18.6708 14.0349C18.934 14.0349 19.1375 14.2384 19.1375 14.5016C19.1375 14.7648 18.934 14.9682 18.6708 14.9682C18.4076 14.9682 18.2042 14.7648 18.2042 14.5016C18.2042 14.2384 18.4076 14.0349 18.6708 14.0349Z" fill="#2B2B2B" />
                    </svg>
                </li>
                <hr style={{
                    marginBlock: "2rem",
                    border: "1px solid #939393",
                    padding: "0",
                }} />

                <li className={suffix === "updateprofile" ? styles["active"] : ""} onClick={() => navigate("/updateprofile")}>
                    <div className={styles['indicator']}></div>
                    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 22.3264C21 20.4366 19.633 17.9999 17.5 18H10.5C8.367 17.9999 7 20.4366 7 22.3264M3.5 14.5C3.5 8.70101 8.20101 4 14 4C19.799 4 24.5 8.70101 24.5 14.5C24.5 20.299 19.799 25 14 25C8.20101 25 3.5 20.299 3.5 14.5ZM17.5 11C17.5 12.933 15.933 14.5 14 14.5C12.067 14.5 10.5 12.933 10.5 11C10.5 9.067 12.067 7.5 14 7.5C15.933 7.5 17.5 9.067 17.5 11Z" stroke="#515151" stroke-width="2" />
                    </svg>
                </li>
                <li className={suffix === "accoutsetting" ? styles["active"] : ""} onClick={() => navigate("/accoutsetting")}>
                    <div className={styles['indicator']}></div>
                    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8333 4H15.1667C15.811 4 16.3333 4.52233 16.3333 5.16667V5.83025C16.3333 6.32935 16.6683 6.76296 17.1293 6.95433C17.5904 7.14578 18.1273 7.07281 18.4803 6.71977L18.9497 6.25039C19.4053 5.79478 20.144 5.79478 20.5996 6.25039L22.2495 7.90031C22.7051 8.35592 22.7051 9.09461 22.2495 9.55022L21.7802 10.0195C21.4271 10.3726 21.3542 10.9095 21.5456 11.3707C21.737 11.8317 22.1707 12.1667 22.6698 12.1667L23.3333 12.1667C23.9777 12.1667 24.5 12.689 24.5 13.3333V15.6667C24.5 16.311 23.9777 16.8333 23.3333 16.8333H22.6698C22.1707 16.8333 21.737 17.1683 21.5457 17.6293C21.3542 18.0904 21.4272 18.6273 21.7802 18.9804L22.2496 19.4497C22.7052 19.9053 22.7052 20.644 22.2496 21.0996L20.5996 22.7496C20.144 23.2052 19.4053 23.2052 18.9497 22.7496L18.4804 22.2802C18.1273 21.9272 17.5904 21.8542 17.1293 22.0457C16.6683 22.237 16.3333 22.6707 16.3333 23.1698V23.8333C16.3333 24.4777 15.811 25 15.1667 25H12.8333C12.189 25 11.6667 24.4777 11.6667 23.8333V23.1698C11.6667 22.6707 11.3317 22.237 10.8707 22.0456C10.4095 21.8542 9.8726 21.9271 9.51953 22.2802L9.05021 22.7495C8.59459 23.2052 7.8559 23.2052 7.40029 22.7495L5.75037 21.0996C5.29476 20.644 5.29476 19.9053 5.75037 19.4497L6.21977 18.9803C6.57281 18.6273 6.64578 18.0904 6.45433 17.6293C6.26296 17.1683 5.82935 16.8333 5.33025 16.8333H4.66667C4.02233 16.8333 3.5 16.311 3.5 15.6667V13.3333C3.5 12.689 4.02233 12.1667 4.66667 12.1667L5.33023 12.1667C5.82934 12.1667 6.26296 11.8317 6.45434 11.3707C6.6458 10.9096 6.57283 10.3727 6.21977 10.0196L5.75039 9.55023C5.29478 9.09462 5.29478 8.35592 5.75039 7.90031L7.40031 6.2504C7.85592 5.79479 8.59461 5.79479 9.05023 6.2504L9.5196 6.71977C9.87266 7.07283 10.4096 7.1458 10.8707 6.95434C11.3317 6.76296 11.6667 6.32934 11.6667 5.83022V5.16667C11.6667 4.52233 12.189 4 12.8333 4Z" stroke="#515151" stroke-width="2" />
                        <path d="M16.3333 14.5C16.3333 15.7887 15.2887 16.8333 14 16.8333C12.7113 16.8333 11.6667 15.7887 11.6667 14.5C11.6667 13.2113 12.7113 12.1667 14 12.1667C15.2887 12.1667 16.3333 13.2113 16.3333 14.5Z" stroke="#515151" stroke-width="2" />
                    </svg>
                </li>
                {/* <li onClick={() => !Rejected && navigate("/user/recommendations")}>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_i_3340_10418)">
                            <path d="M27 15C27 21.6274 21.6274 27 15 27C8.37258 27 3 21.6274 3 15C3 8.37258 8.37258 3 15 3C21.6274 3 27 8.37258 27 15Z" stroke="url(#paint0_angular_3340_10418)" stroke-width="6" />
                        </g>
                        <defs>
                            <filter id="filter0_i_3340_10418" x="-1" y="0" width="31" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="-1" dy="4" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3340_10418" />
                            </filter>
                            <radialGradient id="paint0_angular_3340_10418" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(159.167 95) rotate(90) scale(15)">
                                <stop stop-color="#4B164C" />
                                <stop offset="0.580224" stop-color="#872889" />
                                <stop offset="1" stop-color="#B034B2" />
                            </radialGradient>
                        </defs>
                    </svg>
                </li> */}
            </ul>
            <div className={styles['last-section']}>
                <div style={{
                    marginTop: '1.5rem',
                    cursor: "pointer"
                }} onClick={() => navigate("/helpsupport")}>
                    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 20.3333V20.325M14 17.8333C14 14.0833 17.5 14.9167 17.5 12C17.5 10.1591 15.933 8.66667 14 8.66667C12.4328 8.66667 11.1062 9.64763 10.6602 11M24.5 14.5C24.5 20.299 19.799 25 14 25C8.20101 25 3.5 20.299 3.5 14.5C3.5 8.70101 8.20101 4 14 4C19.799 4 24.5 8.70101 24.5 14.5Z" stroke="#515151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <div onClick={() => {
                    cookies.deleteCookie("token");
                    cookies.deleteCookie("approval");
                    cookies.deleteCookie("isPremium");
                    window.location.replace("/");
                }}>
                    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.4974 5.16797H20.9974C22.2861 5.16797 23.3307 6.21264 23.3307 7.5013V21.5013C23.3307 22.79 22.2861 23.8346 20.9974 23.8346H17.4974M9.33073 9.83464L4.66406 14.5013M4.66406 14.5013L9.33073 19.168M4.66406 14.5013L18.6641 14.5013" stroke="#515151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
        </aside>
    )
}

function RejectModal({ show, setShow }) {
    return (
        <Modal centered className="selfie-modal" show={show} onHide={() => setShow(false)}>
            <Modal.Body className='selfie-modal-body'>
                Your profile is currently not approved. Please update your profile to access this feature.

                <div>
                    <button type="submit" className='global-save-button' onClick={() => setShow(false)}>
                        Okay
                    </button>
                </div>

            </Modal.Body>
        </Modal>
    )
}



