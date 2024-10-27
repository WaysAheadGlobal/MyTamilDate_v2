import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from '../hooks/useCookies';
import { API_URL } from '../api';

// Context creation
const AppContext = createContext();

// Custom hook
export const useAppContext = () => useContext(AppContext);

// Context provider component
export const AppContextProvider = ({ children }) => {
  const { getCookie, setCookie, deleteCookie } = useCookies();

  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    birthday: "",
    gender: "",
    want_gender: "",
  });

  const [locations, setLocations] = useState({
    country: "",
    locations_string: ""
  })

  const [isAdmin, setIsAdmin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showFullPhoneNumberemail, setShowFullPhoneNumber] = useState(false);

  useEffect(() => {
    const userId = getCookie('userId');
    if (userId === 'adminlogin') {
      setIsAdmin(true);
    }
  }, [getCookie]);

  useEffect(() => {
    const token = getCookie('token');

    if (isAdmin) {
      return;
    }

    if (!token) {
      return;
    }

    (async () => {
      try {
        const response = await fetch(`${API_URL}customer/subscription/premium-info`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (response.ok) {
          setCookie('isPremium', data.isPremium, data.endsAt);
        }
      } catch (err) {
        console.error(err);
      }
    })()

  }, [window.location.pathname]);

  const loginAsAdmin = () => {
    setIsAdmin(true);
    setCookie('userId', 'adminlogin', 365);
  };

  const logout = () => {
    setIsAdmin(false);
    deleteCookie('userId');
  };

  const togglePhoneNumber = () => setShowFullPhoneNumber(!showFullPhoneNumberemail);

  return (
    <AppContext.Provider value={{ locations, setLocations, phoneNumber, setPhoneNumber, userDetails, setUserDetails, isAdmin, loginAsAdmin, logout, togglePhoneNumber, showFullPhoneNumberemail }}>
      {children}
    </AppContext.Provider>
  );
};
