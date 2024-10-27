// components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../Context/UseContext';
import { useCookies } from '../hooks/useCookies';

const ProtectedRoute = ({ children }) => {
  const {getCookie} = useCookies();
  const admintoken = getCookie('Admintoken')
  const { isAdmin } = useAppContext();

  return admintoken ? children : <Navigate to="/adminlogin" />;
};

export default ProtectedRoute;
