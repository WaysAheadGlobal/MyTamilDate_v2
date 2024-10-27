import React, { useEffect, useState } from 'react';
import Card from '../components/card/Card';
import { useUserProfile } from '../components/context/UserProfileContext';
import Sidebar from '../components/sidebar/sidebar';
import styles from './home.module.css';
import { useCookies } from '../../../hooks/useCookies';
import { API_URL } from '../../../api';
import AccountPending from '../../AccountPending';
import AccountNotApproved from '../../AccountNotApproved';
import { Modal } from 'react-bootstrap';

export default function Home() {
    const [approval, setapproval] = useState("")
    const [approvalloading, setApprovalloading] = useState(false)
    const[showUpdateReject, setShowUpdateReject]= useState(false);
    const[rejectreason, setRejectReason] = useState("");

    const { getCookie } = useCookies();
    const userId = getCookie("userId")
    const HideshowUpdateReject = ()=> setShowUpdateReject(false);


     // Function to handle fetching the latest rejection reason
     const fetchRejectionReason = async () => {
        try {
            const response = await fetch(`${API_URL}/customer/users/UpdateRejectReason`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            });

            const result = await response.json();
            if (response.ok && result.reason) {  // Check 
                setRejectReason(result.reason);
                setShowUpdateReject(true); // Show the modal when reason is fetched
            } else {
                console.error('Error fetching rejection reason:', result.message);
            }
        } catch (error) {
            console.error('Error fetching rejection reason:', error);
        }
    };
    // Function to handle deleting the rejection reason
const handleFinalDelete = async () => {
    try {
        const response = await fetch(`${API_URL}/customer/users/deleteLatestRejectReason`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`,
                'Content-Type': 'application/json' // Adding content type for completeness
            }
        });

        if (response.ok) {
            setShowUpdateReject(false); // Close the modal after deletion
            setRejectReason(""); // Clear the rejection reason from state
            window.location.reload();
        } else {
            const result = await response.json();
            console.error('Error deleting rejection reason:', result.message || 'An unknown error occurred');
        }
    } catch (error) {
        console.error('Error deleting rejection reason:', error);
    }
};


    const {
        profiles,
        setProfiles,
        abortController,
        setAbortController,
        wave,
        setWave,
        page,
        setPage,
        loading,
        setLoading
    } = useUserProfile();

    useEffect(() => {
        if (profiles.length === 0) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.target.classList.contains('show')) return;

                entry.target.classList.toggle('show', entry.isIntersecting);
                if (entry.isIntersecting) observer.unobserve(entry.target);
            })
        }, {
            threshold: 0.2,
            root: document.querySelector('.children')
        });
        const cards = document.querySelectorAll('.card-container');
        cards.forEach(card => {
            observer.observe(card);
        });

        return () => {
            observer.disconnect()
        };
    }, [profiles]);



    useEffect(() => {
        const fetchData = async () => {
            setApprovalloading(true)
            try {
                const response = await fetch(`${API_URL}/customer/users/approval/${userId}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${getCookie('token')}`
                    }
                });

                const result = await response.json();
                if (response.ok) {
                    setapproval(result.approval)
                    console.log(approval)
                    
                    if (result.approval === 20) {
                        fetchRejectionReason(); // Fetch rejection reason if approval is 20
                    }
                    setApprovalloading(false)
                } else {
                    console.error('Error fetching user data:', result.message);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    
    if (approvalloading) {
        return (
            <Sidebar>
              <div style={{
                flex: "1",
                marginInline: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
                marginTop: "-30px",
                width: "100%",
                paddingInline: "1rem",
            }}>
                
            <p style={
                {
                    marginTop : "40px"
                }
            }>Loading...</p>
                </div>
                </Sidebar>  
      )}

    /* useEffect(() => {
        if (profiles.length === 0) return;

        const lastCardObserver = new IntersectionObserver(entries => {
            const lastCard = entries[0];

            if (!lastCard.isIntersecting) return;

            setPage(page + 1);
        });
        lastCardObserver.observe(Array(...document.querySelectorAll('.card-container')).at(-1));
        return () => {
            lastCardObserver.disconnect()
        };
    }, [profiles])
 */
    return (
        <Sidebar>

            {approval === 10 && (
                <div>
                  
                    <AccountPending/>
                </div>
            )}

            {approval === 30 && (
                <div>
                    <AccountNotApproved/>
                </div>
            )}
            
            {(approval === 20) && (
        <div
        className={styles.container}
    >
        {
            profiles.slice(0, 1).map((profile) => (
                <Card key={profile.user_id} {...profile} setPage={setPage} />
            ))
        }
        {
            loading && <p style={{ textAlign: "center" }}>Loading...</p>
        }
    </div>
      )}

<Modal show={showUpdateReject} onHide={handleFinalDelete} centered>

<Modal.Body className="pause-modal-content">

    <div className="pause-modal-title">Your Update Needs Attention</div>
    <div className="pause-modal-message">
        {rejectreason}
    </div>
    <div className="d-flex justify-content-center" style={{
        gap : "30px"
    }}>
        <button  className="global-save-button" onClick={handleFinalDelete}>
            Okay
        </button>
    </div>
</Modal.Body>
</Modal>
            
        </Sidebar>
    )
}

