import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Avatar, useMediaQuery } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Header from '../../components/Header1';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../api';
import { tokens } from "../../theme";




const UserDetails = () => {
  const theme = useTheme();
  const [details, setDetails] = useState({});
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const { id } = useParams();
  const OldImageURL = 'https://data.mytamildate.com/storage/public/uploads/user';
  const [images, setImages] = useState({
    main: null,
    first: null,
    second: null,
  });
  const [openModal, setOpenModal] = useState(false);
  const [reason, setReason] = useState('gg');

  console.log(reason);

  const ImageURL = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users/media/${id}`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log("datadaa", data);
      if (response.ok) {
        if (data[0].type === 31 || data[1].type === 31 || data[2].type === 31) {
          const others = data.filter(image => image.type === 32);
          const main = data.filter(image => image.type === 31)[0];
          console.log(others, main)
          setImages({
            main: API_URL + "media/avatar/" + main.hash + "." +  (main.extension === "png" ? "jpg" : main.extension),
            first: API_URL + "media/avatar/" + others[0].hash + "." + (others[0].extension === "png" ? "jpg" : others[0].extension),
            second: API_URL + "media/avatar/" + others[1].hash + "." + (others[1].extension === "png" ? "jpg" : others[1].extension),
          })
        }
        else {
          const others = data.filter(image => image.type === 2);
          const main = data.filter(image => image.type === 1)[0];
          console.log(others, main)
          setImages({
            main: OldImageURL + "/" + id + "/avatar/" + main.hash + "-large" + "." + (main.extension === "png" ? "jpg" : main.extension),
            first: OldImageURL + "/" + id + "/avatar/" + others[0].hash + "-large" + "." + (others[0].extension === "png" ? "jpg" : others[0].extension),
            second: OldImageURL + "/" + id + "/avatar/" + others[1].hash + "-large" + "." +(others[1].extension === "png" ? "jpg" : others[1].extension),
          })
        }
      }
    } catch (error) {
      console.error('Error saving images:', error);
    }
  }

  const fetchData = async () => {
    try {
      const data = await fetch(`${API_URL}/admin/users/customers/${id}`);
      const response = await data.json();
      setDetails(response[0]);
      console.log(details);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    ImageURL();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/updatestatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, approval: newStatus }),
      });

      if (!response.ok) {
        const errorDetails = await response.text(); // Get error details for debugging
        throw new Error(`Failed to update status: ${errorDetails}`);
      }

      // Fetch updated details after updating the status
      await fetchData();

      console.log("Status updated successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatusReject = async (newStatus) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/updatestatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, approval: newStatus, message: reason }),
      });

      if (!response.ok) {
        const errorDetails = await response.text(); // Get error details for debugging
        throw new Error(`Failed to update status: ${errorDetails}`);
      }

      // Fetch updated details after updating the status
      await fetchData();
      setOpenModal(false);
      navigate('/contacts')
      console.log("Status updated successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users/deleteuser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) {
        const errorDetails = await response.text(); // Get error details for debugging
        throw new Error(`Failed to delete user: ${errorDetails}`);
      }


      await fetchData();

      console.log('User deleted successfully');
    } catch (err) {
      console.error(err);
    }
  };


  const maskEmail = (email) => {
    if (!email) return 'N/A';
    const [localPart, domain] = email.split('@');
    const maskedLocalPart = localPart[0] + '****' + localPart.slice(-1);
    return `${maskedLocalPart}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2');
  };

  let status;
  const approvalStatuses = {
    10: 'Pending User',
    15: 'Disable',
    20: 'Approved',
    30: 'Rejected User',
    40: 'Incomplete Registration',
    25: 'Update Profile'
  };

  status = 'N/A';
  if (details.deleted_at) {
    status = 'Deleted';
  } else {
    status = approvalStatuses[details.approval] || 'N/A';
  }




  const handleApproveRequest = () => {
    updateStatus(20);
  };

  const handleRejectRequest = () => {
    setOpenModal(true);
  };

  const handleSaveReason = () => {
    // updateStatus(30);
    updateStatusReject(30)


  }


  const handleCloseModal = () => {
    setOpenModal(false);
  }
  const handleOpenReasonModal = () => {

  }

  return (
    <Box m="20px">
      <Header title="User Details" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={2}>
            <Avatar
              alt="User Image"
              src={images.main}
              sx={{ width: 250, height: 250, mb: 2 }}
            />
            <Typography variant="h5" align="center">{`${details.first_name || ''} ${details.last_name || ''}`}</Typography>
            <Typography variant="subtitle1" color="textSecondary" align="center">{status || 'N/A'}</Typography>
          </Box>

        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>First Name</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{details.first_name || "N/A"}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Last Name</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{details.last_name || "N/A"}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Status</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{status || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Payment Status</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{details.paymentStatus || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Email</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{maskEmail(details.email) || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Phone Number</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{maskPhone(details.phone) || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Birthday</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{details.birthday ? new Date(details.birthday).toLocaleDateString('en-US') : 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Gender</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">
                    {details.gender === 1 ? 'Male' : details.gender === 2 ? 'Female' : 'Other'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Location</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{details.country || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Study</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{details.study_name || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Job</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{details.job_name || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="h6" color={colors.primary[700]}>Growth</Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[300]}`,
                    borderRadius: '8px',
                    backgroundColor: colors.primary[50],
                  }}
                >
                  <Typography variant="body1">{details.growth_name || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>First Name</Typography>
                <Typography variant="body1">{details.first_name || 'N/A'}</Typography>
              </Box>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Status</Typography>
                <Typography variant="body1">{details.status || 'N/A'}</Typography>
              </Box>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Email</Typography>
                <Typography variant="body1">{details.email || 'N/A'}</Typography>
              </Box>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Birthday</Typography>
                <Typography variant="body1">{details.birthday ? new Date(details.birthday).toLocaleDateString('en-US') : 'N/A'}</Typography>
              </Box>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Location</Typography>
                <Typography variant="body1">{details.country || 'N/A'}</Typography>
              </Box>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Job</Typography>
                <Typography variant="body1">{details.job_name || 'N/A'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Last Name</Typography>
                <Typography variant="body1">{details.last_name || 'N/A'}</Typography>
              </Box>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Payment Status</Typography>
                <Typography variant="body1">{details.paymentStatus || 'N/A'}</Typography>
              </Box>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Phone Number</Typography>
                <Typography variant="body1">{details.phone || 'N/A'}</Typography>
              </Box>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Gender</Typography>
                <Typography variant="body1">{details.gender == 1 ? 'Male' : 'Female'}</Typography>
              </Box>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Study</Typography>
                <Typography variant="body1">{details.study_name || 'N/A'}</Typography>
              </Box>
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>Growth</Typography>
                <Typography variant="body1">{details.growth_name || 'N/A'}</Typography>
              </Box>
            </Grid>
          </Grid> */}
          <Box display="flex" gap="8px" flexDirection={isLgUp ? 'row' : 'column'} alignItems="center" justifyContent="center">
            <Box>
              <Grid
                container
                direction={isLgUp ? 'row' : 'column'}
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} lg={6} textAlign="center">
                  {details.approval === 10 && details.deleted_at == null ? (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: theme.palette.grey[900] }}
                      onClick={handleRejectRequest}
                    >
                      Reject
                    </Button>
                  ) : null}

                </Grid>
                <Grid item xs={12} lg={6} textAlign="center">
                  {details.approval === 10 && details.deleted_at == null ? (
                    <Button
                      sx={{
                        background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
                        color: '#fff',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
                        },
                      }}

                    >
                      Approve
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Grid
                container
                direction={isLgUp ? 'row' : 'column'}
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} lg={6} textAlign="center">
                  {details.deleted_at === null ? (
                    <Button variant="contained" color="error" >
                      Delete
                    </Button>
                  ) : null}
                </Grid>
                <Grid item xs={12} lg={6} textAlign="center">
                  {details.deleted_at === null ? (
                    <Button sx={{ width: "140px" }} variant="contained" color="error" >
                      Delete Request
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>


      </Grid>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}

        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            width: '350px',
            height: '300px',
          }
        }}
      >
        <DialogTitle>What's the reason?</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            type="text"
            fullWidth
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={5} // Adjust number of rows as needed
            sx={{
              '& .MuiInputBase-root': {
                height: '150px', // Adjust height as needed
              }
            }}
          />
        </DialogContent>
        <DialogActions  >
          <Button onClick={handleCloseModal} variant="contained" color="error" >
            Cancel
          </Button>
          <Button onClick={handleSaveReason} sx={{
            background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
            },
          }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDetails;
