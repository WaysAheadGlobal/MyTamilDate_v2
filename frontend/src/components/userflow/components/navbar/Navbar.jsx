import React, { useEffect, useState } from 'react';
import styles from './navbar.module.css';
import heartLogo from "../../../../assets/images/heart-logo.png";
import profile from "../../../../assets/images/basic-details.png";
import { useNavigate } from 'react-router-dom';
import { useCookies } from '../../../../hooks/useCookies';
import { API_URL } from '../../../../api';

export default function Navbar({ style }) {
    const [isMobile, setIsMobile] = React.useState(false);
    const[Rejected, setRejected] = useState (false);
    const cookies = useCookies();
   
    const navigate = useNavigate();
    const [pathname, setPathname] = React.useState([]);
    const suffix = pathname.at(-1);
    const [Profile, setProfileData] = useState({});
    const { getCookie } = useCookies();
    const Navigate = useNavigate();
    const id = getCookie('userId')
    const OldImageURL = 'https://data.mytamildate.com/storage/public/uploads/user';
    const [images, setImages] = useState({
        main: null,
        first: null,
        second: null,
    });

    const [images2, setImages2] = useState({
        main: null,
        first: null,
        second: null,
    });

    const ImageURL = async () => {
        try {
            const response = await fetch(`${API_URL}/customer/update/media`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            });
            const data = await response.json();
            console.log("datadaa", data);
            if (response.ok) {
                if (data[0].type === 31 || data[1].type === 31 || data[2].type === 31) {
                    const others = data.filter(image => image.type === 32);
                    const main = data.filter(image => image.type === 31)[0];

                    setImages2({
                        main: API_URL + "media/avatar/" + main.hash + "." + (main.extension === "png" ? "jpg" : main.extension),
                        first: API_URL + "media/avatar/" + others[0].hash + "." + (others[0].extension === "png" ? "jpg" : others[0].extension),
                        second: API_URL + "media/avatar/" + others[1].hash + "." + (others[1].extension === "png" ? "jpg" : others[1].extension),
                    })
                }
                else {
                    const others = data.filter(image => image.type === 2);
                    const main = data.filter(image => image.type === 1)[0];
                    console.log(others, main)
                    setImages2({
                        main: OldImageURL + "/" + id + "/avatar/" + main.hash + "-large" + "." + (main.extension === "png" ? "jpg" : main.extension),
                        first: OldImageURL + "/" + id + "/photo/" + others[0].hash + "-large" + "." + (others[0].extension === "png" ? "jpg" : others[0].extension),
                        second: OldImageURL + "/" + id + "/photo/" + others[1].hash + "-large" + "." + (others[1].extension === "png" ? "jpg" : others[1].extension),
                    })
                }
            }
        } catch (error) {
            console.error('Error saving images:', error);
        }
    }
    useEffect(()=>{
        ImageURL();
    },[

    ])

    React.useEffect(() => {
        setPathname(window.location.pathname.split("/"));
    }, []);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    React.useEffect(() => {
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


            // if (result.approval === "PENDING") {
            //     setRejected(true);
            //     return;
            // }
                
            // if (result.approval === "REJECTED") {
            //     setRejected(true);
            //     // window.location.replace("/updateprofile")
            // }

        })()
    }, [pathname])

    return (
        <nav className={styles.nav} style={style}>
            <ul>
                <li className={pathname.includes("chat") ? styles["active"] : ""} onClick={() => !Rejected && navigate("/user/chat")}>
                    {
                        !pathname.includes("chat") ? (
                            <svg width="32" height="31" viewBox="0 0 32 31" fill="blue" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.8812 4.10547C9.75718 4.10547 4.78147 9.08118 4.78147 15.2052C4.78147 16.9963 5.23959 18.7501 6.06803 20.3353L4.79509 25.6834C4.77502 25.7673 4.7768 25.8549 4.80028 25.938C4.82375 26.021 4.86813 26.0966 4.92917 26.1576C4.99021 26.2186 5.06588 26.2629 5.14893 26.2863C5.23198 26.3097 5.31965 26.3115 5.40356 26.2913L10.7516 25.0184C12.3364 25.8468 14.0901 26.3049 15.8812 26.3049C22.0047 26.3049 26.9809 21.3297 26.9809 15.2052C26.9809 9.08067 22.0057 4.10547 15.8812 4.10547ZM15.8812 5.11454C21.4603 5.11454 25.9719 9.62658 25.9719 15.2052C25.9719 20.7838 21.4598 25.2959 15.8812 25.2959C14.1834 25.2959 12.5124 24.867 11.0241 24.0497C10.9143 23.9895 10.7861 23.9722 10.6643 24.0012L5.96712 25.1193L7.08517 20.4221C7.11436 20.3004 7.09728 20.1722 7.03724 20.0623C6.21967 18.574 5.79087 16.9033 5.79054 15.2052C5.79054 9.62607 10.3026 5.11454 15.8812 5.11454Z" fill="#424242" />
                                <path d="M10.8261 13.6914C9.99614 13.6914 9.3125 14.375 9.3125 15.205C9.3125 16.035 9.99614 16.7186 10.8261 16.7186C11.6561 16.7186 12.3397 16.035 12.3397 15.205C12.3397 14.375 11.6561 13.6914 10.8261 13.6914ZM10.8261 14.7005C11.1107 14.7005 11.3306 14.9204 11.3306 15.205C11.3306 15.4896 11.1107 15.7095 10.8261 15.7095C10.5415 15.7095 10.3216 15.4896 10.3216 15.205C10.3216 14.9204 10.5415 14.7005 10.8261 14.7005ZM15.8714 13.6914C15.0415 13.6914 14.3578 14.375 14.3578 15.205C14.3578 16.035 15.0415 16.7186 15.8714 16.7186C16.7014 16.7186 17.385 16.035 17.385 15.205C17.385 14.375 16.7014 13.6914 15.8714 13.6914ZM15.8714 14.7005C16.156 14.7005 16.376 14.9204 16.376 15.205C16.376 15.4896 16.156 15.7095 15.8714 15.7095C15.5869 15.7095 15.3669 15.4896 15.3669 15.205C15.3669 14.9204 15.5869 14.7005 15.8714 14.7005ZM20.9168 13.6914C20.0868 13.6914 19.4032 14.375 19.4032 15.205C19.4032 16.035 20.0868 16.7186 20.9168 16.7186C21.7467 16.7186 22.4304 16.035 22.4304 15.205C22.4304 14.375 21.7467 13.6914 20.9168 13.6914ZM20.9168 14.7005C21.2013 14.7005 21.4213 14.9204 21.4213 15.205C21.4213 15.4896 21.2013 15.7095 20.9168 15.7095C20.6322 15.7095 20.4122 15.4896 20.4122 15.205C20.4122 14.9204 20.6322 14.7005 20.9168 14.7005Z" fill="#424242" />
                            </svg>
                        ) : (
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.9992 4.26562C9.52559 4.26562 4.26586 9.52536 4.26586 15.999C4.26586 17.8923 4.75012 19.7462 5.62586 21.4219L4.28026 27.0752C4.25904 27.1639 4.26093 27.2566 4.28574 27.3444C4.31055 27.4322 4.35747 27.5121 4.42199 27.5766C4.48652 27.641 4.5665 27.6879 4.65429 27.7126C4.74209 27.7374 4.83476 27.7392 4.92346 27.7179L10.5768 26.3723C12.252 27.248 14.1059 27.7323 15.9992 27.7323C22.4723 27.7323 27.7325 22.4731 27.7325 15.999C27.7325 9.52483 22.4733 4.26562 15.9992 4.26562ZM15.9992 5.33229C21.8968 5.33229 26.6659 10.1019 26.6659 15.999C26.6659 21.896 21.8963 26.6656 15.9992 26.6656C14.2045 26.6656 12.4381 26.2123 10.8648 25.3483C10.7488 25.2846 10.6132 25.2664 10.4845 25.2971L5.51919 26.479L6.70106 21.5136C6.73192 21.385 6.71386 21.2494 6.65039 21.1334C5.78615 19.56 5.33287 17.794 5.33252 15.999C5.33252 10.1014 10.1021 5.33229 15.9992 5.33229Z" fill="url(#paint0_linear_1382_8008)" />
                                <path d="M15.9992 5.33229C21.8968 5.33229 26.6659 10.1019 26.6659 15.999C26.6659 21.896 21.8963 26.6656 15.9992 26.6656C14.2045 26.6656 12.4381 26.2123 10.8648 25.3483C10.7488 25.2846 10.6132 25.2664 10.4845 25.2971L5.51919 26.479L6.70106 21.5136C6.73192 21.385 6.71386 21.2494 6.65039 21.1334C5.78615 19.56 5.33287 17.794 5.33252 15.999C5.33252 10.1014 10.1021 5.33229 15.9992 5.33229Z" fill="url(#paint1_linear_1382_8008)" />
                                <path d="M10.6664 14.3984C9.78907 14.3984 9.06641 15.1211 9.06641 15.9984C9.06641 16.8758 9.78907 17.5984 10.6664 17.5984C11.5437 17.5984 12.2664 16.8758 12.2664 15.9984C12.2664 15.1211 11.5437 14.3984 10.6664 14.3984ZM10.6664 15.4651C10.9672 15.4651 11.1997 15.6976 11.1997 15.9984C11.1997 16.2992 10.9672 16.5318 10.6664 16.5318C10.3656 16.5318 10.1331 16.2992 10.1331 15.9984C10.1331 15.6976 10.3656 15.4651 10.6664 15.4651ZM15.9997 14.3984C15.1224 14.3984 14.3997 15.1211 14.3997 15.9984C14.3997 16.8758 15.1224 17.5984 15.9997 17.5984C16.8771 17.5984 17.5997 16.8758 17.5997 15.9984C17.5997 15.1211 16.8771 14.3984 15.9997 14.3984ZM15.9997 15.4651C16.3005 15.4651 16.5331 15.6976 16.5331 15.9984C16.5331 16.2992 16.3005 16.5318 15.9997 16.5318C15.6989 16.5318 15.4664 16.2992 15.4664 15.9984C15.4664 15.6976 15.6989 15.4651 15.9997 15.4651ZM21.3331 14.3984C20.4557 14.3984 19.7331 15.1211 19.7331 15.9984C19.7331 16.8758 20.4557 17.5984 21.3331 17.5984C22.2104 17.5984 22.9331 16.8758 22.9331 15.9984C22.9331 15.1211 22.2104 14.3984 21.3331 14.3984ZM21.3331 15.4651C21.6339 15.4651 21.8664 15.6976 21.8664 15.9984C21.8664 16.2992 21.6339 16.5318 21.3331 16.5318C21.0323 16.5318 20.7997 16.2992 20.7997 15.9984C20.7997 15.6976 21.0323 15.4651 21.3331 15.4651Z" fill="white" />
                                <path d="M10.6664 15.4651C10.9672 15.4651 11.1997 15.6976 11.1997 15.9984C11.1997 16.2992 10.9672 16.5318 10.6664 16.5318C10.3656 16.5318 10.1331 16.2992 10.1331 15.9984C10.1331 15.6976 10.3656 15.4651 10.6664 15.4651Z" fill="white" />
                                <path d="M15.9997 15.4651C16.3005 15.4651 16.5331 15.6976 16.5331 15.9984C16.5331 16.2992 16.3005 16.5318 15.9997 16.5318C15.6989 16.5318 15.4664 16.2992 15.4664 15.9984C15.4664 15.6976 15.6989 15.4651 15.9997 15.4651Z" fill="white" />
                                <path d="M21.3331 15.4651C21.6339 15.4651 21.8664 15.6976 21.8664 15.9984C21.8664 16.2992 21.6339 16.5318 21.3331 16.5318C21.0323 16.5318 20.7997 16.2992 20.7997 15.9984C20.7997 15.6976 21.0323 15.4651 21.3331 15.4651Z" fill="white" />
                                <defs>
                                    <linearGradient id="paint0_linear_1382_8008" x1="16.9437" y1="3.28783" x2="16.9437" y2="30.1771" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#FC8C66" />
                                        <stop offset="1" stop-color="#F76A7B" />
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_1382_8008" x1="16.9437" y1="3.28783" x2="16.9437" y2="30.1771" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#FC8C66" />
                                        <stop offset="1" stop-color="#F76A7B" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        )
                    }
                    <div className={styles['indicator']}></div>
                </li>
                <li className={suffix === "home" ? styles["active"] : ""} onClick={() => !Rejected  && navigate("/user/home")}>
                    <img src={heartLogo} alt="" width={30} height={30} />
                    <div className={styles['indicator']}></div>
                </li>
                <li className={suffix === "account" ? styles["active"] : ""} onClick={() => navigate("/updateprofile")}>
                    <img style={{borderRadius : "50%"}} src={images2.main ? images2.main : profile} alt="" width={30} height={30} />
                    <div className={styles['indicator']}></div>
                </li>
                {/* {
                    isMobile && (
                        <>
                            <li>
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.5 3H13.5C14.0523 3 14.5 3.44772 14.5 4V4.56879C14.5 4.99659 14.7871 5.36825 15.1822 5.53228C15.5775 5.69638 16.0377 5.63384 16.3403 5.33123L16.7426 4.92891C17.1331 4.53838 17.7663 4.53838 18.1568 4.92891L19.571 6.34312C19.9616 6.73365 19.9615 7.36681 19.571 7.75734L19.1688 8.1596C18.8661 8.46223 18.8036 8.92247 18.9677 9.31774C19.1317 9.71287 19.5034 10 19.9313 10L20.5 10C21.0523 10 21.5 10.4477 21.5 11V13C21.5 13.5523 21.0523 14 20.5 14H19.9312C19.5034 14 19.1318 14.2871 18.9677 14.6822C18.8036 15.0775 18.8661 15.5377 19.1688 15.8403L19.571 16.2426C19.9616 16.6331 19.9616 17.2663 19.571 17.6568L18.1568 19.071C17.7663 19.4616 17.1331 19.4616 16.7426 19.071L16.3403 18.6688C16.0377 18.3661 15.5775 18.3036 15.1822 18.4677C14.7871 18.6318 14.5 19.0034 14.5 19.4312V20C14.5 20.5523 14.0523 21 13.5 21H11.5C10.9477 21 10.5 20.5523 10.5 20V19.4313C10.5 19.0034 10.2129 18.6317 9.81774 18.4677C9.42247 18.3036 8.96223 18.3661 8.6596 18.6688L8.25732 19.071C7.86679 19.4616 7.23363 19.4616 6.84311 19.071L5.42889 17.6568C5.03837 17.2663 5.03837 16.6331 5.42889 16.2426L5.83123 15.8403C6.13384 15.5377 6.19638 15.0775 6.03228 14.6822C5.86825 14.2871 5.49659 14 5.06879 14H4.5C3.94772 14 3.5 13.5523 3.5 13V11C3.5 10.4477 3.94772 10 4.5 10L5.06877 10C5.49658 10 5.86825 9.71288 6.03229 9.31776C6.1964 8.9225 6.13386 8.46229 5.83123 8.15966L5.42891 7.75734C5.03838 7.36681 5.03838 6.73365 5.42891 6.34313L6.84312 4.92891C7.23365 4.53839 7.86681 4.53839 8.25734 4.92891L8.65966 5.33123C8.96228 5.63386 9.4225 5.6964 9.81776 5.53229C10.2129 5.36825 10.5 4.99658 10.5 4.56876V4C10.5 3.44772 10.9477 3 11.5 3Z" stroke="#424242" />
                                    <path d="M14.5 12C14.5 13.1046 13.6046 14 12.5 14C11.3954 14 10.5 13.1046 10.5 12C10.5 10.8954 11.3954 10 12.5 10C13.6046 10 14.5 10.8954 14.5 12Z" stroke="#424242" />
                                </svg>
                                <div className={styles['indicator']}></div>
                            </li>
                            <li>
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 4H18.5C19.6046 4 20.5 4.89543 20.5 6L20.5 18C20.5 19.1046 19.6046 20 18.5 20H15.5M11.5 16L15.5 12M15.5 12L11.5 8M15.5 12H3.5" stroke="#424242" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <div className={styles['indicator']}></div>
                            </li>
                        </>
                    )
                } */}
            </ul>
        </nav>
    )
}
