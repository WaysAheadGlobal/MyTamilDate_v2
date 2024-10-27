import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, LinearProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAppContext } from '../../Context/UseContext';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const themeSettings = {
  typography: {
    fontFamily: ['"Inter"', 'sans-serif'].join(','),
    fontSize: 14,
    h4: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  },
};

const theme = createTheme(themeSettings);

const ShowphoneAndEmail = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [otpSentSnackbar, setOtpSentSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const { loginAsAdmin, togglePhoneNumber } = useAppContext();
  const navigate = useNavigate();

  const generateOTP = () => {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(generatedOtp.split(''));
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSentSnackbar(true);
      setShowLoginButton(true);
    }, 1000);
  };

  const handleSendOTP = () => {
    if (phoneNumber === '1234567890') { // Replace with the correct phone number check
      generateOTP();
    } else {
      setSnackbarMessage('Phone number is incorrect');
      setShowSnackbar(true);
    }
  };

  const handleLogin = () => {
    // Handle login logic here
    alert('Your Able to See Phone And Email');
    loginAsAdmin();
    navigate("/dashboard");
    togglePhoneNumber();
  };
  const backtolist = ()=>{
    navigate("/contact")
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100dvh"
        sx={{
          background: 'rgb(245, 245, 245)',
          backgroundSize: 'cover',
          backgroundColor: 'rgb(245, 245, 245)',
        }}
      >
        <Box onClick={backtolist}>
          {CloseEvent}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={3}
          bgcolor="#FFFFFF"
          borderRadius={4}
          boxShadow="0px 3px 15px rgba(0, 0, 0, 0.1)"
          width={{ xs: '90%', sm: '70%', md: '50%', lg: '40%', xl: '30%' }}
        >
          <Typography variant="h6" sx={{ color: '#3A3A3A', mb: 2 }}>
            First Verify Your Phone Number
          </Typography>
          
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            sx={{ mb: 2, bgcolor: '#F9F9F9' }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSendOTP}
            sx={{
              mb:2,
              background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
              backgroundSize: 'cover',
              backgroundColor: 'rgb(245, 245, 245)',
            }}
          >
            Send OTP
          </Button>
          {loading && <LinearProgress sx={{ width: '100%', mb: 2 }} />}
          {otp.some(o => o !== '') && (
            <Box display="flex" justifyContent="center" mb={2}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  value={digit}
                  variant="outlined"
                  inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
                  sx={{ mx: 1, width: '3rem', bgcolor: '#F9F9F9' }}
                />
              ))}
            </Box>
          )}
          {showLoginButton && (
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleLogin}
              sx={{
                mb:2,
                background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
                backgroundSize: 'cover',
                backgroundColor: 'rgb(245, 245, 245)',
              }}
            >
              Submit
            </Button>
          )}
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
        <Snackbar
          open={otpSentSnackbar}
          autoHideDuration={6000}
          onClose={() => setOtpSentSnackbar(false)}
        >
          <Alert onClose={() => setOtpSentSnackbar(false)} severity="success">
            OTP sent successfully!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default ShowphoneAndEmail;
