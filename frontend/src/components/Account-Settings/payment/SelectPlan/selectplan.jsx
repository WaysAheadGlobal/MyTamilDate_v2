import React, { useEffect, useState } from 'react';
import { Container, Image } from 'react-bootstrap';
import { IoMdArrowDropdown } from 'react-icons/io';
import backarrow from "../../../../assets/images/backarrow.jpg";
import logo2 from "../../../../assets/images/logo2.png";
import Sidebar from '../../../userflow/components/sidebar/sidebar';
import CarouselComponent from './Carousel';
import PricingCarousel from './plandetails';
import styles from './selectplan.module.css';
import Paymentfinal from '../newpayment/payment';

const Selectplan = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('CAD'); // Default to CAD
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setMobile(true);
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1024) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    });
  }, [])
  const rates = [
    "CAD",
    "USD",
    "GBP",
    "EUR",
    "AUD",
  ];

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  return (
<>
 <Sidebar>
  <div className={styles.sidebardivbackground} style={{
    flex: "1",
    marginInline: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    overflowY: "auto",
    width: "-webkit-fill-available",
  }}>
    <div className={styles.bottomdetails} >
      <div style={{ marginBottom: "10px" }}>
        <Container className='logo-arrow1'>
          <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
          <Image src={logo2} alt="Logo" className='logo1' style={{ backgroundColor: 'transparent' }} />
        </Container>
      </div>
      <CarouselComponent />
      <div>
        <div className={styles.currencyselected}>
          <div className={styles.selectWrapper}>
            <select
              name="currency"
              id="currency-select"
              className={`form-select ${styles.formSelectCurrency}`}
              value={selectedCurrency}
              onChange={handleCurrencyChange}
            >
              {rates.map((rate, i) => (
                <option key={i} value={rate}>{rate}</option>
              ))}
            </select>
            <div className={styles.iconContainer}>
              <IoMdArrowDropdown className={styles.dropdownIcon} />
            </div>
          </div>
        </div>
        <div style={{
          marginTop: "1rem",
        }}>
          <PricingCarousel
            currency={selectedCurrency}
          />
        </div>
      </div>
    </div>
  </div>
</Sidebar>


   
    </>

  );
}

export default Selectplan;
