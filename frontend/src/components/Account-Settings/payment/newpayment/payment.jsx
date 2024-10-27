import React, { useEffect, useState } from "react";
import Sidebar from "../../../userflow/components/sidebar/sidebar";
import pay from "./payment.module.css";
import { useCookies } from "../../../../hooks/useCookies";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../Context/AlertModalContext";
import { API_URL } from "../../../../api";
import { IoMdArrowDropdown } from "react-icons/io";
import CarouselComponent from "../SelectPlan/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, Form, Image, Modal } from "react-bootstrap";
import crousleone from "../../../../assets/images/crau1.png";
import crousletwo from "../../../../assets/images/crau2.png";
import crouslethree from "../../../../assets/images/crau3.png";
import styles from "./carousel.module.css";
import deleteicon from "../../../../assets/images/deleteicon.png";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useSearchParams } from "react-router-dom";
import Button from "../../../userflow/components/button/Button";
import CustomModal from "./matchmodal";

const Paymentfinal = () => {
  const cookies = useCookies();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [priceId, setPriceId] = useState(
    process.env.REACT_APP_STRIPE_PRICE_ID_6_MONTHS
  );
  const [selectedCard, setSelectedCard] = useState(2); // Start with the middle card selected
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [percentOff, setPercentOff] = useState(0);
  const [amountOff, setAmountOff] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("CAD"); // Default to CAD
  const [product, setProduct] = useState(
    process.env.REACT_APP_STRIPE_PRODUCT_ID_3_MONTHS
  );
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
  const [simble, setSimble] = useState("C$");

  const [showpaymentsuccess, setShowshowpaymentsuccess] = useState(false);
  const Gotohomepage = () => {
    setshowmodal(false);
    window.location.href = "/user/home";
  };

  const currencySymbols = {
    CAD: "CAD",
    USD: "$",
    GBP: "£",
    EUR: "€",
    AUD: "AUD",
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
      setLoading(false);
      alert.setModal({
        show: true,
        message: "Something went wrong. Please try again later.",
        title: "",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCardClick = (priceId, index) => {
    setPriceId(priceId);
    setSelectedCard(index);
    console.log(selectedCard);
    console.log(price);
  };

  const getPrice = (basePrice, productId) => {
    // Example conversion rates
    const rates = {
      CAD: 1,
      USD: 0.73,
      GBP: 0.56,
      EUR: 0.66,
      AUD: 1.08,
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
    setSimble(currencySymbols[selectedCurrency]);
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
  //         // Stripe.js has not loaded yet
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
  //             // alert.setModal({
  //             //   show: true,
  //             //   message: data.message,
  //             //   title: "Success",
  //             //   onButtonClick: () => {
  //             //     navigate('/selectplan');
  //             //   }
  //             // });
  //             // return;
  //         }
  //         handlePayment();
  //         //   alert.setModal({
  //         //     show: true,
  //         //     message: data.message,
  //         //     title: "Success",
  //         //   });
  //     }
  //     else{
  //         setLoading(false);
  //     }
  // }

  const handleCardNumberChange = (event) => {
    const { complete, error } = event;
    if (complete && !error) {
      setCardNumberValid(true);
    } else if (error) {
      setCardNumberValid(false);
    } else {
      setCardNumberValid(null);
    }
  };

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
          <div className={pay.plandetails}>
            <div>
              <div className={pay.currencyselected}>
                <div className={pay.selectWrapper}>
                  <select
                    name="currency"
                    id="currency-select"
                    className={`form-select ${pay.formSelectCurrency}`}
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    style={{ color: "#F76A7B" }}
                  >
                    {rates.map((rate, i) => (
                      <option key={i} value={rate}>
                        {rate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={pay.cardContainer}>
                <div
                  className={`${pay.pricingCard} ${
                    selectedCard === 0 ? pay.selectedCard : ""
                  }`}
                  onClick={() => {
                    handleCardClick(
                      process.env.REACT_APP_STRIPE_PRICE_ID_1_MONTHS,
                      0
                    );
                    setProduct(
                      process.env.REACT_APP_STRIPE_PRODUCT_ID_1_MONTHS
                    );
                  }}
                >
                  <div className={pay.cardBody}>
                    <h5 className={pay.cardTitle}>1 month</h5>
                    <h2 className={pay.cardPrice}>
                      {simble}{" "}
                      {
                        /* getPrice(49.99, process.env.REACT_APP_STRIPE_PRODUCT_ID_1_MONTHS) */ price
                          .m1.monthly
                      }{" "}
                    </h2>
                  </div>
                </div>
                <div
                  className={`${pay.pricingCard} ${
                    selectedCard === 2 ? pay.selectedCard : ""
                  }`}
                  onClick={() => {
                    handleCardClick(
                      process.env.REACT_APP_STRIPE_PRICE_ID_3_MONTHS,
                      2
                    );
                    setProduct(
                      process.env.REACT_APP_STRIPE_PRODUCT_ID_3_MONTHS
                    );
                  }}
                >
                  <div className={pay.cardBody}>
                    <h5 className={pay.cardTitle}>3 months</h5>
                    <h2
                      className={pay.cardPrice}
                      style={{
                        marginBottom: "-10px",
                      }}
                    >
                      {" "}
                      {simble}{" "}
                      {
                        /* getPrice(33.99, process.env.REACT_APP_STRIPE_PRODUCT_ID_3_MONTHS) */ price
                          .m3.monthly
                      }{" "}
                      <span
                        style={{
                          fontSize: "16px",
                          color: "#6C6C6C",
                          lineHeight: "24px",
                          fontWeight: "500",
                        }}
                      >
                        /month
                      </span>{" "}
                    </h2>
                    <p className={pay.cardText}>
                      <span className={pay.savepercentage}>Save 33%</span>
                    </p>
                    <p className={pay.subtotal}>
                      ({/* getPrice(99.99) */ price.m3.total} total)
                    </p>
                  </div>
                </div>
                <div
                  className={`${pay.pricingCard} ${
                    selectedCard === 1 ? pay.selectedCard : ""
                  }`}
                  onClick={() => {
                    handleCardClick(
                      process.env.REACT_APP_STRIPE_PRICE_ID_6_MONTHS,
                      1
                    );
                    setProduct(
                      process.env.REACT_APP_STRIPE_PRODUCT_ID_6_MONTHS
                    );
                  }}
                  style={{ height: "200px" }}
                >
                  <div>
                    <p className={pay.mostPopular}>Most Popular</p>
                  </div>
                  <div
                    className={pay.cardBodypopular}
                    style={{
                      height: "185px",
                    }}
                  >
                    <div>
                      <svg
                        width="16"
                        height="12"
                        viewBox="0 0 16 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.22257 0.0442374C1.68697 0.0442374 2.06497 0.422237 2.06497 0.886637C2.06497 1.18784 1.90657 1.45904 1.64137 1.61264C1.51657 1.68464 1.47457 1.84424 1.54657 1.96904L4.38337 6.88184C4.43017 6.96224 4.51537 7.01264 4.60897 7.01264C4.70257 7.01264 4.78777 6.96344 4.83457 6.88184L7.67137 1.96784C7.74337 1.84304 7.70137 1.68464 7.57657 1.61264C7.31137 1.45904 7.15417 1.18784 7.15417 0.887838C7.15417 0.423438 7.53217 0.0454375 7.99657 0.0454375C8.46097 0.0454375 8.83897 0.423438 8.83897 0.887838C8.83897 1.18904 8.68058 1.46024 8.41418 1.61384C8.35417 1.64864 8.31098 1.70504 8.29298 1.77224C8.27498 1.83944 8.28457 1.91024 8.31937 1.97024L11.1586 6.88304C11.2054 6.96344 11.2906 7.01384 11.3842 7.01384C11.4778 7.01384 11.563 6.96464 11.6098 6.88304L14.4466 1.97024C14.5186 1.84544 14.4754 1.68584 14.3518 1.61384C14.0866 1.46024 13.9282 1.18904 13.9282 0.887838C13.9282 0.423438 14.3062 0.0454375 14.7706 0.0454375C15.235 0.0454375 15.613 0.423438 15.613 0.887838C15.613 1.35224 15.235 1.73024 14.7706 1.73024C14.6266 1.73024 14.5102 1.84664 14.5102 1.99064V9.43544H8.66857C8.52457 9.43544 8.40817 9.55184 8.40817 9.69584C8.40817 9.83984 8.52457 9.95624 8.66857 9.95624H14.5102V11.9578H1.48417V1.98944C1.48417 1.84544 1.36777 1.72904 1.22378 1.72904C0.759375 1.72904 0.381375 1.35104 0.381375 0.886637C0.381375 0.422237 0.758175 0.0442374 1.22257 0.0442374Z"
                          fill="#FC8C66"
                        />
                      </svg>
                    </div>
                    <h5 style={{ marginTop: "-1px" }} className={pay.cardTitle}>
                      6 months
                    </h5>
                    <h2 style={{ marginTop: "-6px" }} className={pay.cardPrice}>
                      {simble} {/* getPrice(24.99) */ price.m6.monthly}
                      <span
                        style={{
                          fontSize: "16px",
                          color: "#6C6C6C",
                          lineHeight: "24px",
                        }}
                      >
                        /month
                      </span>
                    </h2>
                    <p className={pay.cardText}>
                      <span className={pay.savepercentage}>Save 50%</span>
                    </p>
                    <p className={pay.subtotal}>
                      (
                      {
                        /* getPrice(149.99, process.env.REACT_APP_STRIPE_PRODUCT_ID_6_MONTHS) */ price
                          .m6.total
                      }{" "}
                      total)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                <p>
                  {" "}
                  <span style={{ marginRight: "20px" }}>
                    <svg
                      width="24"
                      height="18"
                      viewBox="0 0 24 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.84167 0.0624499C2.53827 0.0624499 3.10527 0.629449 3.10527 1.32605C3.10527 1.77785 2.86767 2.18465 2.46987 2.41505C2.28267 2.52305 2.21967 2.76245 2.32767 2.94965L6.58287 10.3189C6.65307 10.4395 6.78087 10.5151 6.92127 10.5151C7.06167 10.5151 7.18947 10.4413 7.25967 10.3189L11.5149 2.94785C11.6229 2.76065 11.5599 2.52305 11.3727 2.41505C10.9749 2.18465 10.7391 1.77785 10.7391 1.32785C10.7391 0.63125 11.3061 0.06425 12.0027 0.06425C12.6993 0.06425 13.2663 0.63125 13.2663 1.32785C13.2663 1.77965 13.0287 2.18645 12.6291 2.41685C12.5391 2.46905 12.4743 2.55365 12.4473 2.65445C12.4203 2.75525 12.4347 2.86145 12.4869 2.95145L16.7457 10.3207C16.8159 10.4412 16.9437 10.5169 17.0841 10.5169C17.2245 10.5169 17.3523 10.4431 17.4225 10.3207L21.6777 2.95145C21.7857 2.76425 21.7209 2.52485 21.5355 2.41685C21.1377 2.18645 20.9001 1.77965 20.9001 1.32785C20.9001 0.63125 21.4671 0.06425 22.1637 0.06425C22.8603 0.06425 23.4273 0.63125 23.4273 1.32785C23.4273 2.02445 22.8603 2.59145 22.1637 2.59145C21.9477 2.59145 21.7731 2.76605 21.7731 2.98205V14.1493H13.0107C12.7947 14.1493 12.6201 14.3239 12.6201 14.5399C12.6201 14.7559 12.7947 14.9304 13.0107 14.9304H21.7731V17.9328H2.23407V2.98025C2.23407 2.76425 2.05947 2.58965 1.84348 2.58965C1.14688 2.58965 0.579875 2.02265 0.579875 1.32605C0.579875 0.629449 1.14507 0.0624499 1.84167 0.0624499Z"
                        fill="#F97972"
                      />
                    </svg>
                  </span>{" "}
                  Premium Account Upgrade (
                  {selectedCard === 0
                    ? "1 month"
                    : selectedCard === 2
                    ? "3 months"
                    : "6 months"}
                  )
                </p>

                <div className={pay.finalsubtotal}>
                  <p>
                    Subtotal : {simble}{" "}
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
                    Total : {simble}{" "}
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
                      width="27"
                      height="27"
                      viewBox="0 0 27 27"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.25 7.75H19.2375M2.2625 15.7625L11.225 24.725C11.4572 24.9574 11.7329 25.1418 12.0364 25.2677C12.3399 25.3935 12.6652 25.4582 12.9937 25.4582C13.3223 25.4582 13.6476 25.3935 13.9511 25.2677C14.2546 25.1418 14.5303 24.9574 14.7625 24.725L25.5 14V1.5H13L2.2625 12.2375C1.79687 12.7059 1.53552 13.3395 1.53552 14C1.53552 14.6605 1.79687 15.2941 2.2625 15.7625Z"
                        stroke="#242424"
                        stroke-width="3"
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
                          {/* <label className={pay.clearformdata} onClick={() => {
                                                    setKey(key + 1);
                                                }} > <span ><Image src={deleteicon} style={{ marginRight: "5px" }} /></span>Clear</label> */}
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
                      <p
                        style={{
                          color: "#515151",
                          fontSize: "18px",
                          fontWeight: "500",
                          textAlign: "center",
                        }}
                      >
                        We like commitments. No refunds.
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

          <div className={pay.sideimage}>
            <div className={pay.backgroundcolor}>
              <Carousel pause="hover" indicators={true} controls={false}>
                <Carousel.Item>
                  <Image src={crousleone} className={styles.carouselImage} />
                  <Carousel.Caption className={styles.carouselCaption}>
                    <h5>Premium Membership Benefits</h5>
                    <ul>
                      <li>Send & receive unlimited messages</li>
                      <li>See who liked you</li>
                    </ul>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <Image src={crousletwo} className={styles.carouselImage} />
                  <Carousel.Caption className={styles.carouselCaption}>
                    <h5>Premium Membership Benefits</h5>
                    <ul>
                      <li>
                        Access all premium filters to help you zone in on the
                        exact matches you’re looking for
                      </li>
                      {/* <li>Send & receive special requests to members you haven’t matched with and stand out</li>
                                            <li>Undo matches you’ve passed on if you change your mind</li> */}
                    </ul>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <Image src={crouslethree} className={styles.carouselImage} />
                  <Carousel.Caption className={styles.carouselCaption}>
                    <h5>Premium Membership Benefits</h5>
                    <ul>
                      <li>
                        Send & receive special requests to members you haven’t
                        matched with and stand out
                      </li>
                      <li>
                        Undo matches you’ve passed on if you change your mind
                      </li>
                    </ul>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
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

      {/* <button onClick={handleShow}>Show Modal</button> */}
      {/* <CustomModal matchmodal={matchmodal} handleClose={handleClose} /> */}
    </Sidebar>
  );
};

export default Paymentfinal;

{
  /* <div className={pay.backgroundImage}>
                                <div>
                                    <h1>Details</h1>
                                </div>
                            </div> */
}
