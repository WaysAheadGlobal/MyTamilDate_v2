import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Image } from 'react-bootstrap';
import { FaRegCalendar } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Context/UseContext';
import { API_URL } from '../api';
import logo from "../assets/images/MTDlogo.png";
import logo2 from "../assets/images/logo2.png";
import backarrow from "../assets/images/backarrow.jpg";
import basicdetails from "../assets/images/basic-details.png";
import responsivebg from "../assets/images/responsive-bg.png";
import { useCookies } from '../hooks/useCookies';
import './basic-details.css';
import { Popper } from '@mui/material';

export const BasicDetails = () => {
  const { getCookie } = useCookies();
  const { userDetails, setUserDetails } = useAppContext();
  const [errorMessage, setErrorMessage] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [age, setAge] = useState(null);
  const navigate = useNavigate();
  const token = getCookie('token');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [adulthood, setAdulthood] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null); // Initialize with null
  const[errorBrithday, setErrorBrithday] = useState("");

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  useEffect(() => {
  
    fetch(`${API_URL}/customer/users/namedetails`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        setUserDetails(data);
        console.log(data);
        if (data.birthday) {
          setSelectedDate(dayjs(data.birthday)); // Set the initial selected date
          calculateAge(data.birthday);
        }
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, [setUserDetails]);

  const handleNameChange = (e) => {
    setErrorMessage("");
    const value = e.target.value.replace(/[^a-zA-Z]/g, '');
    setUserDetails(prevDetails => ({
      ...prevDetails,
      first_name: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    }));
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, '');
    setUserDetails(prevDetails => ({
      ...prevDetails,
      last_name: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    }));
  };

  const handleBirthdayChange = (value) => {
    const date = dayjs(value);
    if (date.isValid()) {
      setSelectedDate(date); // Update the selected date state
      setUserDetails(prevDetails => ({
        ...prevDetails,
        birthday: date.format('YYYY-MM-DD')
      }));
      calculateAge(date);
    }
  };

  const calculateAge = (birthday) => {
    setErrorBrithday("");
    setAdulthood(true);
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setAge(age);
  };
  
  const updatePreferences = (calculatedAge) => {
    let age_from = calculatedAge - 5;
    let age_to = calculatedAge + 5;

    // Ensure age_from is at least 18 if the user's age is less than 23
    if (calculatedAge < 23) {
        age_from = Math.max(age_from, 18);
    }

    const preferencesPayload = {
        age_from,
        age_to,
    };

    fetch(`${API_URL}customer/user/preferences/save/age`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(preferencesPayload),
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors) {
            setErrorMessage(data.errors.map(error => error.msg).join(', '));
        } else {
            console.log("Preferences updated successfully:", data);
            navigate("/abtyourself"); // Redirect to the next page if needed
        }
    })
    .catch(error => {
        console.error('Error updating preferences:', error);
        setErrorMessage('An error occurred while updating your preferences.');
    });
};
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!userDetails.first_name) {
      setErrorMessage('*Please fill out the required fields.');
      return;
    }
    if(userDetails.first_name.length < 2){
      setErrorMessage('*Name must be at least two letters long.');
      return;
    }
    if(!userDetails.birthday)
      {
        setErrorBrithday("*Please select your birth date.");
        return;
      }
    if (userDetails.first_name.includes('@') || userDetails.first_name.includes('#') || userDetails.first_name.includes('$') || userDetails.first_name.includes('%') || userDetails.first_name.includes('^') || userDetails.first_name.includes('&') || userDetails.first_name.includes('*') || userDetails.first_name.includes('(') || userDetails.first_name.includes(')') || userDetails.first_name.includes('-') || userDetails.first_name.includes('+') || userDetails.first_name.includes('=') || userDetails.first_name.includes('[') || userDetails.first_name.includes(']') || userDetails.first_name.includes('{') || userDetails.first_name.includes('}') || userDetails.first_name.includes('|') || userDetails.first_name.includes('\\') || userDetails.first_name.includes(';') || userDetails.first_name.includes(':') || userDetails.first_name.includes('\'') || userDetails.first_name.includes('"') || userDetails.first_name.includes('<') || userDetails.first_name.includes('>') || userDetails.first_name.includes(',') || userDetails.first_name.includes('.') || userDetails.first_name.includes('/') || userDetails.first_name.includes('?') || userDetails.first_name.includes('!') || userDetails.first_name.includes('`') || userDetails.first_name.includes('~')) {
      setErrorMessage('*Please enter a valid name');
      return;
    }

    if (dayjs().diff(dayjs(userDetails.birthday), 'years') <= 18) {
      setAdulthood(false);
      return;
    }

    const calculatedage = dayjs().diff(dayjs(userDetails.birthday), 'years');

    fetch(`${API_URL}/customer/users/namedetails`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userDetails)
    })
      .then(response => response.json())
      .then(data => {
        if (data.errors) {
          setErrorMessage(data.errors.map(error => error.msg).join(', '));
        } else {
          setErrorMessage('');
          console.log(data);
          navigate("/abtyourself");
          updatePreferences(calculatedage);
        }
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setErrorMessage('An error occurred while updating your profile.');
      });
  };

  const toggleInfoVisibility = () => {
    setShowInfo(!showInfo);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='basicdetails-container'>
        {
          open && <div
            style={{
              position: 'fixed',
              inset: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              zIndex: 10
            }}
            onClick={() => setAnchorEl(null)}
          ></div>
        }
        <div className='basic-details-bg'>
          <Image className='responsive-bg' src={responsivebg}></Image>
        </div>
        <Container className='basicdetails-main'>
          <Container className='basicdetails-content'>
            <Container className='logo-progressbar4'>
              <Container className='logo-arrow4'>
                <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
                <Image src={logo2} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
              </Container>
              <div className='track-btn4'>
                <div></div>
              </div>
            </Container>
            <Container className='basic-details-text'>
              <Image className='basic-detail-icon' src={basicdetails}></Image>
              <p>Tell us about yourself</p>
            </Container>
            <Container className='basic-details-details'>
              <Form onSubmit={handleSubmit} className='basic-details-form'>
                <Form.Group controlId="formName" className='basic-details-group'>
                  <Form.Label className='basic-details-label'>What's your name?</Form.Label>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Form.Control
                      className={`basic-details-input custom-input ${errorMessage ? 'error' : ''}`}
                      type="text"
                      placeholder="First name"
                      value={userDetails.first_name || ''}
                      onChange={handleNameChange}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div style={{marginTop : "5px"}}>

                  {errorMessage && <Form.Text className="text-danger error-message">{errorMessage}</Form.Text>}
                  </div>
                </Form.Group>

                <Form.Group controlId="formLastName" className='basic-details-group purplebox'>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Form.Control
                      className="basic-details-input-verify custom-input"
                      type="text"
                      placeholder="Last name (Optional)"
                      value={userDetails.last_name || ''}
                      onChange={handleLastNameChange}
                      style={{ flex: 1, marginTop: '12px', marginBottom: '24px' }}
                    />
                    <div className="last-name-why-div">
                      <Button className='last-name-why' onClick={toggleInfoVisibility}>
                        ?
                      </Button>
                    </div>
                  </div>
                  <Container className={`why-info ${showInfo ? '' : 'why-info-hidden'}`}>
                    <span>Why last name?</span>
                    <p>It helps us to build a trusted and authentic community for you and others. Only your first name is shown publicly.</p>
                  </Container>
                </Form.Group>
                <Form.Group controlId="formBirthday" className='basic-details-group'>
                  <Form.Label className='basic-details-label'>When is your birthday?</Form.Label>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: "relative" }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        cursor: 'pointer',
                        border: '1px solid black',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                      onClick={handleClick}
                    >
                      <Form.Control
                        className={`basic-details-input-verify custom-input ${errorMessage ? 'error' : ''}`}
                        type="text"
                        placeholder="Year / Month / Day"
                        value={userDetails.birthday || ''}
                        style={{ flex: 1, border: 0, cursor: 'pointer' }}
                        readOnly
                      />
                      <FaRegCalendar style={{
                        marginRight: '10px',
                      }} />
                    </div>
                    <Popper
                      sx={{
                        backgroundColor: 'white',
                        zIndex: 9999,
                        borderRadius: "10px",
                        border: "1px solid black",
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      placement='bottom-start'
                    >
                      <DateCalendar
                        value={selectedDate} // Set the initial selected date
                        onChange={(value) => {
                          handleBirthdayChange(dayjs(value).format('YYYY-MM-DD'));
                        }}
                        disableFuture
                      />
                    </Popper>
                  </div>
                  <div style={{marginTop : "5px"}}>
                  {errorBrithday && <Form.Text className="text-danger error-message">{errorBrithday}</Form.Text>}
                  
                  {age !== null && age !== 54 && <span className='calculated-age'>Your age will be displayed as {age}</span>}
                  {!adulthood && userDetails.birthday && <p  className="text-danger error-message" >You must be over 19 to join MTD</p>}
                  </div>
                </Form.Group>

                {/* <Button variant="primary" type="submit" className='basic-details-btn'>
                  Next
                </Button> */}
                <button  type="submit" className='global-next-bottom-fix-btn'>
                                Next
                            </button>
              </Form>
            </Container>
          </Container>
        </Container>
      </div>
    </LocalizationProvider>
  );
}

export default BasicDetails;
