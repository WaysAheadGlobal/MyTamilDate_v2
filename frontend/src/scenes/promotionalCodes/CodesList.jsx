import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header1';
import { useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';
const Contacts = () => {
  const [activeCodes, setActiveCodes] = useState([]);
  const [pageSize, setPageSize] = useState(50); 
  const [pageNo, setPageNo] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fetchData = async (pageSize, pageNo) => {
    try {
      const data = await fetch(`${API_URL}/admin/promotioncode/?limit=${pageSize}&pageNo=${pageNo + 1}`);
      const response = await data.json();
      const formattedData = response.results.map((item) => ({
        ...item,
        created_at: new Date(item.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }));
      setActiveCodes(formattedData);
      setTotal(response.total);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData(pageSize, pageNo);
  }, [pageSize, pageNo]);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'promo_id', headerName: 'Promo ID', flex: 1 },
    {
      field: 'percent_off',
      headerName: 'Percent Off',
      type: 'number',
      flex: 1,
     
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'amount_off',
      headerName: 'Amount Off',
      type: 'number',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'max_redemptions',
      headerName: 'Max Redemptions',
      type: 'number',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'applies_to',
      headerName: 'Applies To',
      type: 'text',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'usages',
      headerName: 'Usege',
      type: 'text',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'once_per_user',
      headerName: 'Once Per User',
      type: 'boolean',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      type: 'dateTime',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'status',
      headerName: 'Link',
      flex: 1,
      renderCell: (params) => (
        <Link to={`/promotionalcodedetails/${params.id}`} style={{ color: colors.blueAccent[400], textDecoration: 'none' }}>
          Show
        </Link>
      ),
    },
  ];

  const handleAddPromoCode = () => {
    navigate("/addpromotionalcode");
  };

  const handlePageChange = (params) => {
    setPageNo(params.page);
  };

  return (
    <Box m="20px">
      <Header title="Promotional Codes" subtitle="List of Promotional Codes" />
      <Box display="flex" justifyContent="flex-end" sx={{ mt: { lg: '-70px' } }}>
        <Button
          sx={{
            mb: 2,
            background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
            },
          }}
          onClick={handleAddPromoCode}
        >
          Add new Code
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#605f61", // Lavender gradient background
            color: '#fff', // Text color white
            borderBottom: "none",
            
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          
            fontWeight: "Medium", // Make the font bold
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
           
          },
          "& .MuiDataGrid-virtualScroller": {
            // backgroundColor: colors.primary[400],
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
          rows={activeCodes}
          columns={columns}
          pagination
          pageSize={pageSize}
          rowsPerPageOptions={[25]} // Fixed page size
          rowCount={total}
          paginationMode="server"
          onPageChange={handlePageChange}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id} // Ensure each row has a unique ID
        />
      </Box>
    </Box>
  );
};

export default Contacts;
