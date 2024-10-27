import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header1";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../api";
const Details = () => {
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


  const formatValue = (value) => {
    if (value === null || value === '' || value === undefined) {
      return "N/A";
    }
    return value;
  };

  if (!details) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 3,
        }}
      >
        <Header title="Promotional Codes Details" subtitle="" />
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            mt: { xs: 1, sm: 0 },
          }}
        >
          <Button variant="contained" color="secondary" onClick={() => navigate('/promotionalcodes')}>List</Button>
          <Button variant="contained" color="secondary" onClick={() => navigate(`/editpromotionalcode/${id}`)}>Edit</Button>
          <Button variant="contained" color="error" onClick={() => {
            fetch(`${API_URL}/admin/promotioncode/delete/${id}`, { method: "DELETE" })
              .then(() => navigate('/promotionalcodes'))
              .catch(error => console.error("Error deleting promotional code:", error));
          }}>Delete</Button>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography variant="h6" color={colors.primary[700]}>Promotion Code</Typography>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${colors.grey[300]}`,
                borderRadius: '8px',
                backgroundColor: colors.primary[50],
              }}
            >
              <Typography variant="body1">{formatValue(details.promo_id)}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography variant="h6" color={colors.primary[700]}>Amount Off</Typography>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${colors.grey[300]}`,
                borderRadius: '8px',
                backgroundColor: colors.primary[50],
              }}
            >
              <Typography variant="body1">{formatValue(details.amount_off)}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography variant="h6" color={colors.primary[700]}>Percent Off</Typography>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${colors.grey[300]}`,
                borderRadius: '8px',
                backgroundColor: colors.primary[50],
              }}
            >
              <Typography variant="body1">{formatValue(details.percent_off)}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography variant="h6" color={colors.primary[700]}>Available From</Typography>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${colors.grey[300]}`,
                borderRadius: '8px',
                backgroundColor: colors.primary[50],
              }}
            >
              <Typography variant="body1">{formatValue(new Date(details.available_from).toLocaleDateString())}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography variant="h6" color={colors.primary[700]}>Available To</Typography>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${colors.grey[300]}`,
                borderRadius: '8px',
                backgroundColor: colors.primary[50],
              }}
            >
              <Typography variant="body1">{formatValue(new Date(details.available_to).toLocaleDateString())}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography variant="h6" color={colors.primary[700]}>Max Redemptions</Typography>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${colors.grey[300]}`,
                borderRadius: '8px',
                backgroundColor: colors.primary[50],
              }}
            >
              <Typography variant="body1">{formatValue(details.max_redemptions)}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography variant="h6" color={colors.primary[700]}>Subscription Period</Typography>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${colors.grey[300]}`,
                borderRadius: '8px',
                backgroundColor: colors.primary[50],
              }}
            >
              <Typography variant="body1">{formatValue(details.subscription_period)}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography variant="h6" color={colors.primary[700]}>Once Per User</Typography>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${colors.grey[300]}`,
                borderRadius: '8px',
                backgroundColor: colors.primary[50],
              }}
            >
              <Typography variant="body1">{formatValue(details.once_per_user ? "Yes" : "No")}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Details;
