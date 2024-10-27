// components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from '../../hooks/useCookies';



const Protected = ({ children }) => {
  const {getCookie} = useCookies();
  const Usertoken = getCookie('token')
  return Usertoken ? children : <Navigate to="/signinoptions" />;
};

export default Protected;
