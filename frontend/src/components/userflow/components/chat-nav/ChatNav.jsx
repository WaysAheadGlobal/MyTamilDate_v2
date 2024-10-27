import React from 'react'
import styles from "./styles.module.css"
import { useNavigate } from 'react-router-dom';

export default function ChatNav() {
    const navigate = useNavigate();
    const pathname = window.location.pathname;

    return (
        <div className={styles.nav}>
            <ul>
                <li className={!(
                    pathname.includes("likes") ||
                    pathname.includes("requests") ||
                    pathname.includes("others")
                ) ? styles.active : ""} onClick={() => navigate("/user/chat")}>Matches</li>
                <li className={pathname.includes("likes") ? styles.active : ""} onClick={() => navigate("/user/chat/likes")}>Likes</li>
                <li className={pathname.includes("requests") ? styles.active : ""} onClick={() => navigate("/user/chat/requests")}>Requests</li>
                <li className={pathname.includes("others") ? styles.active : ""} onClick={() => navigate("/user/chat/others")}>Other</li>
            </ul>
        </div>
    )
}
