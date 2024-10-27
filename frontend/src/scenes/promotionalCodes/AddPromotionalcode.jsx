import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, MenuItem, Select, FormControl, InputLabel, useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { tokens } from "../../theme";
import { useNavigate } from 'react-router-dom';

import { API_URL } from '../../api';
import { useAlert } from '../../Context/AlertModalContext';


const AddPromotionalCode = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const alert = useAlert();

  const [formData, setFormData] = useState({
    promo_id: "",         
    amount_off: "", 
    percent_off: "", 
    available_from: null, 
    available_to: null, 
    max_redemptions: "", 
    applies_to: "", 
    once_per_user: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date, 
    });
  };


  const handleSubmit = async (e) => {
           
    e.preventDefault();
    console.log(formData);
    if(Number(formData.percent_off) > 100 ){
      console.log("if conditions")
      alert.setModal({
        title : "Error",
        message : "Percent Off cannot be greater than 100",
        show : true,
        onButtonClick : ()=> {}
      })
      return
    }
    try {

      const amountOffValue = formData.amount_off ? Math.round(parseFloat(formData.amount_off) * 100) : null;
  
      // Log formData and amountOffValue for debugging
      console.log('Form Data:', formData);
      console.log('Amount Off Value:', amountOffValue);
  
      const response = await fetch(`${API_URL}/admin/promotioncode/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount_off: amountOffValue,
          available_from: formData.available_from ? formData.available_from.format('YYYY-MM-DD') : null,
          available_to: formData.available_to ? formData.available_to.format('YYYY-MM-DD') : null,
          once_per_user: formData.once_per_user === "yes" ? 1 : 0,
        }),
      });
  
      if (response.ok) {
        console.log("Promotional code added successfully!");
        navigate("/promotionalcodes");
      } else {
        console.error("Failed to add promotional code");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <Box m="20px">
      <Typography variant="h2">Add Promotional Code</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <TextField
              name="promo_id"
              label="Promotion Code"
              value={formData.promo_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              name="amount_off"
              label="Amount Off"
              value={formData.amount_off}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              name="percent_off"
              label="Percent Off"
              value={formData.percent_off}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              name="max_redemptions"
              label="Max Redemptions"
              value={formData.max_redemptions}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Only For Subscription</InputLabel>
              <Select
                name="applies_to"
                value={formData.applies_to}
                onChange={handleChange}
                label="Only For Subscription"
                required
              >
                <MenuItem value={process.env.REACT_APP_STRIPE_PRODUCT_ID_1_MONTHS}>Premium Account Subscription (1 Month)</MenuItem>
                <MenuItem value={process.env.REACT_APP_STRIPE_PRODUCT_ID_3_MONTHS}>Premium Account Subscription (3 Months)</MenuItem>
                <MenuItem value={process.env.REACT_APP_STRIPE_PRODUCT_ID_6_MONTHS}>Premium Account Subscription (6 Months)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Once Per User</InputLabel>
              <Select
                name="once_per_user"
                value={formData.once_per_user}
                onChange={handleChange}
                label="Once Per User"
                required
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Available From"
                    value={formData.available_from}
                    onChange={(date) => handleDateChange('available_from', date)}
                    required
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box ml={{ lg: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Available To"
                      value={formData.available_to}
                      onChange={(date) => handleDateChange('available_to', date)}
                      required
                      renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" sx={{
          mt: 3,
          background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
          },
        }}>
          Add Code
        </Button>
      </form>
    </Box>
  );
};

export default AddPromotionalCode;
