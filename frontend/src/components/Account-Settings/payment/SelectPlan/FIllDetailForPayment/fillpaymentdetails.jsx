import React, { useState } from 'react';
import pay from './fillpaymentdetails.module.css';
import { Button, Container, Image, Modal } from 'react-bootstrap';
import backarrow from "../../../../../assets/images/backarrow.jpg";
import redeemcode from '../../../../../assets/images/redeemcode.png'

import premium from '../../../../../assets/images/premium.png'
import deleteicon from "../../../../../assets/images/deleteicon.png";

import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../../userflow/components/sidebar/sidebar';

const Fillpaymentdetails = () => {
  const navigate = useNavigate();
  const[showmodal, setShowmodal] = useState(false);
  const handleclosemodal= ()=> setShowmodal(false);
  const handleshowmodal = ()=> setShowmodal(true);

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
        <Container>

          <Container className='logo-progressbar3' style={{marginBottom : "30px"}}>
            <Container className='logo-arrow3'>
              <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
              <h1 className='account-setting-heading' style={{color : "#515151"}}>
            

                Payments
              </h1>
            </Container>
          </Container>



           <Container className={pay.subscriptiondetails}>
            <Container className={pay.upgrade}>
            <Image className={pay.premium} src={premium}/>
            <p> Premium Account Upgrade (1 month) </p>
            </Container>
            <p>Subtotal: $149.99 CAD</p>
            <p>Total: $149.99 CAD</p>
           </Container>
          <Container className={pay.redeemcode} onClick={handleshowmodal}>
            <p>
<Image src={redeemcode} />
            Redeem Your Code
            </p>
          </Container>
          <div className={pay.formContainer}>
            <form>
              <div className={pay.formGroup}>
                <div className={pay.detailandclear}>
                <label htmlFor="cardNumber">Details</label>
               
                </div>
               
                <input type="text" className={`form-control ${pay.inputField}`} id="cardNumber" placeholder="Card number" />
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

              <p className={pay.Recurringbilling}>
                Recurring billing, cancel anytime.
              </p>

              <p className={pay.textmuted}>
                Your subscription will automatically renew for the same package length at the same price until you cancel in settings in your MTD account. By subscribing, you agree to our <a className={pay.termandconditons} onClick={() => navigate("/termandconditions")} >terms of service</a>.
              </p>
              <p className={pay.textmuted}>
              We like commitments. No refunds.
              </p>
              <div className={pay.subscribeButtonContainer}>
                <button type="submit" className={pay.subscribeButtonn}>Subscribe</button>
              </div>
              <p  className={pay.textmuted}>
                Billed in CAD. Other conversions are estimates only. Actual charge may vary based on exchange rates.
              </p>
            </form>
          </div>
        </Container>

      </div>
<Modal show={showmodal} onHide={handleclosemodal} centered>
            <Modal.Body className="pause-modal-content">
                <div className="pause-modal-title">Redeem your Promo Code</div>
                <div className={pay.pausemodalmessageinput}>
                   <input type="text" placeholder='Enter Promo Code' />
                </div>
                <div className="d-flex justify-content-center">
                    <Button variant="outline-danger" className="btn-no" onClick={handleclosemodal}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="btn-yes" onClick={handleclosemodal}>
                       Submit
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    </Sidebar>
  );
};

export default Fillpaymentdetails;
