import React, { useEffect, useState } from 'react'
import ChatBox from '../../components/chat-box/ChatBox'
import ChatNav from '../../components/chat-nav/ChatNav'
import Likes from '../../components/likes/Likes'
import Matches from '../../components/matches/Matches'
import Navbar from '../../components/navbar/Navbar'
import Others from '../../components/others/Others'
import Requests from '../../components/requests/Requests'
import { MobileSidebar } from '../../components/sidebar/sidebar'
import styles from './chat.module.css'

export default function Chat() {
    const pathname = window.location.pathname.split("/");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        window.onresize = () => {
            setIsMobile(window.innerWidth < 768);
        }
    }, []);

    return (
        <section className={[styles.chatLayout, "chat"].join(" ")}>
            <MobileSidebar />
            <div className={[styles.matchContainer, styles.matchBox].join(" ")} style={{ position: "relative" }}>
                <ChatNav />
                {
                    pathname.includes("likes") && <Likes />
                }
                {
                    pathname.includes("requests") && <Requests />
                }
                {
                    pathname.includes("others") && <Others />
                }
                {
                    !(
                        pathname.includes("likes") ||
                        pathname.includes("requests") ||
                        pathname.includes("others")
                    ) && <Matches />
                }
                <div style={{ marginTop: "auto" }}></div>
                {
                    isMobile && <Navbar style={{
                        width: "100%",
                        maxWidth: "100%",
                    }} />
                }
            </div>
           
            <ChatBox className={styles.chatBox} />
        </section>
    )
}

