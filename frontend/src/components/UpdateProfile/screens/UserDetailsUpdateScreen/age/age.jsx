import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Image } from 'react-bootstrap';
import { FaRegCalendar } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../../../Context/UseContext';
import { API_URL } from '../../../../../api';

import basicdetails from "../../../../../assets/images/basic-details.png";

import { useCookies } from '../../../../../hooks/useCookies';
import '../../../.././basic-details.css';
import { Popper } from '@mui/material';
import Sidebar from '../../../../userflow/components/sidebar/sidebar';

export const BasicDetailsUpdate = () => {
  const { getCookie } = useCookies();
  const { userDetails, setUserDetails } = useAppContext();
  const [errorMessage, setErrorMessage] = useState('');

  const [age, setAge] = useState(null);
  const navigate = useNavigate();
  const token = getCookie('token');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [adulthood, setAdulthood] = useState(true);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  useEffect(() => {
    // Fetch user profile details on mount
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
        if (data.birthday) {
          calculateAge(data.birthday);
        }
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, [setUserDetails]);




  const handleBirthdayChange = (value) => {
    setUserDetails(prevDetails => ({
      ...prevDetails,
      birthday: value
    }));
    calculateAge(value);
  };

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setAge(age);
  };

  const handleSubmit = (e) => {
    e.preventDefault();



    if (dayjs().diff(dayjs(userDetails.birthday), 'years') < 18) {
      setAdulthood(false);
      return;
    }

    fetch(`${API_URL}/customer/users/brithday`, {
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
          navigate("/updateprofile");
        }
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setErrorMessage('An error occurred while updating your profile.');
      });
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
        padding: "2rem"
      }}>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='basicdetails-container' style={{ overflow: 'hidden' }}>

            <Container className='basicdetails-main'>
              <Container className='basicdetails-content' style={{ width: "100%" }}>

                <Container className='basic-details-text'>
                  <Image className='basic-detail-icon' src={basicdetails}></Image>
                  <p>When is Your Birthday?</p>
                </Container>
                <Container className='basic-details-details' >
                  <Form onSubmit={handleSubmit} className='basic-details-form'>


                    <Form.Group controlId="formBirthday" className='basic-details-group'>
                      <Form.Label className='basic-details-label'></Form.Label>
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
                            placeholder="Day / Month / Year"
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
                          }} open={open}
                          anchorEl={anchorEl}
                          placement='bottom-start'
                        >
                          <DateCalendar
                            onChange={(value) => {
                              handleBirthdayChange(dayjs(value).format('YYYY-MM-DD'));
                            }}
                            disableFuture
                          />
                        </Popper>
                      </div>
                      {age !== null && age !== 54 && <span className='calculated-age'>Your age is {age}</span>}
                      {!adulthood && userDetails.birthday && <p className="text-danger error-message">You must be at least 18 years old</p>}
                    </Form.Group>

                    <div className="d-flex justify-content-center" style={{ position: "fixed", bottom: "30px", width: "100%", gap: "30px" }}>
                      <button className="global-cancel-button" onClick={() => navigate('/updateprofile')}>
                        Cancel
                      </button>
                      <button type="submit" className="global-save-button">
                        Save
                      </button>
                    </div>
                  </Form>
                </Container>
              </Container>
            </Container>
          </div>
        </LocalizationProvider>
      </div>
    </Sidebar>
  );
}

