import { useState } from "react";
import React from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import ReportIcon from '@mui/icons-material/Report';
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useAppContext } from "../../Context/UseContext";
import "./Sidebar.css"; // Import custom CSS
import { useCookies } from "../../hooks/useCookies";
import { GrAnalytics } from "react-icons/gr";
import { IoTicketOutline } from "react-icons/io5";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Category = ({ title, icon, children, isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box>

      <Box
        display="flex"
        alignItems="center"
        sx={{ cursor: "pointer", mt: isCollapsed ? "30px" : "0", mb: isCollapsed ? "30px" : "0" }}
        onClick={handleToggle}
      >
        {icon && React.cloneElement(icon, { sx: { color: colors.grey[100], marginLeft: '27px', marginTop: "10px" } })}
        {!isCollapsed && (
          <Typography
            variant="h6"
            color={colors.grey[100]}
            sx={{ m: "15px 0 5px 20px", flexGrow: 1 }}
          >
            {title}
          </Typography>
        )}
        {!isCollapsed && (
          <Box sx={{ mr: 2 }}>
            {isOpen ? <ExpandLessIcon sx={{ color: colors.grey[100] }} /> : <ExpandMoreIcon sx={{ color: colors.grey[100] }} />}
          </Box>
        )}
      </Box>
      <Box className={`dropdown-sidebar ${isOpen ? "open" : ""}`} pl={2}>
        {children}
      </Box>
    </Box>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { deleteCookie } = useCookies();
  const [selected, setSelected] = useState("Approval");
  const navigate = useNavigate();
  const { loginAsAdmin, logout } = useAppContext();

  const handleLogout = () => {
    deleteCookie("Admintoken");
    navigate("/adminlogin");
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>

                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>

            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={() => setSelected("Dashboard")}
            />

            <Item
              title="Analytics"
              to="/analytics"
              icon={<GrAnalytics />}
              selected={selected}
              setSelected={() => setSelected("Analytics")}
            />


            <Category
              title="Users"
              icon={<PeopleOutlinedIcon />}
              isCollapsed={isCollapsed}
            >
              <Item
                title="User List"
                to="/contacts"
                icon={<GroupsIcon />}
                selected={selected}
                setSelected={() => setSelected("User List")}
              />
              <Item
                title="Approval"
                to="/approval"
                icon={<PendingActionsIcon />}
                selected={selected}
                setSelected={() => setSelected("Approval")}
              />
               <Item
                title="Rejected"
                to="/rejected"
                icon={<PlaylistRemoveIcon />}
                selected={selected}
                setSelected={() => setSelected("Rejected")}
              />
              <Item
                title="Reports"
                to="/reports"
                icon={<ReportIcon />}
                selected={selected}
                setSelected={() => setSelected("Reports")}
              />
            </Category>

            <Item
              title="Promotional Codes"
              to="/promotionalcodes"
              icon={<IoTicketOutline size={16} />}
              selected={selected}
              setSelected={() => setSelected("Promotional Codes")}
            />



            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                width: '90%',
                mb: 2,
                mt: 2,
                mr: 6,
                py: 1.5,
                background: 'linear-gradient(90deg, #FC8C66, #F76A7B)',
                color: '#FFF',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(90deg, #F76A7B, #FC8C66)',
                },
              }}
            >
              LogOut
            </Button>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
