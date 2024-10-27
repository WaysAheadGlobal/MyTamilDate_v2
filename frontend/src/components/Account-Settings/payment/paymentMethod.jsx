import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Image, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../api';
import backarrow from "../../../assets/images/backarrow.jpg";
import mastercard from '../../../assets/images/mastercard.png';
import americanexpress from '../../../assets/images/american-express.png';
import paymentcarddelete from '../../../assets/images/deleteicon.png';
import visa from '../../../assets/images/visa-logo.png';
import { useCookies } from '../../../hooks/useCookies';
import Sidebar from '../../userflow/components/sidebar/sidebar';
import styles from './paymentMethod.module.css';
import update from '../../../assets/images/update.png';

const PaymentMethod = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);  // New state to track selected payment method
  const cookies = useCookies();

  const handleShow = (paymentMethodId) => {
    setSelectedPaymentMethodId(paymentMethodId);
    setShow(true);
  };
  const handleClose = () => setShow(false);
  const handleShowDelete = (paymentMethodId) => {
    setSelectedPaymentMethodId(paymentMethodId);
    setShowDelete(true);
  };
  const handleCloseDelete = () => setShowDelete(false);

  const getPaymentMethod = async () => {
    try {
      const response = await fetch(`${API_URL}customer/payment/methods`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.getCookie('token')}`,
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPaymentMethods(data);
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPaymentMethod();
  }, []);

  const handleDeletePaymentMethod = async () => {
    if (!selectedPaymentMethodId) return;
    const response = await fetch(`${API_URL}customer/payment/methods/${selectedPaymentMethodId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.getCookie('token')}`,
      }
    });

    if (response.ok) {
      // Update the state by filtering out the deleted payment method
      setPaymentMethods(paymentMethods.filter(method => method.id !== selectedPaymentMethodId));
      handleCloseDelete();
    } else {
      console.error("Failed to delete the payment method");
    }
  };

  const handleSetDefaultPaymentMethod = async () => {
    if (!selectedPaymentMethodId) return;
    const response = await fetch(`${API_URL}customer/payment/methods/default`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.getCookie('token')}`,
      },
      body: JSON.stringify({ paymentMethodId: selectedPaymentMethodId })
    });

    if (response.ok) {
      getPaymentMethod();
      // alert('Default payment method set successfully!');
      handleClose();
    } else {
      console.error("Failed to set default payment method");
      // alert('Failed to set default payment method. Please try again.');
    }
  };

  return (
    <Sidebar>
      <div style={{
        flex: "1",
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        overflowY: "auto",
        width: "-webkit-fill-available",
        padding: "2rem"
      }}>

        <div className={styles.logoarrow}>
          <Image src={backarrow} className={styles.backarroww} onClick={() => window.history.back()} alt="Back Arrow" />
          <div className={styles.helpSupportTitle}>My Payment Method</div>
        </div>

        {
          paymentMethods.map(paymentMethod => (
            <Container key={paymentMethod.id} className={styles.paymentcard} onClick={() => handleShow(paymentMethod.id)}
              style={{
                backgroundColor: paymentMethod.isDefault ? "#F7ECFF" : "lightgray"
              }} >
              <Container className={styles.mastercard}>
                <div style={{
                  backgroundColor: "white",
                  paddingInline: "10px",
                  borderRadius: "10px",
                }}>
                  <Image
                    src={paymentMethod.brand === "visa" ? visa : paymentMethod.brand === "mastercard" ? mastercard : americanexpress}
                    width={40}
                    height={40}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className={styles.cardNumber}>
                  <p>***{paymentMethod.last4}</p>
                </div>
                {
                  paymentMethod.isDefault && (
                    <div className={styles.cardNumber}>
                    <p>(Default)</p>
                  </div>
                  )
                }
              
              </Container>
              <Image
                width="24px"
                height="24px"
                src={paymentcarddelete}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent container click
                  handleShowDelete(paymentMethod.id);
                }}
                alt="Delete Payment Method"
                style={{ cursor: "pointer" }}
              />
            </Container>
          ))
        }

        <Container className={styles.buttoncontainer}>
          <Button className={styles.btnnSave} onClick={() => navigate("/addpaymentmethod")}>
            Add Payment <span>
              <Image src={update} />
            </span>
          </Button>
        </Container>

        {/* Set Default Payment Method Modal */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Body className="pause-modal-content">
          <div className="pause-modal-title">Default payment method</div>
            <div className="pause-modal-message">
            Are you sure you want to set this as your default payment method? 
            </div>
            <div className="d-flex justify-content-center" style={{ gap: "30px" }}>
              <Button variant="outline-danger" className="global-cancel-button" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="global-save-button" onClick={handleSetDefaultPaymentMethod}>
                Save
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {/* Delete Payment Method Modal */}
        <Modal show={showDelete} onHide={handleCloseDelete} centered>
          <Modal.Body className="pause-modal-content">
          <div className="pause-modal-title">Delete payment method</div>
            <div className="pause-modal-message">
            Are you sure you want to delete this payment method?
            </div>
            <div className="d-flex justify-content-center" style={{ gap: "30px" }}>
              <Button variant="outline-danger" className="global-cancel-button" onClick={handleCloseDelete}>
                Cancel
              </Button>
              <Button className="global-save-button" onClick={handleDeletePaymentMethod}>
                Delete
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </Sidebar>
  );
}

export default PaymentMethod;
