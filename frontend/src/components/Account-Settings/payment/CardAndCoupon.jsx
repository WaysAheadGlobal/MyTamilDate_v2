import React, { useEffect, useState } from "react";
import Sidebar from "../../userflow/components/sidebar/sidebar";
import pay from "./CardandPayment.module.css";
import { useCookies } from "../../../hooks/useCookies";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../../../Context/AlertModalContext";
import { API_URL } from "../../../api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, Form, Image, Modal } from "react-bootstrap";
import crousleone from "../../../assets/images/crau1.png";
import crousletwo from "../../../assets/images/crau2.png";
import crouslethree from "../../../assets/images/crau3.png";
import styles from "../payment/newpayment/carousel.module.css";

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useSearchParams } from "react-router-dom";

const CardandPayment = () => {
  const location = useLocation();
  const { priceId, product, currency, selectedCard } = location.state || {};
  console.log(priceId, product, currency, selectedCard);
  const cookies = useCookies();
  const [paymentMethods, setPaymentMethods] = useState([]);

  // const [selectedCard, setSelectedCard] = useState(2);
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [percentOff, setPercentOff] = useState(0);
  const [amountOff, setAmountOff] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("CAD");

  const [cardNumberValid, setCardNumberValid] = useState(null);
  const [matchmodal, setMatchmodal] = useState(false);
  const [showModal, setshowmodal] = useState(false);
  const handleShow = () => setMatchmodal(true);
  const handleClose = () => setMatchmodal(false);
  const [key, setKey] = useState(0);
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const [carderror, setCarderror] = useState("");

  const [showpaymentsuccess, setShowshowpaymentsuccess] = useState(false);
  const Gotohomepage = () => {
    setshowmodal(false);
    window.location.href = "/user/home";
  };

  const rates = ["CAD", "USD", "GBP", "EUR", "AUD"];

  function validateCardNumber(number) {
    // Remove all non-digit characters
    const sanitized = number.replace(/[^0-9]/g, "");
    let sum = 0;
    let shouldDouble = false;

    // Iterate over the card number digits in reverse order
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i]);

      if (shouldDouble) {
        // Double the digit and if it becomes greater than 9, subtract 9
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    // If the total sum is divisible by 10, the card number is valid
    return sum % 10 === 0;
  }

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const [price, setPrice] = useState({
    m1: {
      monthly: 49.99,
      productId: process.env.REACT_APP_STRIPE_PRODUCT_ID_1_MONTHS,
    },
    m3: {
      monthly: 33.99,
      total: 99.99,
      productId: process.env.REACT_APP_STRIPE_PRODUCT_ID_3_MONTHS,
    },
    m6: {
      monthly: 24.99,
      total: 149.99,
      productId: process.env.REACT_APP_STRIPE_PRODUCT_ID_6_MONTHS,
    },
  });

  useEffect(() => {
    console.log("priceId", priceId);
  }, [priceId]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_URL}customer/payment/methods`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.getCookie("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setPaymentMethods(data);
        console.log(paymentMethods);
      }
    })();
  }, []);

  async function handlePayment() {
    setLoading(true);
    console.log("priceId", priceId);
    console.log("product", product);
    console.log("tokken", cookies.getCookie("token"));
    try {
      const path = coupon ? `/${coupon}` : "";
      const response = await fetch(
        `${API_URL}customer/payment/create-subscription${path}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.getCookie("token")}`,
          },
          body: JSON.stringify({ priceId, product }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        if (data.url) {
          alert.setModal({
            show: true,
            message: data.message,
            title: "",
            onButtonClick: () => {
              navigate(data.url);
            },
          });
        } else {
          setLoading(false);
          setshowmodal(true);
        }
      }
    } catch (error) {
      alert.setModal({
        show: true,
        message: "Something went wrong. Please try again later.",
        title: "",
      });
    } finally {
      setLoading(false);
    }
  }

  const getPrice = (basePrice, productId) => {
    // Example conversion rates
    const rates = {
      CAD: 1,
      USD: 0.73,
      GBP: 0.56,
      EUR: 0.67,
      AUD: 1.1,
    };

    let convertedPrice = basePrice * rates[selectedCurrency];

    if (percentOff && product === productId) {
      convertedPrice = (
        convertedPrice -
        (convertedPrice * percentOff) / 100
      ).toFixed(2);
    } else if (amountOff && product === productId) {
      convertedPrice = (convertedPrice - amountOff).toFixed(2);
    } else {
      convertedPrice = convertedPrice.toFixed(2);
    }

    return convertedPrice;
  };

  useEffect(() => {
    setPrice({
      m1: {
        monthly: getPrice(
          49.99,
          process.env.REACT_APP_STRIPE_PRODUCT_ID_1_MONTHS
        ),
        total: getPrice(
          49.99,
          process.env.REACT_APP_STRIPE_PRODUCT_ID_1_MONTHS
        ),
        productId: process.env.REACT_APP_STRIPE_PRODUCT_ID_1_MONTHS,
      },
      m3: {
        monthly: getPrice(
          33.99,
          process.env.REACT_APP_STRIPE_PRODUCT_ID_3_MONTHS
        ),
        total: getPrice(
          99.99,
          process.env.REACT_APP_STRIPE_PRODUCT_ID_3_MONTHS
        ),
        productId: process.env.REACT_APP_STRIPE_PRODUCT_ID_3_MONTHS,
      },
      m6: {
        monthly: getPrice(
          24.99,
          process.env.REACT_APP_STRIPE_PRODUCT_ID_6_MONTHS
        ),
        total: getPrice(
          149.99,
          process.env.REACT_APP_STRIPE_PRODUCT_ID_6_MONTHS
        ),
        productId: process.env.REACT_APP_STRIPE_PRODUCT_ID_6_MONTHS,
      },
    });
  }, [selectedCurrency, percentOff, amountOff]);

  async function checkCouponValidity() {
    if (!coupon) {
      setError("Please enter a promo code");
      return;
    }
    console.log(product);
    try {
      const response = await fetch(
        `${API_URL}customer/payment/check-valid-coupon/${product}/${coupon}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.getCookie("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.valid) {
          setPercentOff(data.percentOff);
          setAmountOff(data.amountOff);
          setError("");
          setShow(false);
        } else {
          setError(data.message ?? "Invalid promo code");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // async function addPaymentMethod(e) {
  //     setLoading(true);
  //     e.preventDefault();

  //     if (!stripe || !elements) {

  //         return;
  //     }

  //     const cardNumberElement = elements.getElement(CardNumberElement);
  //     const cardExpiryElement = elements.getElement(CardExpiryElement);
  //     const cardCvcElement = elements.getElement(CardCvcElement);

  //     const { error, token } = await stripe.createToken(cardNumberElement);

  //     if (error) {
  //         console.log('[error]', error);
  //         console.log(token);
  //         setCarderror(error.message)
  //         return;
  //     }

  //     const response = await fetch(`${API_URL}customer/payment/create-payment-method`, {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${cookies.getCookie('token')}`,
  //         },
  //         body: JSON.stringify({ token: token.id }),
  //     });
  //     const data = await response.json();

  //     if (response.ok) {
  //         if (searchParams[0].get('type') === 'subscribe') {

  //         }
  //         handlePayment();

  //     }
  // }

  async function addPaymentMethod(e) {
    setLoading(true); // Start loading
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      setLoading(false); // Stop loading since Stripe isn't ready
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, token } = await stripe.createToken(cardNumberElement);

    if (error) {
      console.log("[error]", error);
      setCarderror(error.message);
      setLoading(false); // Stop loading on error
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}customer/payment/create-payment-method`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.getCookie("token")}`,
          },
          body: JSON.stringify({ token: token.id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (searchParams[0].get("type") === "subscribe") {
          alert.setModal({
            show: true,
            message: data.message,
            title: "Success",
            onButtonClick: () => {
              navigate("/selectplan");
            },
          });
          return;
        }
        handlePayment();
      } else {
        console.error("Error:", data.message); // Log server-side errors
        setCarderror(data.message); // Show error to the user
      }
    } catch (fetchError) {
      console.error("Fetch error:", fetchError); // Log network or other fetch-related errors
      setCarderror(
        "An error occurred while processing your payment. Please try again."
      ); // Show a generic error message
    } finally {
      setLoading(false); // Ensure loading is stopped in both success and failure cases
    }
  }

  return (
    <Sidebar>
      <div
        style={{
          flex: "1",
          marginInline: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflowY: "auto",

          width: "-webkit-fill-available",
        }}
      >
        <div className={pay.maincontainer}>
          <div className={pay.carddetails}>
            <div
              style={{
                flex: "1",
                marginInline: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
                // padding : "2rem",
                padding: "8px",
                height: "calc(100vh - 64px)",
                width: "100%",
              }}
            >
              <div className={pay.selectedplandetails}>
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",

                    alignItems: "center",
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: "500",
                    lineHeight: "30px",
                  }}
                >
                  {" "}
                  <span style={{ marginRight: "20px" }}>
                    <svg
                      width="20"
                      height="16"
                      viewBox="0 0 20 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.53212 0.549437C2.11262 0.549437 2.58512 1.02194 2.58512 1.60244C2.58512 1.97894 2.38712 2.31794 2.05562 2.50994C1.89962 2.59994 1.84713 2.79944 1.93712 2.95544L5.48312 9.09644C5.54162 9.19694 5.64812 9.25994 5.76512 9.25994C5.88212 9.25994 5.98862 9.19844 6.04712 9.09644L9.59312 2.95394C9.68312 2.79794 9.63062 2.59994 9.47462 2.50994C9.14312 2.31794 8.94662 1.97894 8.94662 1.60394C8.94662 1.02344 9.41912 0.550937 9.99962 0.550937C10.5801 0.550937 11.0526 1.02344 11.0526 1.60394C11.0526 1.98044 10.8546 2.31944 10.5216 2.51144C10.4466 2.55494 10.3926 2.62544 10.3701 2.70944C10.3476 2.79344 10.3596 2.88194 10.4031 2.95694L13.9521 9.09794C14.0106 9.19844 14.1171 9.26144 14.2341 9.26144C14.3511 9.26144 14.4576 9.19994 14.5161 9.09794L18.0621 2.95694C18.1521 2.80094 18.0981 2.60144 17.9436 2.51144C17.6121 2.31944 17.4141 1.98044 17.4141 1.60394C17.4141 1.02344 17.8866 0.550937 18.4671 0.550937C19.0476 0.550937 19.5201 1.02344 19.5201 1.60394C19.5201 2.18444 19.0476 2.65694 18.4671 2.65694C18.2871 2.65694 18.1416 2.80244 18.1416 2.98244V12.2884H10.8396C10.6596 12.2884 10.5141 12.4339 10.5141 12.6139C10.5141 12.7939 10.6596 12.9394 10.8396 12.9394H18.1416V15.4414H1.85912V2.98094C1.85912 2.80094 1.71363 2.65544 1.53363 2.65544C0.953125 2.65544 0.480625 2.18294 0.480625 1.60244C0.480625 1.02194 0.951625 0.549437 1.53212 0.549437Z"
                        fill="white"
                      />
                    </svg>
                  </span>{" "}
                  Premium Account Upgrade{" "}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "500",
                    alignItems: "center",
                    color: "#fff",
                  }}
                >
                  (
                  {selectedCard === 0
                    ? "1 month"
                    : selectedCard === 2
                    ? "3 months"
                    : "6 months"}
                  )
                </div>
                <div className={pay.finalsubtotal}>
                  <p>
                    Subtotal : $
                    {selectedCard === 0
                      ? `${price.m1.total}`
                      : selectedCard === 2
                      ? `${price.m3.total}`
                      : `${price.m6.total}`}{" "}
                    {selectedCurrency}
                  </p>
                  <p
                    style={{
                      marginLeft: "27px",
                    }}
                  >
                    Total : $
                    {selectedCard === 0
                      ? `${price.m1.total}`
                      : selectedCard === 2
                      ? `${price.m3.total}`
                      : `${price.m6.total}`}{" "}
                    {selectedCurrency}
                  </p>
                </div>
              </div>
              <div
                onClick={() => {
                  setShow(true);
                }}
                className={pay.redeempromocode}
              >
                <p>
                  <span style={{ marginRight: "20px" }}>
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M26.25 22.5V7.5H10L2.5 15L10 22.5H26.25Z"
                        stroke="#515151"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15 15C15 16.3807 13.8807 17.5 12.5 17.5C11.1193 17.5 10 16.3807 10 15C10 13.6193 11.1193 12.5 12.5 12.5C13.8807 12.5 15 13.6193 15 15Z"
                        stroke="#515151"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  Redeem your promo code
                </p>
              </div>
              <div className={pay.fillcarddetails}>
                <div style={{ marginTop: "10px" }}>
                  <div className={pay.formContainer}>
                    <form key={key} onSubmit={addPaymentMethod}>
                      {/* <CardElement  /> */}
                      <div className={pay.formGroup}>
                        <div className={pay.detailandclear}>
                          <label
                            style={{
                              color: "#000000",
                            }}
                            htmlFor="cardNumber"
                          >
                            Details
                          </label>
                        </div>
                        <div className={pay.formGroup}>
                          {/* <div className={`form-control ${pay.inputField}`} style={{
                                                        padding: "10px",
                                                    }}>
                                                        
                                                        <CardNumberElement
                                                            className={pay.cardElement}
                                                            options={{ style: { base: { fontSize: '16px' } } }}
                                                            onChange={handleCardNumberChange}
                                                        />
                                                       
                                                    </div> */}
                          <div
                            className={`form-control ${pay.inputField}`}
                            style={{ padding: "10px" }}
                          >
                            {paymentMethods.length >= 1 ? (
                              <input
                                style={{ border: "none", outline: "none" }}
                                type="text"
                                value={`**** **** **** ${paymentMethods[0].last4}`}
                                readOnly
                              />
                            ) : (
                              <CardNumberElement />
                            )}
                          </div>
                          {/* {cardNumberValid !== null && (
                                                            <span className={cardNumberValid ? pay.valid : pay.invalid}>
                                                                {cardNumberValid ? '' : <Form.Text className="text-danger error-message">*Invalid Card Number.</Form.Text>}
                                                            </span>
                                                        )} */}
                        </div>
                        <div>
                          {carderror && (
                            <p
                              className="text-danger error-message"
                              style={{
                                marginTop: "-10px",
                                marginBottom: "10px",
                              }}
                            >
                              {carderror}
                            </p>
                          )}
                        </div>

                        {paymentMethods.length >= 1 ? (
                          ""
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              gap: "15px",
                            }}
                          >
                            <div
                              className={pay.formGroup}
                              style={{
                                width: "100px",
                              }}
                            >
                              <div
                                className={`form-control ${pay.inputField}`}
                                style={{
                                  padding: "10px",
                                }}
                              >
                                <CardExpiryElement />
                              </div>
                            </div>
                            <div
                              className={pay.formGroup}
                              style={{
                                width: "100px",
                              }}
                            >
                              <div
                                className={`form-control ${pay.inputField}`}
                                style={{
                                  padding: "10px",
                                }}
                              >
                                <CardCvcElement />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className={pay.formGroup}
                        style={{ marginTop: "30px" }}
                      >
                        <label
                          style={{
                            color: "#000000",
                            fontSize: "18px",
                          }}
                          htmlFor="address"
                        >
                          Billing Address
                        </label>
                      </div>
                      <div className={pay.formGroup}>
                        <label htmlFor="address">Address</label>
                        <input
                          type="text"
                          className={`form-control ${pay.inputField}`}
                          id="address"
                          placeholder=""
                        />
                      </div>
                      <div className={pay.formGroup}>
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          className={`form-control ${pay.inputField}`}
                          id="city"
                          placeholder=""
                        />
                      </div>
                      <div className={pay.formGroup}>
                        <label htmlFor="state">State / Province</label>
                        <input
                          type="text"
                          className={`form-control ${pay.inputField}`}
                          id="state"
                          placeholder=""
                        />
                      </div>
                      <div className={pay.formGroup}>
                        <label htmlFor="zip">ZIP / Postal Code</label>
                        <input
                          type="text"
                          className={`form-control ${pay.inputField}`}
                          id="zip"
                          placeholder=""
                        />
                      </div>

                      <p className={pay.Recurringbilling}>
                        Recurring billing, cancel anytime.
                      </p>

                      <p className={pay.textmuted}>
                        Your subscription will automatically renew for the same
                        package length at the same price until you cancel in
                        settings in your MTD account. By subscribing, you agree
                        to our
                        <a
                          className={pay.termandconditons}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open("/termandconditions", "_blank");
                          }}
                        >
                          {" "}
                          terms of service
                        </a>
                        .
                      </p>

                      <div className={pay.subscribeButtonContainer}>
                        {paymentMethods.length >= 1 ? (
                          <button
                            className="global-next-btn"
                            onClick={handlePayment}
                          >
                            {" "}
                            {loading ? "Processing..." : "Continue"}
                          </button>
                        ) : (
                          <button type="submit" className="global-next-btn">
                            {" "}
                            {loading ? "Processing..." : "Submit"}
                          </button>
                        )}
                        {/* <button type="submit" className="global-next-btn">Submit</button> */}
                      </div>

                      <p className={pay.textmuted}>
                        Billed in CAD. Other conversions are estimates only.
                        Actual charge may vary based on exchange rates.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal size="lg" style={{ padding: "30px" }} centered show={show}>
        <Modal.Body>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "600",
              margin: "0",
              marginBottom: "1rem",
              color: "black",
            }}
          >
            Redeem your promo code
          </p>
          <input
            type="text"
            placeholder="Enter your promo code"
            value={coupon}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "10px",
              border: error ? "2px solid #ff0101" : "2px solid #6c6c6c",
              outline: "none",
              color: error ? "#ff0101" : "black",
            }}
            onChange={(e) => {
              setCoupon(e.target.value);
              setError("");
            }}
          />

          {error && (
            <Form.Text className="text-danger error-message">
              *{error}.
            </Form.Text>
          )}

          {/* {error && <p style={{ color: "#ff0101", fontSize: "14px", margin: "0", marginTop: "0.5rem", textAlign: "left" }}>{error}</p>} */}
          <div
            style={{
              marginTop: "4rem",
              display: "flex",
              gap: "1rem",
              marginInline: "auto",
            }}
          >
            <button
              className="global-cancel-button"
              type="button"
              onClick={() => {
                setShow(false);
              }}
            >
              Cancel
            </button>

            <button
              className="global-save-button"
              onClick={checkCouponValidity}
            >
              Submit
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        centered
        className="selfie-modal"
        show={showModal}
        onHide={() => setshowmodal(false)}
      >
        <Modal.Body className="selfie-modal-body">
          Payment successful! Your myTamilDate subscription is now active.
          <button className="global-save-button" onClick={Gotohomepage}>
            Okay
          </button>
        </Modal.Body>
      </Modal>
    </Sidebar>
  );
};

export default CardandPayment;
