import React, { useEffect, useState } from 'react';
import { Box, Typography,CircularProgress, } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header1';
import { useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../Context/UseContext';
import { API_URL } from '../../api';
const Contacts = () => {
  const [custmer, setCustmer] = useState([]);
  const [page, setPage] = useState(0); // Updated to use 0-based index for the page
  const [pageSize, setPageSize] = useState(25); // Default page size
  const [rowCount, setRowCount] = useState(0); // Total number of rows, to be set from API response
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { showFullPhoneNumberemail, togglePhoneNumber } = useAppContext();
  const navigate = useNavigate();

  const togglePhoneNumberemail = () => {
    if (showFullPhoneNumberemail) {
      togglePhoneNumber();
    } else {
      navigate("/showPhoneandEmail");
    }
  };

  const fetchData = async (page, pageSize) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/approval?limit=${pageSize}&pageNo=${page + 1}`);
      const data = await response.json();
      
      const formattedData = data.results.map((item) => ({
        id: item.user_id,
        name: `${item.first_name} ${item.last_name || ''}`, // Combining first and last name
        age: new Date().getFullYear() - new Date(item.birthday).getFullYear(),
        phone: item.phone || 'N/A',
        email: item.email || 'N/A',
        country: item.country || 'N/A', // Assuming address is optional
        status: item.status,
        gender: item.gender == 1 ? "Male" : "Female",
        created_at: new Date(item.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        updated_at: new Date(item.updated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        birthday: new Date(item.birthday).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }));

      setCustmer(formattedData);
      setRowCount(data.total); // Assuming your API response contains the total number of records
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   fetchData(page, pageSize);
  // }, [page, pageSize]);
  
  useEffect(() => {
    const fetchDataloading = async () => {
      try {
        await Promise.all([
          fetchData(page, pageSize)
        ])
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchDataloading();
  }, [page, pageSize]);


  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber && phoneNumber.length >= 6) {
      const visibleDigits = 3;
      const maskedSection = phoneNumber.substring(visibleDigits, phoneNumber.length - visibleDigits).replace(/\d/g, '*');
      const visiblePart = phoneNumber.substring(0, visibleDigits) + maskedSection + phoneNumber.substring(phoneNumber.length - visibleDigits);
      return visiblePart;
    }
    return phoneNumber || 'N/A';
  };

  const formatEmailAddress = (email) => {
    if (email) {
      const parts = email.split('@');
      const visiblePart = `${parts[0].charAt(0)}***@${parts[1]}`;
      return visiblePart;
    }
    return 'N/A';
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      flex: 1,
      renderCell: (params) => (
        <Typography>
          {showFullPhoneNumberemail ? params.value : formatPhoneNumber(params.value)}
        </Typography>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      renderCell: (params) => (
        <Typography>
          {showFullPhoneNumberemail ? params.value : formatEmailAddress(params.value)}
        </Typography>
      ),
    },
    {
      field: 'birthday',
      headerName: 'Birthday',
      flex: 1,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      flex: 1,
    },
    {
      field: 'country',
      headerName: 'Locations',
      flex: 1,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1,
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Link',
      flex: 1,
      renderCell: (params) => (
        <Link to={`/approvaluserdetails/${params.row.id}`} style={{ color: colors.blueAccent[400], textDecoration: 'none' }}>
        Show
      </Link>
      ),
    },
  ];

  return (
    <Box m="20px">
     <Header
        title="Pending Approval"
        subtitle="List of Pending Approval "
      />

      <Box
        display="flex"
        justifyContent="flex-end"
        sx={{ mt: { lg: '-70px' } }}
      >
        {/* Uncomment the button below to use it */}
        {/* <Button
           sx={{
            mb: 2,
            background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
            },
          }}
          onClick={togglePhoneNumberemail}
        >
          {showFullPhoneNumberemail ? 'Hide Phone Number And Email' : 'Show Phone Number And Email'}
        </Button> */}
      </Box>
  {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100dvh">
          <Typography variant="body1" mr={2}>Hang tight, we're getting things ready for you!</Typography>
          <CircularProgress />
        </Box>
      ) : (
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundImage: 'linear-gradient(90deg, #9663BF, #4B164C)',
            color: '#fff',
            borderBottom: "none",
            fontSize: "16px",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: "12px",
            fontWeight: "Medium",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#605f61",
            color: '#fff',
            borderBottom: "none",
            fontSize: "14px",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#9663BF",
            color: '#fff',
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          ".MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: '#605f61',
            color: '#fff',
          },
          ".MuiTablePagination-root": {
            overflow: "auto",
            color: "rgb(255 255 255 / 87%)",
            fontSize: "14px",
          },
        }}
      >
        <DataGrid
          rows={custmer}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pagination
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[25, 50, 100]}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          rowCount={rowCount}
          componentsProps={{
            pagination: {
              sx: {
                "& .MuiButtonBase-root": {
                  color: '#fff',
                },
                "& .MuiPaginationItem-root": {
                  color: '#fff',
                },
              },
            },
          }}
        />
      </Box>
      )}
    </Box>
  );
};

export default Contacts;


