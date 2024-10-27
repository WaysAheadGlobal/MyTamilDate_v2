/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { Card, CardContent, Box, Button, Typography, useTheme, useMediaQuery, Select, MenuItem, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header1";
import GeographyChart from "../../components/GeographyChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import PieChart from '../../components/PieChart';
import { ResponsivePie } from "@nivo/pie";
import { mockPieData as data } from "../../data/mockData";
import { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import axios from 'axios';

const agedata = [
  { age: '18-24', value: 6 },
  { age: '25-30', value: 3 },
  { age: '31-40', value: 4 },
  { age: '41+', value: 2 },
];

const transformedagedata = agedata.map(item => ({
  id: item.age,
  label: item.age,
  value: item.value,
}));



const cardStyle = {
  width: '320px',
  margin: '10px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
  overflow: 'hidden',
};

const cardHeaderStyle = {
  background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
  padding: '16px',
  textAlign: 'center',
};

const cardContentStyle = {
  padding: '20px',
};

const cardTextStyle = {
  margin: '4px 0',
  fontWeight: '500',
  fontSize: '16px',
  textAlign: 'center',
  color: '#333',
};

const StatCard = ({ title, value }) => (
  <Box display="flex" justifyContent="center">
    <Card style={cardStyle}>
      <CardContent style={{ padding: 0 }}>
        <Box style={cardHeaderStyle}>
          <Typography variant="h7" style={{ color: 'white', fontSize: "10px" }}>
            {title}
          </Typography>
        </Box>
        <Box style={cardContentStyle}>
          <Typography variant="body1" style={cardTextStyle}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const listCardStyle = {
  width: '100%',
  maxWidth: '500px',
  margin: '16px',
  animation: `${fadeIn} 1s ease-in-out`,
};

const listCardHeaderStyle = {
  background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
  padding: '16px',
};

const listCardContentStyle = {
  padding: '16px',
};

const itemStyle = index => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  animation: ${slideIn} 0.5s ease-in-out ${index * 0.1}s forwards;
  opacity: 0;
`;

const ListCard = ({ title, data }) => (
  <Box display="flex" justifyContent="center">
    <Card style={listCardStyle}>
      <CardContent style={{ padding: 0 }}>
        <Box style={listCardHeaderStyle}>
          <Typography variant="h6" style={{ color: 'white', fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Box style={listCardContentStyle}>
          {data.map((item, index) => (
            <Box
              key={index}
              css={itemStyle(index)}
            >
              <Typography variant="body1" style={{ fontWeight: 'bold', color: '#333' }}>
                {item.age || item.gender}
              </Typography>
              <Typography variant="body1" style={{ fontWeight: 'bold', color: '#FC8C66' }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  </Box>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [ageData, setAgedata1] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [totalNewUsersignup, setTotalNewUsersignup] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [TotalPeyment, setTotalPeyment] = useState(0);
  const [TotalLikeCount, setLikeCount] = useState(0);
  const [locationscount, setLocationsCount] = useState([]);
  const [CountTopJobs, setCountTopJobs] = useState([]);
  const [OldMembersSignedIn, setOldMembersSignedIn] = useState(0);
  const [TotalMatchsCount, setMatchsCount] = useState(0);
  const [TotalRequestCount, setRequestCount] = useState(0);
  const [AvgPaidConve, setAvgPaidConversations] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [paidMemberCount, setPaidMemberCount] = useState(0);
  const [TotalRenewal, setTotalRenewalCount] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getCountByGender = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/count-by-gender`, {
        params: { timeRange }
      });

      const transformedData = Object.keys(response.data).map(key => ({
        id: key,
        label: key,
        value: response.data[key],
      }));

      if (transformedData.length === 0) {
        setGenderData([
          { id: 'Male', label: 'Male', value: 1 },
          { id: 'Female', label: 'Female', value: 1 },
          { id: 'Other', label: 'Other', value: 1 },
        ]);
      } else {
        setGenderData(transformedData);
      }

      console.log(response.data);
    } catch (error) {
      console.error('Error fetching count by gender:', error);
      setGenderData([
        { id: 'Male', label: 'Male', value: 1 },
        { id: 'Female', label: 'Female', value: 1 },
        { id: 'Other', label: 'Other', value: 1 },
      ]);
    }
  };

  const getAgeGroup = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/users/age-group`, {
        params: { timeRange }
      });

      const transformedData = response.data.map(item => ({
        id: item.age_group,
        label: item.age_group,
        value: item.count,
      }));

      if (transformedData.length === 0) {
        setAgedata1([
          { id: '18-24', label: '18-24', value: 1 },
          { id: '25-30', label: '25-30', value: 1 },
          { id: '31-40', label: '31-40', value: 1 },
          { id: '41+', label: '41+', value: 1 },
        ]);
      } else {
        setAgedata1(transformedData);
      }

      console.log(response.data);
    } catch (error) {
      console.error('Error fetching age group data:', error);
      setAgedata1([
        { id: '18-24', label: '18-24', value: 1 },
        { id: '25-30', label: '25-30', value: 1 },
        { id: '31-40', label: '31-40', value: 1 },
        { id: '41+', label: '41+', value: 1 },
      ]);
    }
  };

  const TotalNewsignUp = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/users/count`, {
        params: { timeRange }
      });
      setTotalNewUsersignup(response.data);
      console.log(response.data);
    }
    catch (err) {
      console.log(err)
    }
  }


  const Transections = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/payments`);
      setTransactions(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const getMessageCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/messages/count`, {
        params: { timeRange }
      });
      setMessageCount(response.data.total_messages);
    } catch (error) {
      console.error('Error fetching message count:', error);
    }
  };

  const getLikeCount = async () => {
    try {
      console.log('timeRange:', timeRange); // Log timeRange to verify its value
      const response = await axios.get(`${API_URL}/admin/dashboard/likes/count`, {
        params: { timeRange }
      });
      console.log('API Response:', response.data); // Log the full response
      setLikeCount(response.data.total_likes);
      console.log('TotalLikeCount:', response.data.total_likes); // Ensure this matches what you see in Postman
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const RequestCount = async () => {
    try {
      console.log('timeRange:', timeRange); // Log timeRange to verify its value
      const response = await axios.get(`${API_URL}/admin/dashboard/requests/count`, {
        params: { timeRange }
      });
      console.log('API Response:', response.data); // Log the full response
      setRequestCount(response.data.total_requests);
      console.log('total_requests:', response.data.total_requests); // Ensure this matches what you see in Postman
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };


  const getMatchCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/matches/count`, {
        params: { timeRange }
      });
      setMatchsCount(response.data.total_matches);
    } catch (error) {
      console.error('Error fetching message count:', error);
    }
  };

  const getTopJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/top-jobs`, {
        params: { timeRange }
      });
      setCountTopJobs(response.data);
      console.log('getTopJobs:', response.data)
    } catch (error) {
      console.error('Error fetching message count:', error);
    }
  };

  const PaidMemberCount = async () => {
    try {
      console.log('timeRange:', timeRange); // Log timeRange to verify its value
      const response = await axios.get(`${API_URL}/admin/dashboard/new-paid-members/count`, {
        params: { timeRange }
      });
      console.log('API Response:', response.data); // Log the full response
      setPaidMemberCount(response.data.total_new_paid_members);
      console.log('Totalpayment:', response.data.total_new_paid_members); // Ensure this matches what you see in Postman
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const TotalRenewalCount = async () => {
    try {
      console.log('timeRange:', timeRange); // Log timeRange to verify its value
      const response = await axios.get(`${API_URL}/admin/dashboard/renewals/count`, {
        params: { timeRange }
      });
      console.log('API Response:', response.data); // Log the full response
      setTotalRenewalCount(response.data.results[0].total_renewals);
      console.log('TotalRenewal:', response.data.results[0].total_renewals); // Ensure this matches what you see in Postman
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const TotalOldMembersSignedIn = async () => {
    try {
      console.log('timeRange:', timeRange); // Log timeRange to verify its value
      const response = await axios.get(`${API_URL}/admin/dashboard/old-members/signed-in/count`, {
        params: { timeRange }
      });
      console.log('API Response:', response.data); // Log the full response
      setOldMembersSignedIn(response.data.total_old_members_signed_in);
      console.log('total_old_members_signed_in:', response.data.total_old_members_signed_in); // Ensure this matches what you see in Postman
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const TotalPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/payments/total`, {
        params: { timeRange }
      });
      setTotalPeyment(response.data.total_payments_cad.toFixed(1));
      const formattedTotalPayments = formatToK(response.data.total_payments_cad);
    } catch (error) {
      console.error('Error fetching message count:', error);
    }
  };

  const Toptencountry = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/top-countries`, {
        params: { timeRange }
      });
      setLocationsCount(response.data);
      console.log("top country", response.data);

    } catch (error) {
      console.error('Error fetching message count:', error);
    }
  };


  const formatToK = (amount) => {
    if (amount >= 1000 && amount < 1000000) {
      return `${(amount / 1000).toFixed(1)}k`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else {
      return `${amount}`;
    }
  };

  const AvgPaidConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/users/avg-days-to-paid`, {
        params: { timeRange }
      });
      setAvgPaidConversations(response.data);
      console.log("ssssss", response.data);

    } catch (error) {
      console.error('Error fetching message count:', error);
    }
  };


  useEffect(() => {
    const fetchDataall = async () => {
      try {
        setLoading(true);

        await Promise.race([
          getCountByGender(),
          getAgeGroup(),
          TotalNewsignUp(),
          getMessageCount(),
          TotalPayments(),
          getLikeCount(),
          getMatchCount(),
          Toptencountry(),
          PaidMemberCount(),
          TotalRenewalCount(),
          RequestCount(),
          TotalOldMembersSignedIn(),
          getTopJobs(),
          AvgPaidConversations()
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchDataall();
  }, [timeRange]);

  useEffect(() => {
    Transections();
  }, [])

  // const formatToK = (num) => {
  //   if (num >= 1000) {
  //     return `${(num / 1000).toFixed(1)}k`;
  //   }
  //   return num.toString();
  // };
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };


  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100dvh">
          <Typography variant="body1" mr={2}>Hang tight, we're getting things ready for you!</Typography>
          <CircularProgress />
        </Box>
      ) : (

        <Box m="20px">
          {/* HEADER */}
          <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center">
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
            <Box mt={isMobile ? "10px" : "0"}>
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
                width="50px"
                sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '8px' }}
              >
                <MenuItem value="24h">Last 24 Hours</MenuItem>
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="3months">Last 3 Months</MenuItem>
                <MenuItem value="12months">Last 12 Months</MenuItem>
              </Select>
            </Box>
          </Box>
          {/* GRID */}
          <Box
            display="grid"
            gridTemplateColumns={isMobile ? "1fr" : "repeat(12, 1fr)"}
            gridAutoRows="140px"
            gap="20px"
          >
            {/* ROW 1 */}
            <Box gridColumn={isMobile ? "span 12" : "span 3"} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title={messageCount}
                subtitle="Messages"
                progress="0.75"
                increase="+14%"
                icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>


            <Box gridColumn={isMobile ? "span 12" : "span 3"} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title={TotalLikeCount}
                subtitle="Likes"
                progress="0.50"
                increase="+21%"
                icon={<FavoriteBorderIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>
            <Box gridColumn={isMobile ? "span 12" : "span 3"} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title={TotalMatchsCount}
                subtitle="Matches"
                progress="0.30"
                increase="+5%"
                icon={<JoinInnerIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>
            <Box gridColumn={isMobile ? "span 12" : "span 3"} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title={TotalRequestCount}
                subtitle="Requests"
                progress="0.80"
                increase="+43%"
                icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>
          </Box>

          {/* CONTENT GRID */}
          <Box mt="40px">
            <Box
              display="grid"

              gridTemplateColumns={isMobile ? "1fr" : "repeat(8, 1fr)"}
              gridAutoRows="140px"
              gap="20px"
            >



              <Box mb="20px" gridColumn={isMobile ? "span 12" : "span 4"} gridRow="span 2" style={{ maxWidth: '400px' }}>
                <Box >
                  <Typography variant="h4" fontWeight="500">
                    Distribution of Genders
                  </Typography>
                </Box>
                {genderData.length !== 0 ? (<PieChart data={genderData} />) : (
                  <Typography variant="body1">No data available</Typography>
                )}
              </Box>

              <Box mb="20px" gridColumn={isMobile ? "span 12" : "span 4"} gridRow="span 2" style={{ maxWidth: '400px' }}>
                <Box>
                  <Typography variant="h4" fontWeight="500">
                    Age Groups
                  </Typography>
                </Box>
                {ageData.length !== 0 ? (<PieChart data={ageData} />) : (
                  <Typography variant="body1">No data available</Typography>
                )}
              </Box>


            </Box>

            {/* Additional Cards */}


            <Box display="grid" gridTemplateColumns={isMobile ? "repeat(auto-fill, minmax(250px, 1fr))" : "repeat(auto-fill, minmax(23%, 1fr))"} mt="50px">
              <StatCard title="Total Revenue Generated" value={`CAD ${TotalPeyment}`} />
              <StatCard title="Total Old Users Signing First Time" value={OldMembersSignedIn} />
              <StatCard title="Total New Members Sign Up" value={totalNewUsersignup.total_users} />
              <StatCard title="Total of New Paid Members" value={paidMemberCount} />
            </Box>


            <Box display="grid" gridTemplateColumns={isMobile ? "repeat(auto-fill, minmax(250px, 1fr))" : "repeat(auto-fill, minmax(23%, 1fr))"} mt="20px">

              <StatCard title="Total of Renewals" value={TotalRenewal} />
              <StatCard title="Avg days to paid conversion" value={AvgPaidConve.avg_days_to_paid_conversion} />
              <StatCard title="Avg of Interaction Per Session" value="134" />
              <StatCard title="Avg Time Per Session" value="24 minutes" />
            </Box>



            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-around" mt="30px">
              <Box flex="1" mx={isMobile ? '0' : '10px'} mb={isMobile ? '20px' : '0'}>
                <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                  <Typography color={colors.grey[100]} variant="h6" fontWeight="600" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    Top Jobs
                  </Typography>
                </Box>
                {CountTopJobs.map((jobs, i) => (
                  <Box
                    key={`${jobs.id}-${i}`}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`2px solid ${colors.primary[500]}`}
                    p="15px"
                    sx={{
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        borderColor: colors.greenAccent[500],
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                      },
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    <Box>
                      <Typography color={colors.grey[100]} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                        {jobs.job_name}
                      </Typography>
                    </Box>
                    <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                      {jobs.count}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box flex="1" mx={isMobile ? '0' : '10px'} mb={isMobile ? '20px' : '0'}>
                <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                  <Typography color={colors.grey[100]} variant="h6" fontWeight="600" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    Top Countries
                  </Typography>
                </Box>
                {locationscount.map((jobs, i) => (
                  <Box
                    key={`${jobs.id}-${i}`}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`2px solid ${colors.primary[500]}`}
                    p="15px"
                    sx={{
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        borderColor: colors.greenAccent[500],
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                      },
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    <Box>
                      <Typography color={colors.grey[100]} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                        {jobs.country}
                      </Typography>
                    </Box>
                    <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                      {jobs.user_count}
                    </Box>
                  </Box>
                ))}
              </Box>

            </Box>



            <Box gridColumn={isMobile ? "span 12" : "span 4"} gridRow="span 2" overflow="auto" mt="30px">
              <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                <Typography color={colors.grey[100]} variant="h6" fontWeight="600" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  Recent Transactions
                </Typography>
              </Box>
              {transactions.map((transaction, i) => (
                <Box
                  key={`${transaction.id}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`2px solid ${colors.primary[500]}`}
                  p="15px"
                  sx={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      borderColor: colors.greenAccent[500],
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    },
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  <Box>
                    <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                      {transaction.id}
                    </Typography>
                    <Typography color={colors.grey[100]} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                      {transaction.first_name}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </Box>
                  <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    ${transaction.amount / 100}
                  </Box>
                </Box>
              ))}
            </Box>


          </Box>


        </Box>
      )}
    </>
  );
};



export default Dashboard;
