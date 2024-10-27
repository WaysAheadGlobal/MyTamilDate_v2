import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Container, Button } from 'react-bootstrap';
import { useCookies } from '../../hooks/useCookies';
import { API_URL } from '../../api';

const VerifyPhoneModal = ({
  errorMessagephone,
  seterrorMessagephone,
  modalPhoneNumber,
  setModalPhoneNumber,
  setResendTimer,
  resendTimer,
  fetchData,
  showUserPhoneotp,
  handleClosePhoneotp,
  handleShowsuccessphone
}) => {
  const [otpCode1, setOtpCode1] = useState('');
  const [otpCode2, setOtpCode2] = useState('');
  const [otpCode3, setOtpCode3] = useState('');
  const [otpCode4, setOtpCode4] = useState('');
  const [otpErrorMessage, setOtpErrorMessage] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { getCookie, setCookie } = useCookies();
console.log()
  const otpCode1ref = useRef(null);
  const otpCode2ref = useRef(null);
  const otpCode3ref = useRef(null);
  const otpCode4ref = useRef(null);

  useEffect(() => {
    let interval;
    if (showUserPhoneotp) {
      // Countdown logic
      setIsResendDisabled(true);
      setResendTimer(120); // Start timer from 120 seconds when modal opens
      interval = setInterval(() => {
        setResendTimer(prevTimer => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            setIsResendDisabled(false);
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
    }

    // Clean up interval on component unmount or when modal closes
    return () => clearInterval(interval);
  }, [showUserPhoneotp]);

  const handleCodeChange = (e, setter, nextRef) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      setter(value);
      if (value.length === 1 && nextRef) {
        nextRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e, prevRef) => {
    if (e.key === 'Backspace' && e.target.value === '' && prevRef) {
      prevRef.current.focus();
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setOtpErrorMessage('');
    const otp = otpCode1 + otpCode2 + otpCode3 + otpCode4;
    if (otp.length !== 4) {
      setOtpErrorMessage('*Invalid verification code.');
    } else {
      try {
        const response = await fetch(`${API_URL}/customer/setting/updatephone`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('token')}`
          },
          body: JSON.stringify({ phone: modalPhoneNumber, otp : otp})
        });

        const result = await response.json();
        if (response.ok) {
     
          fetchData();
          setResendTimer(120);
          setIsResendDisabled(true);
          handleClosePhoneotp();
          handleShowsuccessphone();
          setOtpCode1('');
          setOtpCode2('');
          setOtpCode3('');
          setOtpCode4('');
        } else {
          setOtpErrorMessage("*"+result.message+"." || '*Failed to send code');
        }
      } catch (error) {
        console.error('Error:', error);
        setOtpErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    if (!isResendDisabled) {
      try {
        const response = await fetch(`${API_URL}customer/setting/updatephone/otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('token')}`
          },
          body: JSON.stringify({ phone: modalPhoneNumber })
        });

        const result = await response.json();
        if (response.ok) {
          setResendTimer(120); // Reset timer to 120 seconds
          setIsResendDisabled(true); // Disable resend button
        } else {
          seterrorMessagephone('*Please re-enter phone number');
        }
      } catch (error) {
        console.error('Error:', error);
        setOtpErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Modal show={showUserPhoneotp} centered>
      <Modal.Header>
        <Modal.Title>Verify Code</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmitOtp}>
          <Container className='entercode-content' style={{ marginBottom: '100px' }}>
            <div>
              <Form.Group controlId='formCode' className='entercode-form-group'>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between'
                  }}
                >
                  <Form.Control
                    className={`entercode-input ${otpErrorMessage ? 'error' : ''}`}
                    type='text'
                    ref={otpCode1ref}
                    placeholder=''
                    value={otpCode1}
                    onChange={(e) => handleCodeChange(e, setOtpCode1, otpCode2ref)}
                    onKeyDown={(e) => handleKeyDown(e, null)}
                    style={{ flex: 1 }}
                  />
                  <Form.Control
                    className={`entercode-input ${otpErrorMessage ? 'error' : ''}`}
                    type='text'
                    ref={otpCode2ref}
                    placeholder=''
                    value={otpCode2}
                    onChange={(e) => handleCodeChange(e, setOtpCode2, otpCode3ref)}
                    onKeyDown={(e) => handleKeyDown(e, otpCode1ref)}
                    style={{ flex: 1, marginLeft: '10px' }}
                  />
                  <Form.Control
                    className={`entercode-input ${otpErrorMessage ? 'error' : ''}`}
                    type='text'
                    ref={otpCode3ref}
                    placeholder=''
                    value={otpCode3}
                    onChange={(e) => handleCodeChange(e, setOtpCode3, otpCode4ref)}
                    onKeyDown={(e) => handleKeyDown(e, otpCode2ref)}
                    style={{ flex: 1, marginLeft: '10px' }}
                  />
                  <Form.Control
                    className={`entercode-input ${otpErrorMessage ? 'error' : ''}`}
                    type='text'
                    ref={otpCode4ref}
                    placeholder=''
                    value={otpCode4}
                    onChange={(e) => handleCodeChange(e, setOtpCode4, null)}
                    onKeyDown={(e) => handleKeyDown(e, otpCode3ref)}
                    style={{ flex: 1, marginLeft: '10px' }}
                  />
                </div>
                <div style={{marginTop : "5px"}}>
                {otpErrorMessage && (
                  <Form.Text className='text-danger error-message'>{otpErrorMessage}</Form.Text>
                )}
                 </div>
              </Form.Group>
              <div className='resend-timer'>
                <a href='' onClick={handleResendOtp} disabled={isResendDisabled}>
                  Resend code
                </a>
                <span>{formatTime(resendTimer)}</span>
              </div>
            </div>
          </Container>
          <div className="d-flex justify-content-center" style={{ width: "100%", gap: "30px" }}>
          <button  className='global-red-cencel-button'onClick={handleClosePhoneotp}>
            Cancel
          </button>
          <button  className="global-save-button"  type='submit'>
            Save
          </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default VerifyPhoneModal;
