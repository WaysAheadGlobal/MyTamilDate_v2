import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './located.css';
import { useNavigate } from 'react-router-dom';
import { Container, Image, Button } from 'react-bootstrap';
import backarrow from "../../../../../assets/images/backarrow.jpg";
import logo from "../../../../../assets/images/MTDlogo.png";
import responsivebg from "../../../../../assets/images/responsive-bg.png";
import location from "../../../../../assets/images/location.png";
import { useCookies } from '../../../../../hooks/useCookies';
import { API_URL } from '../../../../../api';
import { FaAngleDown } from "react-icons/fa6";
import Sidebar from '../../../../userflow/components/sidebar/sidebar';


export const LocatedUpdate = () => {
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
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Selected Country:', selectedCountry);
    console.log('Selected City:', selectedCity);

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
        setSelectedCountry(null);
        setSelectedCity(null);
        console.log('Location saved:', data);
        navigate("/updateprofile");
      })
      .catch(error => console.error('Error saving location:', error));
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
                overflow: "hidden", 
                padding : "2rem"
            }}>
   
    <div className='located-container' style={{ overflow: 'hidden',width : "100%" }}>
      <div className='located-main' style={{width : "100%"}}>
        <div className='located-content' >
          <div className='located-text' style={{width : "100%"}}>
            <Image className='about-yourself-icon' src={location}></Image>
            <p>Where are you located?</p>
          </div>
          <div className='located-details'>
            <div ref={countrySelectRef} className='located-country collasped' style={{
              width : "270px", marginLeft : "10px"
            }}>
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
                {!countrySearch && countryOptions.map((country) => (
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
                {
                  countrySearch && countryOptions.filter(country => country?.toLowerCase().includes(countrySearch.toLowerCase())).map((country) => (
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
            </div>
            {selectedCountry && (
  <div ref={citySelectRef} style={{ width: "270px", marginLeft: "10px" }} className="located-city collasped">
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onClick={() => {
        citySelectRef.current.classList.toggle("collasped");
      }}
    >
      <input
        type="text"
        placeholder="Select a city"
        value={citySearch}
        onChange={(e) => setCitySearch(e.currentTarget.value)}
      />
      <FaAngleDown size={16} style={{ marginRight: "1rem" }} />
    </div>
    <div className="scroll-container-vertical">
      {!citySearch && options[selectedCountry] && options[selectedCountry].map((city) => (
        <div
          key={city.id}
          className={`scroll-item ${selectedCity === city.id ? "selected" : ""}`}
          onClick={() => {
            handleCitySelect(city.id);
            setCitySearch(city.location_string);
            citySelectRef.current.classList.add("collasped");
          }}
        >
          {city.location_string}
        </div>
      ))}
      {citySearch && options[selectedCountry] && options[selectedCountry]
        .filter((city) => city.location_string?.toLowerCase().includes(citySearch.toLowerCase()))
        .map((city) => (
          <div
            key={city.id}
            className={`scroll-item ${selectedCity === city.id ? "selected" : ""}`}
            onClick={() => {
              handleCitySelect(city.id);
              setCitySearch(city.location_string);
              citySelectRef.current.classList.add("collasped");
            }}
          >
            {city.location_string}
          </div>
        ))}
    </div>
  </div>
)}

          </div>
          {/* <Button variant="primary" type="submit" className='located-nxt-btn' onClick={handleSubmit}>
            Next
          </Button> */}
          <div className="d-flex justify-content-center" style={{ position: "fixed", bottom: "30px", width: "100%", gap : "30px" }}>
    <button className="global-cancel-button" onClick={()=> navigate("/updateprofile")}>
        Cancel
    </button>
    <button onClick={handleSubmit} type="submit" className="global-save-button">
        Save
    </button>
</div>
        </div>
      </div>
    </div>
    </div>
    </Sidebar>
  );
};
