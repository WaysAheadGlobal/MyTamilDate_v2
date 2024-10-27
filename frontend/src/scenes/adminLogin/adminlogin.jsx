import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, LinearProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAppContext } from '../../Context/UseContext';
import { useNavigate } from 'react-router-dom';
import { useCookies } from '../../hooks/useCookies';
import adminbackground from '../../assets/images/adminbackground.png';
import { API_URL } from '../../api';

const themeSettings = {
  typography: {
    fontFamily: ['"Inter"', 'sans-serif'].join(','),
    fontSize: 14,
    h1: {
      fontFamily: ['"Inter"', 'sans-serif'].join(','),
      fontSize: 40,
    },
    h2: {
      fontFamily: ['"Inter"', 'sans-serif'].join(','),
      fontSize: 32,
    },
    h3: {
      fontFamily: ['"Inter"', 'sans-serif'].join(','),
      fontSize: 24,
    },
    h4: {
      fontFamily: ['"Inter"', 'sans-serif'].join(','),
      fontSize: 20,
    },
    h5: {
      fontFamily: ['"Inter"', 'sans-serif'].join(','),
      fontSize: 16,
    },
    h6: {
      fontFamily: ['"Inter"', 'sans-serif'].join(','),
      fontSize: 14,
    },
  },
};

const theme = createTheme(themeSettings);

const AdminSignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCookie,getCookie } = useCookies();
  const { loginAsAdmin } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    if(username === "adminUser"){
      if(password === "X&>%cA9#%W2"){
        setCookie('Admintoken', "123456", 315);
           
        navigate("/approval");
      }
      else{
        setSnackbarMessage( 'Login failed');
        setShowSnackbar(true);
      }
    }
    else
    {
      setSnackbarMessage( 'Login failed');
        setShowSnackbar(true);
    }
    // try {
    //   const response = await fetch(`${API_URL}/admin/adminlogin/login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ username, password }),
    //   });

    //   const data = await response.json();
    //   setLoading(false);

    //   if (response.ok) {
    //     loginAsAdmin(data.token);
    //     setCookie('Admintoken', data.token, 315);
    //     console.log("get cook user Idddd", getCookie('Admintoken'));
    //     navigate("/dashboard");
    //   } else {
    //     setSnackbarMessage(data.message || 'Login failed');
    //     setShowSnackbar(true);
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   setSnackbarMessage('An error occurred. Please try again.');
    //   setShowSnackbar(true);
    // }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100dvh"
        sx={{
          background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
          backgroundSize: 'cover',
          backgroundColor: 'rgb(245, 245, 245)',
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={4}
          sx={{
            width: { xs: '90%', sm: '70%', md: '50%', lg: '30%', xl: '25%' },
            backgroundColor: '#FFFFFF',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h4" sx={{ color: '#333333', mb: 3 }}>
            Admin Login
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2, width: '100%', backgroundColor: '#F9F9F9' }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3, width: '100%', backgroundColor: '#F9F9F9' }}
          />
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              width: '100%',
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
              color: '#FFF',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(90deg, #F76A7B, #FC8C66)',
              },
            }}
          >
            Login
          </Button>
          {loading && <LinearProgress sx={{ width: '100%', mb: 2 }} />}
        </Box>
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(false)}
        >
          <Alert onClose={() => setShowSnackbar(false)} severity="error">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AdminSignIn;
