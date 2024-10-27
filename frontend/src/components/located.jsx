import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './located.css';
import { useNavigate } from 'react-router-dom';
import { Container, Image, Button, Form, Spinner } from 'react-bootstrap';
import backarrow from "../assets/images/backarrow.jpg";
import logo from "../assets/images/MTDlogo.png";
import responsivebg from "../assets/images/responsive-bg.png";
import location from "../assets/images/location.png";
import { useCookies } from '../hooks/useCookies';
import { API_URL } from '../api';
import { FaAngleDown } from "react-icons/fa6";


export const Located = () => {
  const navigate = useNavigate();
  const { getCookie } = useCookies();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const countrySelectRef = useRef(null);
  const citySelectRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageCity, setErrorMessageCity] = useState('');
  const [loadingCountries, setLoadingCountries] = useState(true); // Loading state for countries
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_URL}/customer/users/location-options`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`
        },
      });
      const data = await response.json();
      console.log(data);
      setOptions(data);
      setCountryOptions(Object.keys(data));
      setLoadingCountries(false);
    })()
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_URL}/customer/users/locations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`
        },
      });
      const data = await response.json();
      console.log(data);
      setSelectedCountry(data.country);
      setCountrySearch(data.country);
      setSelectedCity(data.id);
      setCitySearch(data.location_string);
    })()
  }, [])

  const handleCountrySelect = (country) => {

    setSelectedCountry(country);
    setSelectedCity(null);
    setErrorMessage("");
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Selected Country:', selectedCountry);
    console.log('Selected City:', selectedCity);
    if (!selectedCountry) {
      setErrorMessage("*Please fill out the required fields.");
      return;
    }
    if (!selectedCity) {
      setErrorMessageCity("*Please fill out the required fields.");
      return;
    }
    // Make POST request to save location
    fetch(`${API_URL}/customer/users/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('token')}`
      },

      body: JSON.stringify({
        location_id: selectedCity,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Location saved:', data);
        navigate("/religion");
      })
      .catch(error => console.error('Error saving location:', error));
  };

  return (
    <div className='located-container'>
      <div className='located-bg'>
        <Image className='responsive-bg' src={responsivebg}></Image>
      </div>
      <Container className='located-main'>
        <Container className='located-content'>
          <Container className='logo-progressbar7'>
            <Container className='logo-arrow7'>
              <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
              <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
            </Container>
            <div className='track-btn7'>
              <div></div>
            </div>
          </Container>
          <Container className='located-text'>
            <Image className='about-yourself-icon' src={location}></Image>
            <p>Where are you located?</p>
          </Container>
          <Container className='located-details'>
            <Container ref={countrySelectRef} className='located-country collasped'>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }} onClick={() => {
                countrySelectRef.current.classList.toggle("collasped");
              }}>
                <input type="text" placeholder='Select a country' value={countrySearch} onChange={(e) => setCountrySearch(e.currentTarget.value)} />
                <FaAngleDown size={16} style={{ marginRight: "1rem" }} />
              </div>
              <div className='scroll-container-vertical'>
                {
                  loadingCountries ? (
                    <Spinner animation="border" size="sm" style={{
                      marginTop: "17px",
                      marginLeft : "10px"
                    }} /> // Loading spinner for countries
                  ) : (
                    !countrySearch && (
                      <>
                        <div
                          className={`scroll-item ${selectedCountry === "Canada" ? 'selected' : ''}`}
                          onClick={() => {
                            handleCountrySelect("Canada")
                            setCountrySearch("Canada")
                            countrySelectRef.current.classList.add("collasped");
                          }}
                        >
                          {"Canada"}
                        </div>
                        <div
                          className={`scroll-item ${selectedCountry === "United States" ? 'selected' : ''}`}
                          onClick={() => {
                            handleCountrySelect("United States")
                            setCountrySearch("United States")
                            countrySelectRef.current.classList.add("collasped");
                          }}
                        >
                          {"United States"}
                        </div>
                        <div
                          className={`scroll-item ${selectedCountry === "United Kingdom" ? 'selected' : ''}`}
                          onClick={() => {
                            handleCountrySelect("United Kingdom")
                            setCountrySearch("United Kingdom")
                            countrySelectRef.current.classList.add("collasped");
                          }}
                        >
                          {"United Kingdom"}
                        </div>
                        {
                          countryOptions.filter(c => !["Canada", "United States", "United Kingdom"].includes(c)).sort((a, b) => a.localeCompare(b)).map((country) => (
                            <div
                              key={country}
                              className={`scroll-item ${selectedCountry === country ? 'selected' : ''}`}
                              onClick={() => {
                                handleCountrySelect(country)
                                setCountrySearch(country)
                                countrySelectRef.current.classList.add("collasped");
                              }}
                            >
                              {country}
                            </div>
                          ))}
                      </>
                    )
                  )
                }
                {
                  countrySearch && countryOptions.filter(country => country?.toLowerCase().includes(countrySearch.toLowerCase())).sort((a, b) => a.localeCompare(b)).map((country) => (
                    <div
                      key={country}
                      className={`scroll-item ${selectedCountry === country ? 'selected' : ''}`}
                      onClick={() => {
                        handleCountrySelect(country)
                        setCountrySearch(country)
                        countrySelectRef.current.classList.add("collasped");
                      }}
                    >
                      {country}
                    </div>
                  ))
                }
              </div>
            </Container>
            <div style={{ marginTop: "-7px" }}>

              {errorMessage && <Form.Text className="text-danger error-message">{errorMessage}</Form.Text>}
            </div>
            {selectedCountry && (
              <Container ref={citySelectRef} className="located-city collapsed">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Select a city"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.currentTarget.value)}
                    style={{ flexGrow: 1, paddingRight: '2rem' }} // Ensure space for the icon
                  />
                  <FaAngleDown
                    size={16}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      citySelectRef.current.classList.toggle('collapsed');
                    }}
                  />
                </div>
                <div className="scroll-container-vertical">
                  {!citySearch &&
                    options[selectedCountry]
                      ?.filter((city) => city.location_string?.trim() !== '')
                      ?.sort((a, b) => a.location_string?.localeCompare(b.location_string))
                      ?.map((city) => (
                        <div
                          key={city.id}
                          className={`scroll-item ${selectedCity === city.id ? 'selected' : ''}`}
                          onClick={() => {
                            handleCitySelect(city.id);
                            setCitySearch(city.location_string);
                            citySelectRef.current.classList.add("collasped");
                          }}
                        >
                          {city.location_string}
                        </div>
                      ))}

                  {citySearch &&
                    options[selectedCountry]
                      .filter((city) =>
                        city.location_string?.toLowerCase().includes(citySearch.toLowerCase())
                      )
                      ?.sort((a, b) => a.location_string?.localeCompare(b.location_string))
                      ?.map((city) => (
                        <div
                          key={city.id}
                          className={`scroll-item ${selectedCity === city.id ? 'selected' : ''}`}
                          onClick={() => {
                            handleCitySelect(city.id);
                            setCitySearch(city.location_string);
                            citySelectRef.current.classList.add('collapsed');
                          }}
                        >
                          {city.location_string}
                        </div>
                      ))}
                </div>
              </Container>
            )}

            <div style={{ marginTop: "-7px" }}>

              {errorMessageCity && <Form.Text className="text-danger error-message">{errorMessageCity}</Form.Text>}
            </div>
          </Container>
          {/* <Button variant="primary" type="submit" className='located-nxt-btn' onClick={handleSubmit}>
            Next
          </Button> */}
          <button type="submit" className='global-next-bottom-fix-btn' onClick={handleSubmit}>
            Next
          </button>
        </Container>
      </Container>
    </div>
  );
};
