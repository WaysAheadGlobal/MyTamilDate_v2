import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../../../api';
import { useCookies } from '../../../../hooks/useCookies';

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
 * @property {number} job_id - The job ID associated with the user.
 * @property {string} country - The country of the user.
 * @property {string} continent - The continent of the user.
 * @property {string} location_string - The location string of the user.
 * @property {string} job - The job of the user.
 * @property {string} created_at - The creation timestamp of the user record in ISO format.
 * @property {boolean} like - The like status of the user.
 */

/**
 * @typedef {Object} UserProfileContext
 * @property {Profile[]} profiles - The profiles of the users.
 * @property {React.Dispatch<React.SetStateAction<Profile[]>>} setProfiles - The setProfiles function.
 * @property {boolean} loading - The loading status.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setLoading - The setLoading function.
 * @property {number} page - The current page.
 * @property {React.Dispatch<React.SetStateAction<number>>} setPage - The setPage function.
 * @property {number} wave - The current wave.
 * @property {React.Dispatch<React.SetStateAction<number>>} setWave - The setWave function.
 * @property {AbortController} abortController - The abortController.
 * @property {React.Dispatch<React.SetStateAction<AbortController>>} setAbortController - The setAbortController function.
 * @property {number} refresh - The refresh status.
 * @property {React.Dispatch<React.SetStateAction<number>>} setRefresh - The setRefresh function.
 */

/**
 * @type {React.Context<UserProfileContext>}
 */
const UserProfileContext = createContext();

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);

    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }

    return context;
};

export default function UserProfileProvider({ children }) {
    /** 
     * @type {[Profile[], React.Dispatch<React.SetStateAction<Profile[]>>]}
     */
    const [profiles, setProfiles] = useState([]);
    const cookies = useCookies();
    const [wave, setWave] = useState(1);
    const [abortController, setAbortController] = useState(new AbortController());
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [refresh, setRefresh] = useState(1);

    useEffect(() => {
        const storedWave = cookies.getCookie('wave');

        if (storedWave) {
            abortController.abort();
            setAbortController(new AbortController());
            setWave(Number(storedWave));
        }
    }, []);

    useEffect(() => {
        if (!cookies.getCookie('token')) {
            return;
        }
        
        (async () => {
            setLoading(true);

            const response = await fetch(`${API_URL}customer/user/profiles?page=${page}&wave=${wave}`, {
                headers: {
                    'Authorization': `Bearer ${cookies.getCookie('token')}`,
                },
                signal: abortController.signal
            });
            const data = await response.json();
            if (!data) return;
            console.log(data)

            if (response.ok) {
                if (data.length === 0 && wave < 3) {
                    setWave(wave + 1);
                    cookies.setCookie('wave', wave + 1);
                }
                setProfiles(data);
            }

            setLoading(false);
        })()
    }, [refresh]);

    useEffect(() => {
        if (!cookies.getCookie('token')) {
            return;
        }
        
        (async () => {
            setLoading(true);

            const response = await fetch(`${API_URL}customer/user/profiles?page=${page}&wave=${wave}`, {
                headers: {
                    'Authorization': `Bearer ${cookies.getCookie('token')}`,
                },
                signal: abortController.signal
            });
            const data = await response.json();
            if (!data) return;
            console.log(data)

            if (response.ok) {
                if (data.length === 0 && wave < 3) {
                    setWave(wave + 1);
                    cookies.setCookie('wave', wave + 1);
                }
                setProfiles([...profiles, ...data]);
            }

            setLoading(false);
        })()
    }, [page, wave]);

    const value = useMemo(() => ({
        profiles,
        setProfiles,
        loading,
        setLoading,
        page,
        setPage,
        wave,
        setWave,
        abortController,
        setAbortController,
        refresh,
        setRefresh
    }), [
        profiles,
        setProfiles,
        loading,
        setLoading,
        page,
        setPage,
        wave,
        setWave,
        abortController,
        setAbortController,
        refresh,
        setRefresh
    ]);

    return (
        <UserProfileContext.Provider value={value}>
            {children}
        </UserProfileContext.Provider>
    )
}
