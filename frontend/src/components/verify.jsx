import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL, WEB_URL } from '../api';
import logo from '../assets/images/logo2.png';

export default function Verify() {
    const { token } = useParams();
    const [verified, setVerified] = React.useState(false);
    const [error, setError] = React.useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}user/verify/${token}`);
                const result = await response.json();

                if (response.ok) {
                    setVerified(true);
                } else {
                    setVerified(false);
                    setError(result.message);
                    console.error('Error fetching user data:', result.message);
                }
            } catch (error) {
                setVerified(false);
                setError('An error occurred while verifying your email address. Please try again later.');
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        if (verified) {
            setTimeout(() => {
                window.location.href = `${WEB_URL}user/home`;
            }, 1000);
        }
    }, [verified]);

    return (
        <div style={{
            position: "relative",
            fontFamily: "Poppins, sans-serif",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            gap: "1rem",
            fontWeight: 600,
            fontSize: "1rem",
            textAlign: "center",
            padding: "1rem",
        }}>
            <img src={logo} alt="logo" style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                width: "150px",
            }} />

            {verified && <p>Your email has been verified.</p>}

            {!verified && error && <p>{error}</p>}

            {!verified && !error && (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                            <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
                        </path>
                    </svg>
                    <p>
                        Verifying your email address. Please wait...
                    </p>
                </>
            )}
        </div>
    );
}
