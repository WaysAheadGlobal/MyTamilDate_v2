import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Avatar, useMediaQuery, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import {   Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { json, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header1'; // Adjust path as per your project structure
import { tokens } from '../../theme'; // Adjust path as per your project structure
import { API_URL } from '../../api';

const photos = [
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lybCUyMGluJTIwc2FyZWV8ZW58MHx8MHx8fDA%3D',
  'https://i.pinimg.com/originals/9b/a1/42/9ba142690b2d0bddbc31f3918792c878.jpg',
  'https://i.pinimg.com/736x/a5/87/64/a58764eb4e9b9a49845ba9d804e97339.jpg',
];

const ReportDetails = () => {
  const [details, setDetails] = useState(null);
  const [update, setUpdate] = useState(false);
  const theme = useTheme();
  const isXsUp = useMediaQuery(theme.breakpoints.up('xs'));
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();
  const [quesAns, setQuesAns] = useState([]);
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const reasons = [
    "Hi there! Having a complete profile helps you connect better with others. Please complete your bio and add real images which clearly show your face.",
    "Hi there! Having a complete profile helps you connect better with others. Please complete your bio.",
    "Hi there! Having a complete profile helps you connect better with others. Please add real images which clearly show your face.",
    "Hi there! It's best to keep your conversation to MTD until you create a connection. Please remove your contact details from your profile's written bio (phone, social etc)."
  ];



  const handleSelectChange = (event) => {
    const selected = event.target.value;
    setSelectedReason(selected);
    setCustomReason('');
    setReason(selected);
  };

  const handleCustomReasonChange = (event) => {
    const customText = event.target.value;
    setCustomReason(customText);
    setSelectedReason('');
    setReason(customText);
  };
  const OldImageURL = 'https://data.mytamildate.com/storage/public/uploads/user';
  const [images, setImages] = useState({
    main: null,
    first: null,
    second: null,
  });

  const ImageURL = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users/media/${id}`, {
        method: 'GET',
      });
      const data = await response.json();
      // console.log("datadaa", data);
      if (response.ok) {
        if (data[0].type === 31 || data[1].type === 31 || data[2].type === 31) {
          const others = data.filter(image => image.type === 32);
          const main = data.filter(image => image.type === 31)[0];

          setImages({
            main: API_URL + "media/avatar/" + main.hash + "." + main.extension,
            first: API_URL + "media/avatar/" + others[0].hash + "." + others[0].extension,
            second: API_URL + "media/avatar/" + others[1].hash + "." + others[1].extension,
          })


          // console.log('imges', {
          //   main: API_URL + "media/avatar/" + main.hash + "." + main.extension,
          //   first: API_URL + "media/avatar/" + others[0].hash + "." + others[0].extension,
          //   second: API_URL + "media/avatar/" + others[1].hash + "." + others[1].extension,
          // })
        }
        else {
          const others = data.filter(image => image.type === 2);
          const main = data.filter(image => image.type === 1)[0];
          // console.log(others, main)
          setImages({
            main: OldImageURL + "/" + id + "/avatar/" + main.hash + "-large" + "." + main.extension,
            first: OldImageURL + "/" + id + "/photo/" + others[0].hash + "-large" + "." + main.extension,
            second: OldImageURL + "/" + id + "/photo/" + others[1].hash + "-large" + "." + main.extension,
          })
        }
      }
    } catch (error) {
      console.error('Error saving images:', error);
    }
  }

  const [images2, setImages2] = useState({
    main: null,
    first: null,
    second: null,
  });

  const ImageURL2 = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users/mediaupdate/${id}`, {
        method: 'GET',
      });
      const data = await response.json();
      // console.log("data", data);

      if (response.ok) {
        let images = {
          main: null,
          first: null,
          second: null,
        };

        if (data.length === 0) {
          console.log("No images available.");
        } else {
          const mainImage = data.find(image => image.type === 31);
          const otherImages = data.filter(image => image.type === 32);

          if (mainImage) {
            images.main = `${API_URL}media/avatar/${mainImage.hash}.${mainImage.extension}`;
          }

          if (otherImages.length > 0) {
            if (otherImages[0]) {
              images.first = `${API_URL}media/avatar/${otherImages[0].hash}.${otherImages[0].extension}`;
            }
            if (otherImages[1]) {
              images.second = `${API_URL}media/avatar/${otherImages[1].hash}.${otherImages[1].extension}`;
            }
          }

          if (!mainImage && otherImages.length === 0) {
            // Handling old image URLs
            const mainOldImage = data.find(image => image.type === 1);
            const otherOldImages = data.filter(image => image.type === 2);

            if (mainOldImage) {
              images.main = `${OldImageURL}/${id}/avatar/${mainOldImage.hash}-large.${mainOldImage.extension}`;
            }

            if (otherOldImages.length > 0) {
              if (otherOldImages[0]) {
                images.first = `${OldImageURL}/${id}/photo/${otherOldImages[0].hash}-large.${otherOldImages[0].extension}`;
              }
              if (otherOldImages[1]) {
                images.second = `${OldImageURL}/${id}/photo/${otherOldImages[1].hash}-large.${otherOldImages[1].extension}`;
              }
            }
          }
        }

        setImages2(images);
        // console.log('images', images);
      }
    } catch (error) {
      console.error('Error saving images:', error);
    }
  };


  const detailsfetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users/approval/${id}`);
      const data = await response.json();
      setDetails(data);
    } catch (err) {
      console.log(err);
    }
  };

  const quesAnsfetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users/user/questions/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.error('Resource not found');
          setQuesAns([]);
          return;
        }
        throw new Error(`Failed to fetch questions: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        setQuesAns([]);
      } else {
        setQuesAns(data);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setQuesAns([]);
    }
  };

  const GetUserFromUpdateMedia = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users/UpdateRequestedUser/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.error('Resource not found');
          return;
        }
        throw new Error(`Failed to update media data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.length !== 0) {
        setUpdate(true);
        console.log(update);
      } else {
        setUpdate(false);
      }
    } catch (err) {
      console.error('Internal Server Error:', err);
    }
  };

  const RejectedMediaUpdate = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/deleteMediaUpdate/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error('No data found for this user.');
          return;
        }
        throw new Error('Failed to delete media update data');
      }

      const data = await response.json();
      console.log('Delete response:', data);

      navigate('/approval')

    } catch (error) {
      console.error('Error:', error);

    }
  };

  const RejectedAnswerUpdate = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/deleteAnswerquestions/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error('No data found for this user.');
          return;
        }
        throw new Error('Failed to delete media update data');
      }

      const data = await response.json();
      console.log('Delete response:', data);

      navigate('/approval')

    } catch (error) {
      console.error('Error:', error);

    }
  };

  const Updateanddeletemedia = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users/replaceMediaData/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error('Resource not found');

          return;
        }
        throw new Error(`Failed to update media data: ${response.statusText}`);
      } else {
        console.log("Data updated successfully");
        navigate('/approval')
      }
    } catch (err) {
      console.error('Error occurred while updating media data:', err);
    }
  };

  const UpdateanddeleteQuestionAnswer = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users/updateQuestionAnswers/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error('Resource not found');

          return;
        }
        throw new Error(`Failed to update Answer data: ${response.statusText}`);
      } else {
        console.log("Question updated successfully");
        navigate('/approval')
      }
    } catch (err) {
      console.error('Error occurred while updating media data:', err);
    }
  };

  const UpdateProfileapproval = () => {
    UpdateanddeleteQuestionAnswer();
    Updateanddeletemedia();
  }


  useEffect(() => {
    quesAnsfetchData();
    detailsfetchData();
    GetUserFromUpdateMedia();
    ImageURL();
    ImageURL2();
  }, [id]);

  const handleRemoveFromList = () => {
    console.log('Removing user from list');
  };

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
        const errorDetails = await response.text();
        throw new Error(`Failed to update status: ${errorDetails}`);
      }

      await detailsfetchData();
      navigate("/approval");
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
      await detailsfetchData();
      handleCloseModal();
      navigate('/approval')
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
        const errorDetails = await response.text();
        throw new Error(`Failed to delete user: ${errorDetails}`);
      }

      await detailsfetchData();
      navigate("/approval");
      console.log('User deleted successfully');
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveRequest = () => {
    updateStatus(20);
  };


  const handleRejectReason = () => {
    setOpenModal(true);
  };

  const handleRejectRequest = () => {
    updateStatus(30);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setReason('');
  };

  const handleSaveReason = () => {
    updateStatusReject(30);
  };

  const handleAcceptUpdate = () => {
    Updateanddeletemedia();
  }

  const handleRejectUpdate = () => {
    RejectedMediaUpdate();
    RejectedAnswerUpdate();

  }

  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const maskEmail = (email) => {
    if (!email) return 'N/A';
    const [user, domain] = email.split('@');
    const maskedUser = user.length > 2 ? user[0] + '*'.repeat(user.length - 2) + user.slice(-1) : user[0] + '*';
    return `${maskedUser}@${domain}`;
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'N/A';
    if (phoneNumber.length >= 6) {
      const visibleDigits = 3;
      const maskedSection = phoneNumber.substring(visibleDigits, phoneNumber.length - visibleDigits).replace(/\d/g, '*');
      const visiblePart = phoneNumber.substring(0, visibleDigits) + maskedSection + phoneNumber.substring(phoneNumber.length - visibleDigits);
      return visiblePart;
    }
    return phoneNumber;
  };


  const formatValue = (key, value) => {
    if (key.toLowerCase() === 'email') {
      return value;
    }

    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    if (key.toLowerCase() === 'email') {

      return value;

    }
    if (key.toLowerCase() === 'phone') {
      return value;
    }

    if (key.toLowerCase() === 'approval') {
      return 'Approved'
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return value;
  };

  if (!details) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px">
      <Header title="User Details" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2} mt={2}>
            <Box mb={2}>

              <Avatar

                alt={`Photo`}
                src={images.main}
                variant="square"
                sx={{ width: '100%', height: '250px', borderRadius: '16px', mb: 4 }}
              />

              
             
                  <>
                    <Avatar
                      alt={`Photo`}
                      src={images.first}
                      variant="square"
                      sx={{ width: '100%', height: '250px', borderRadius: '16px', mb: 4 }}
                    />
                    <Avatar
                      alt={`Photo`}
                      src={images.second}
                      variant="square"
                      sx={{ width: '100%', height: '250px', borderRadius: '16px', mb: 4 }}
                    />
                  </>
               
              

            </Box>
            <Typography variant="h5" align="center">{`${formatValue('name', details.Name)} ${formatValue('surname', details.Surname)}`}</Typography>
            <Typography variant="subtitle1" color="textSecondary" align="center">{formatValue('status', details.status === 15 ? "Reject" : "pending")}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {Object.entries(details).map(([key, value]) => {
              if (key !== 'answers' && key !== 'personalities' && key !== 'photos') {
                return (
                  <Grid item xs={12} lg={6} key={key}>
                    <Box mb={2}>
                      <Typography variant="h6" color={colors.primary[700]}>{formatKey(key)}</Typography>
                      <Box
                        sx={{
                          p: 2,
                          border: `1px solid ${colors.grey[300]}`,
                          borderRadius: '8px',
                          backgroundColor: colors.primary[50],
                        }}
                      >
                        <Typography variant="body1">{formatValue(key, value)?.split(",")?.join(", ") ?? "N/A"}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                );
              }
              return null;
            })}
            <Grid item xs={12}>
              {quesAns.length > 0 && (
                <Box mb={4}>
                  <Typography variant="h4" gutterBottom sx={{ color: colors.primary[500] }}>Question & Answers</Typography>
                  {quesAns.map((item, index) => (
                    <Box key={index} mb={2}>
                      <Typography fontWeight="bold" variant="h6">{item.question}</Typography>
                      <Typography variant="body1">{item.answer}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
          <Box display="flex" gap="8px" flexDirection={isLgUp ? 'row' : 'column'} alignItems="center" justifyContent="center">
            {/* <Box>
              {
                update ? (<Grid
                  container
                  direction={isLgUp ? 'row' : 'column'}
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={12} lg={6} textAlign="center">
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: theme.palette.grey[900] }}
                      onClick={handleRejectUpdate}
                    >
                      Reject
                    </Button>
                  </Grid>
                  <Grid item xs={12} lg={6} textAlign="center">
                    <Button
                      sx={{
                        background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
                        color: '#fff',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
                        },
                      }}
                      onClick={UpdateProfileapproval}
                    >
                      Update
                    </Button>
                  </Grid>
                </Grid>) : (<Grid
                  container
                  direction={isLgUp ? 'row' : 'column'}
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={12} lg={6} textAlign="center">
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: theme.palette.grey[900] }}
                      onClick={handleRejectReason}
                    >
                      Reject
                    </Button>
                  </Grid>
                  <Grid item xs={12} lg={6} textAlign="center">
                    <Button
                      sx={{
                        background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
                        color: '#fff',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
                        },
                      }}
                      onClick={handleApproveRequest}
                    >
                      Approve
                    </Button>
                  </Grid>
                </Grid>)
              }


            </Box> */}
            <Box>
              <Grid
                container
                direction={isLgUp ? 'row' : 'column'}
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} lg={6} textAlign="center">
                  <Button variant="contained" color="error" >
                    Delete
                  </Button>
                </Grid>
                <Grid item xs={12} lg={6} textAlign="center">
                  <Button sx={{ width: "140px" }} variant="contained" color="error" >
                    Delete Request
                  </Button>
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
          width: '360px',
          height: '400px',
        }
      }}
    >
      <DialogTitle>What's the reason?</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel>Select a reason</InputLabel>
          <Select
            value={selectedReason}
            onChange={handleSelectChange}
            label="Select a reason"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 'calc(360px - 32px)',
                  whiteSpace: 'normal',
                },
              },
            }}
          >
            {reasons.map((reason, index) => (
              <MenuItem key={index} value={reason} sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {reason}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          autoFocus
          margin="dense"
          label="Reason"
          type="text"
          fullWidth
          variant="outlined"
          value={customReason}
          onChange={handleCustomReasonChange}
          multiline
          rows={5}
          sx={{
            marginTop: '16px',
            '& .MuiInputBase-root': {
              height: '150px',
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} variant="contained" color="error">
          Cancel
        </Button>
        <Button
          onClick={() => handleSaveReason(reason)}
          sx={{
            background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default ReportDetails;

