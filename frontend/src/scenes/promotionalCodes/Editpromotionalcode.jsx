import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme
} from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { tokens } from "../../theme";
import Header from "../../components/Header1";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../api";
const EditDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/promotioncode/${id}`);
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error("Error fetching promotion code details:", error);
      }
    };

    fetchDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const handleDateChange = (name, date) => {
    setDetails({
      ...details,
      [name]: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/admin/promotioncode/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...details,
          available_from: details.available_from ? dayjs(details.available_from).format('YYYY-MM-DD') : null,
          available_to: details.available_to ? dayjs(details.available_to).format('YYYY-MM-DD') : null,
          once_per_user: details.once_per_user === "yes" ? 1 : 0,
        }),
      });
      if (response.ok) {
        console.log("Promotional code updated successfully!");
        navigate("/promotionalcodes");
      } else {
        console.error("Failed to update promotional code");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!details) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px">
      <Header title="Edit Promotional Code" subtitle="" />
      <form >
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <TextField
              name="promo_id"
              label="Promotion Code"
              value={details.promo_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
             
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              name="amount_off"
              label="Amount Off"
              value={details.amount_off}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              name="percent_off"
              label="Percent Off"
              value={details.percent_off}
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
              value={details.max_redemptions}
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
                value={details.applies_to}
                onChange={handleChange}
                label="Only For Subscription"
                required
              >
                <MenuItem value="1 month">Premium Account Subscription (1 Month)</MenuItem>
                <MenuItem value="2 months">Premium Account Subscription (2 Months)</MenuItem>
                <MenuItem value="3 months">Premium Account Subscription (3 Months)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Once Per User</InputLabel>
              <Select
                name="once_per_user"
                value={details.once_per_user ? "yes" : "no"}
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
                    value={dayjs(details.available_from)}
                    onChange={(date) => handleDateChange('available_from', date)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box ml={{ lg: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Available To"
                      value={dayjs(details.available_to)}
                      onChange={(date) => handleDateChange('available_to', date)}
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
          Save
        </Button>
      </form>
    </Box>
  );
};

export default EditDetails;
