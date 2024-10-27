import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { API_URL } from '../../api';
import { useAlert } from '../../Context/AlertModalContext';
import { useCookies } from '../../hooks/useCookies';
import Sidebar from '../userflow/components/sidebar/sidebar';
import './unsubscribeEmail.css';


const UnsubscribeComponent = () => {
    const cookies = useCookies();
    const [unsubscribe, setUnsubscribe] = useState([]);
    const alert = useAlert();

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}customer/unsubscribe`, {
                headers: {
                    'Authorization': `Bearer ${cookies.getCookie('token')}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUnsubscribe(data);
            }
        })()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const response = await fetch(`${API_URL}customer/unsubscribe`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cookies.getCookie('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ unsubscribe: formData.getAll('unsubscribe') })
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            alert.setModal({
                show: true,
                title: 'Unsubscribe',
                message: 'You have successfully unsubscribed from the selected email types.',
            });
        } else {
            console.log(data);
        }
    }

    return (
        <Sidebar>
            <div style={{
                flex: "1",
                marginInline: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
            }}>

                <div className='un-subscribe-container'>
                    <Container>
                        <div className="unsubscribe-container">
                            <div className="unsubscribe-title">
                                Please select the e-mails you'd like to turn off
                            </div>
                            <div className="unsubscribe-subtitle">
                                Manage your email settings on myTamilDate. Pick what types of email you want to receive and their frequency.
                            </div>
                            <Form onSubmit={handleSubmit}>
                                <div className="unsubscribe-options">
                                    <Form.Check
                                        type="checkbox"
                                        label="Likes unsubscribe"
                                        name="unsubscribe"
                                        id="unsubscribe1"
                                        className="unsubscribe-option"
                                        value={4} // This value map to the db table dncs_unsubscribe_groups id column
                                        checked={unsubscribe.includes(4)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUnsubscribe([...unsubscribe, 4]);
                                            } else {
                                                setUnsubscribe(unsubscribe.filter(item => item !== 4));
                                            }
                                        }}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Matches unsubscribe"
                                        name="unsubscribe"
                                        id="unsubscribe2"
                                        className="unsubscribe-option"
                                        value={5} // This value map to the db table dncs_unsubscribe_groups id column
                                        checked={unsubscribe.includes(5)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUnsubscribe([...unsubscribe, 5]);
                                            } else {
                                                setUnsubscribe(unsubscribe.filter(item => item !== 5));
                                            }
                                        }}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Messages unsubscribe"
                                        name="unsubscribe"
                                        id="unsubscribe3"
                                        className="unsubscribe-option"
                                        value={6} // This value map to the db table dncs_unsubscribe_groups id column
                                        checked={unsubscribe.includes(6)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUnsubscribe([...unsubscribe, 6]);
                                            } else {
                                                setUnsubscribe(unsubscribe.filter(item => item !== 6));
                                            }
                                        }}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Weekly summaries unsubscribe"
                                        name="unsubscribe"
                                        id="unsubscribe4"
                                        className="unsubscribe-option"
                                        value={7} // This value map to the db table dncs_unsubscribe_groups id column
                                        checked={unsubscribe.includes(7)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUnsubscribe([...unsubscribe, 7]);
                                            } else {
                                                setUnsubscribe(unsubscribe.filter(item => item !== 7));
                                            }
                                        }}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Special offers and promotions"
                                        name="unsubscribe"
                                        id="unsubscribe5"
                                        className="unsubscribe-option"
                                        value={8}  // This value map to the db table dncs_unsubscribe_groups id column
                                        checked={unsubscribe.includes(8)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUnsubscribe([...unsubscribe, 8]);
                                            } else {
                                                setUnsubscribe(unsubscribe.filter(item => item !== 8));
                                            }
                                        }}
                                    />
                                </div>
                                <div className="unsubscribe-note">
                                    Please note that if your MTD account is active, you may still receive important maintenance, admin & legal email notifications from us to keep you informed.
                                </div>
                                <Button type='submit' variant="primary" className="btn-unsubscribe">
                                    Unsubscribe
                                </Button>
                            </Form>
                        </div>
                    </Container>
                </div>
            </div>
        </Sidebar>
    );
};

export default UnsubscribeComponent;
