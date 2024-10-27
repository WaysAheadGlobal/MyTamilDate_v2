import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Image, Modal } from 'react-bootstrap';
import backarrow from "../../../assets/images/backarrow.jpg";
import mastercard from '../../../assets/images/mastercard.png';
import visa from '../../../assets/images/visa-logo.png';
import styles from './billinghistory.module.css';

import { Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import { API_URL } from '../../../api';
import { useCookies } from '../../../hooks/useCookies';
import Sidebar from '../../userflow/components/sidebar/sidebar';

const BillingHistory = () => {
  const [showmodal, setShowModal] = useState(false);
  const handlecCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true);
  const [subscriptions, setSubscriptions] = useState([])
  const cookies = useCookies();
  const [loading, setLoading] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}customer/subscription`, {
          headers: {
            'Authorization': `Bearer ${cookies.getCookie('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          console.log(data)
          setSubscriptions(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })()
  }, []);

  async function handleCancelAutoRenew() {
    try {
      const response = await fetch(`${API_URL}customer/subscription/cancel-auto-renew`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cookies.getCookie('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        handlecCloseModal();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleResumeAutoRenew() {
    try {
      const response = await fetch(`${API_URL}customer/subscription/resume-auto-renew`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cookies.getCookie('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setShowResumeModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Sidebar>
      <div style={{ flex: "1", marginInline: "auto", display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto", width: "100%", paddingInline: "2rem" }}>
        <div style={{
          width: "100%",
        }}>

          <Container className='logo-arrow3'>
            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
            <h1 className='account-setting-heading'>Billing History</h1>
          </Container>

          {
            loading && Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={180} style={{ marginBlock: "20px", borderRadius: "0.75rem" }} />
            ))
          }

          {
            subscriptions.map(subscription => (
              <Container key={subscription.id} style={{
                marginBlock: "20px",
                padding: "1.5rem 1rem",
                cursor: "pointer",
                filter: subscription.status === "active" ? "none" : "grayscale(1)",
              }} className={styles['paymentcard']} onClick={() => {
                if (subscription.status !== "active") {
                  return;
                }
                if (subscription.cancelAtPeriodEnd) {
                  setShowResumeModal(true);
                } else {
                  handleShowModal();
                }
              }}>
                <Container>
                  <p style={{ color: "#6C6C6C", marginBlock: "0.5em", fontWeight: "400" }}>{dayjs(subscription.startDate).format("MMM DD, YYYY")} - {dayjs(subscription.endDate).format("MMM DD, YYYY")} </p>
                  <p style={{ color: "#6C6C6C", marginBlock: "1em", fontSize: "16px", fontWeight: "500" }}>{subscription.name}</p>
                </Container>
                <Container className={styles['paymentbelowcard']}>
                  <Container className={styles['mastercard']} >
                    <div style={{
                      backgroundColor: "white",
                      paddingInline: "10px",
                      borderRadius: "10px",
                    }}>
                      <Image
                        src={subscription.paymentMethod.brand === "visa" ? visa : mastercard}
                        width={40}
                        height={40}
                        style={{
                          objectFit: "contain"
                        }}
                      />
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className={styles['cardNumber']}>
                      <p>***{subscription.paymentMethod.last4}</p>
                    </div>
                    <Container style={{ marginLeft: "10px", marginTop: "17px" }} >
                      <p style={{ display: "flex", fontSize: "24px", color: "#6C6C6C" }}>{subscription.price}
                        <span style={{ fontSize: "14px", color: "#6C6C6C", marginLeft: "10px", marginTop: "10px" }}>{subscription.currency.toUpperCase()}</span>
                      </p>
                    </Container>
                  </Container>
                </Container>
              </Container>
            ))
          }

          <Modal show={showmodal} onHide={handlecCloseModal} centered>
            <Modal.Body className="pause-modal-content">
              <div className="pause-modal-title">Cancel Auto-Renewal on your Subscription?</div>
              <div className="pause-modal-message">
                Your account will not auto-renew and your service will be interrupted on the expiry date. Keep auto-renew for a seamless experience.
              </div>
              <div className="d-flex justify-content-center" style={{
                gap: "30px"
              }}>
                <button variant="outline-danger" className='global-cancel-button' onClick={handleCancelAutoRenew}>
                  Cancel
                </button>
                <button variant="primary" className='global-save-button' onClick={handlecCloseModal}>
                  Keep
                </button>
              </div>
            </Modal.Body>
          </Modal>

          <Modal show={showResumeModal} onHide={() => setShowResumeModal(false)} centered>
            <Modal.Body className="pause-modal-content">
              <div className="pause-modal-title">Turn on Auto-Renewal on your Subscription?</div>
              <div className="pause-modal-message">
                Your account will auto-renew and your service will continue without interruption.</div>
              <div className="d-flex justify-content-center">
                <Button variant="outline-danger" className="btn-no" onClick={() => setShowResumeModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="btn-yes" onClick={handleResumeAutoRenew}>
                  Start
                </Button>
              </div>
            </Modal.Body>
          </Modal>

        </div>
      </div>
    </Sidebar>
  );
}

export default BillingHistory;
