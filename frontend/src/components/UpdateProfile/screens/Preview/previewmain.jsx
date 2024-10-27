import React, { useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../../../api';
import { useCookies } from "../../../../hooks/useCookies";

import styles from './style.module.css';
import dayjs from 'dayjs';
import Card from './card';
import Sidebar from '../../../userflow/components/sidebar/sidebar';

export default function ProfileDetailsPreview() {
    const params = useParams();
    const dialogRef = React.useRef(null);
    const navigate = useNavigate();
    const cookies = useCookies();
    const [loading, setLoading] = React.useState(false);

    // const getPhotoUrl = (userId, hash, extension, type) => `https://data.mytamildate.com/storage/public/uploads/user/${userId}/${type === 1 ? "avatar" : "photo"}/${hash}-large.${extension}`;

    const getPhotoUrl = (userId, hash, extension, type) => {
        
        const ext = extension === "png" ? "jpg" : extension;
      
        return type === 1 
          ? `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${ext}` 
          : `${API_URL}media/avatar/${hash}.${ext}`;
      };
    /**
     * @typedef {Object} Photo
     * @property {number} id - The unique identifier for the photo.
     * @property {string} hash - The hash value of the photo.
     * @property {string} extension - The file extension of the photo.
     * @property {number} type - The type/category of the photo.
     */

    /**
     * @typedef {Object} Answers
     * @property {number} id - The unique identifier for the answer.
     * @property {string} question - The question.
     * @property {string} answer - The answer. 
     */

    /**
     * @typedef {Object} Profile
     * @property {number} id - The unique identifier for the user.
     * @property {number} user_id - The user's ID.
     * @property {string} first_name - The user's first name.
     * @property {string} last_name - The user's last name.
     * @property {string} birthday - The user's date of birth in ISO 8601 format.
     * @property {number} location_id - The unique identifier for the user's location.
     * @property {number} job_id - The unique identifier for the user's job.
     * @property {string} created_at - The date and time when the user was created in ISO 8601 format.
     * @property {string} country - The country where the user resides.
     * @property {string} continent - The continent where the user resides.
     * @property {string} location_string - The string representation of the user's location.
     * @property {string} job - The user's job title.
     * @property {string} religion - The user's religion.
     * @property {string} study - The user's level of study.
     * @property {string} height - The user's height.
     * @property {string} kids - The user's stance on having children.
     * @property {Photo[]} photos - An array of photos associated with the user.
     * @property {string[]} personalities - An array of personalities associated with the user.
     * @property {Answers[]} answers - An array of answers associated with the user.
     * @property {string} smoke - The user's stance on smoking.
     * @property {string} drink - The user's stance on drinking.
     */

    /** @type {[Profile, React.Dispatch<React.SetStateAction<Profile>>]} */
    const [profile, setProfile] = React.useState({});
    const [media, setMedia] = React.useState([]);
    const userId = cookies.getCookie("userId")
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}customer/user/profile/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${cookies.getCookie('token')}`,
                    },
                });
                const data = await response.json();
                if (!data) return;

                if (response.ok) {
                    console.log(data)
                    setProfile(data);
                    setMedia(data.photos.map(photo => {
                        if (photo.type === 1 || photo.type === 2) {
                            return {
                                type: photo.type,
                                url: getPhotoUrl(data.user_id, photo.hash, photo.extension, photo.type),
                            };
                        } else {
                            return {
                                type: photo.type,
                                url: `${API_URL}media/avatar/${photo.hash}.${photo.extension}`
                            };
                        }
                    }).sort((a, b) => a.type - b.type));
                    console.log(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })()
    }, [window.location.pathname]);

    return (
       
            <div
                className={styles.container}
            >
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Card {...profile} show />
                )}
            </div>
        
    )
}
