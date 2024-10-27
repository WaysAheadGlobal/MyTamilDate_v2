import React, { useState } from 'react';
import { Container, Image } from 'react-bootstrap';
import backarrow from "../../../assets/images/backarrow.jpg";
import deleteicon from "../../../assets/images/deleteicon.png";
import pay from './addpaymentmethod.module.css';

import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../../../api';
import { useAlert } from '../../../Context/AlertModalContext';
import { useCookies } from '../../../hooks/useCookies';
import Sidebar from '../../userflow/components/sidebar/sidebar';

const AddPaymentMethod = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState(0);
  const[carderror, setError] = useState("");
  const cookies = useCookies();
  const stripe = useStripe();
  const elements = useElements();

  const alert = useAlert();
  const searchParams = useSearchParams();

  async function addPaymentMethod(e) {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    // Create a payment token using Stripe.js
    const { error, token } = await stripe.createToken(cardNumberElement);

    if (error) {
      console.log('[error]', error);
      setError(error.message);  // Set error message
      return;
    }

    try {
      const response = await fetch(`${API_URL}customer/payment/create-payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.getCookie('token')}`,
        },
        body: JSON.stringify({ token: token.id }),
      });

      const data = await response.json();

      if (response.ok) {
        if (searchParams[0].get('type') === 'subscribe') {
          alert.setModal({
            show: true,
            message: data.message,
            title: "Success",
            onButtonClick: () => {
              if (cookies.getCookie("isPremium") !== "true") {
                navigate('/selectplan');
              } else {
                navigate('/paymentmethod');
              }
            }
          });
          return;
        }

        alert.setModal({
          show: true,
          message: data.message,
          title: "Success",
          onButtonClick: () => {
            if (cookies.getCookie("isPremium") !== "true") {
              navigate('/selectplan');
            } else {
              navigate('/paymentmethod');
            }
          }
        });
      } else {
        // Set error message from response
        setError(data.message || "An error occurred while creating the payment method.");
      }
    } catch (fetchError) {
      console.error("Failed to add payment method:", fetchError);
      setError("An error occurred while processing the payment.");
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
        width: "-webkit-fill-available",

      }}>
        <Container>
          <Container className='logo-progressbar3' style={{ marginBottom: "30px", marginTop: "5px" }}>
            <Container className='logo-arrow3'>
              <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
              <h1 className='account-setting-heading' style={{ color: "#515151" }}>
                Add Payments
              </h1>
            </Container>
          </Container>
          <div className={pay.formContainer}>
            <form key={key} onSubmit={addPaymentMethod}>
              {/* <CardElement  /> */}
              <div className={pay.formGroup}>
                <div className={pay.detailandclear}>
                  <label htmlFor="cardNumber">Details</label>
                  <label className={pay.clearformdata} onClick={() => {
                    setKey(key + 1);
                  }} > <span ><Image src={deleteicon} style={{ marginRight: "5px" }} /></span>Clear</label>
                </div>
                <div className={pay.formGroup}>
                  <div className={`form-control ${pay.inputField}`} style={{
                    padding: "10px",
                  }}>
                    <CardNumberElement />
                  </div>
                </div>
                {carderror && <p className="text-danger error-message" style={{
                                                        marginTop: "-10px",
                                                        marginBottom: "10px"
                                                    }}>{carderror}</p>}
                <div style={{
                  display: "flex",
                  width: "100%",
                  gap: "15px",
                }}>
                  <div className={pay.formGroup} style={{
                    width: "100px",
                  }}>
                    <div className={`form-control ${pay.inputField}`} style={{
                      padding: "10px",
                    }}>
                      <CardExpiryElement />
                    </div>
                  </div>
                  <div className={pay.formGroup} style={{
                    width: "100px",
                  }}>
                    <div className={`form-control ${pay.inputField}`} style={{
                      padding: "10px",
                    }}>

                      <CardCvcElement />
                    </div>
                   
                  </div>
                </div>
              </div>

              <div className={pay.formGroup} style={{ marginTop: "30px" }}>
                <label htmlFor="address">Billing Address</label>
              </div>
              <div className={pay.formGroup}>
                <label htmlFor="address">Address</label>
                <input type="text" className={`form-control ${pay.inputField}`} id="address" placeholder="" />
              </div>
              <div className={pay.formGroup}>
                <label htmlFor="city">City</label>
                <input type="text" className={`form-control ${pay.inputField}`} id="city" placeholder="" />
              </div>
              <div className={pay.formGroup}>
                <label htmlFor="state">State / Province</label>
                <input type="text" className={`form-control ${pay.inputField}`} id="state" placeholder="" />
              </div>
              <div className={pay.formGroup}>
                <label htmlFor="zip">ZIP / Postal Code</label>
                <input type="text" className={`form-control ${pay.inputField}`} id="zip" placeholder="" />
              </div>
              <div className={pay.subscribeButtonContainer}>
                <button type="submit" className={pay.subscribeButtonn}>Add</button>
              </div>
              <p className={pay.Recurringbilling}>
                Recurring billing, cancel anytime.
              </p>

              <p className={pay.textmuted}>
                Your subscription will automatically renew for the same package length at the same price until you cancel in settings in your MTD account. By subscribing, you agree to our <a className={pay.termandconditons} onClick={() => navigate("/termandconditions")} >terms of service</a>.
              </p>


              <p className={pay.textmuted}>
                Billed in CAD. Other conversions are estimates only. Actual charge may vary based on exchange rates.
              </p>
            </form>
          </div>
        </Container>
      </div>
    </Sidebar>
  );
};

export default AddPaymentMethod;
