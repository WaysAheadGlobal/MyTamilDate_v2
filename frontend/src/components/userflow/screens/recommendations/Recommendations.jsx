import dayjs from 'dayjs';
import React from 'react';
import { API_URL } from '../../../../api';
import { useUserProfile } from '../../components/context/UserProfileContext';
import Sidebar from '../../components/sidebar/sidebar';
import styles from "./recommendations.module.css";
import { useNavigate } from 'react-router-dom';

export default function Recommendations() {
    const { profiles } = useUserProfile();
    const navigate = useNavigate();

    const getImageURL = (type, hash, extension, userId) => {
        
        const ext = extension === "png" ? "jpg" : extension;
      
        return type === 1 
          ? `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${ext}` 
          : `${API_URL}media/avatar/${hash}.${ext}`;
      };
      
    return (
        <Sidebar>
            <div className={styles["children"]}>
                <div className={styles['recommendations']}>
                    <div
                        style={{
                            gridColumn: "1 / -1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "1rem",
                        }}
                    >
                        <p style={{ fontWeight: "600", fontSize: "large" }}>Recommendations</p>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => navigate("/user/preferences")} style={{ cursor: "pointer" }}>
                            <path d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z" stroke="#5E5E5E" stroke-width="1.5" stroke-linecap="round" />
                        </svg>
                    </div>
                    {
                        profiles.map(profile => (
                            <div key={profile.user_id} className={styles["recommended-card"]} style={{
                                backgroundImage: `url(${getImageURL(profile.type, profile.hash, profile.extension, profile.user_id)})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                cursor: "pointer",
                            }} onClick={() => navigate(`/user/${profile.first_name}/${profile.user_id}`)}>
                                <div>
                                    <p style={{ fontWeight: "600", fontSize: "large" }}>{profile.first_name} , {dayjs().diff(profile.birthday, 'year')}</p>
                                    <p>{profile.job}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Sidebar>
    )
}
