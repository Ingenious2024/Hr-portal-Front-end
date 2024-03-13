import React, { useState } from "react";
import "./Sidebar.css";
import Logo from "../imgs/rsz_1untitled_design.png";
import MenuIcon from '@mui/icons-material/Menu'; // Updated from UilBars
import LogoutIcon from '@mui/icons-material/Logout'; // Updated from UilSignOutAlt
import { SidebarData } from "../Data/Data";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import LoginIcon from '@mui/icons-material/Login';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useAuth } from "../Routes/AuthContext"; // Importing useAuth hook

// Icon mapping - assuming SidebarData has an 'iconName' field or similar
const iconMapping = {
    'dashboard': DashboardIcon,
    'announcements': AnnouncementIcon,
    'login': LoginIcon,
    'assign': AssignmentIcon,
    'employees': PeopleIcon,
    'attendance': EventNoteIcon,
};

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true); // Changed setExpaned to setExpanded
  const { isLoggedIn, logout } = useAuth(); // Using useAuth hook to get isLoggedIn state and logout function

  const navigate = useNavigate();
  const sidebarVariants = {
    true: { left: '0' },
    false: { left: '-60%' }
  }

  // Render the sidebar only if the user is logged in
  if (!isLoggedIn) return null;

  const handleLogout = () => {
    logout(); // Call logout function from useAuth hook
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <>
      <div className="bars" style={expanded ? {left: '60%'} : {left: '5%'}} onClick={() => setExpanded(!expanded)}>
        <MenuIcon />
      </div>
      <motion.div className='sidebar'
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ''}
      >
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>Inge<span>in</span>ous</span>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => {
            const Icon = iconMapping[item.iconName]; // Add the icon name in your data
            return (
              <div
                className={selected === index ? "menuItem active" : "menuItem"}
                key={index}
                onClick={() => { 
                  setSelected(index);
                  navigate(item.path); // Navigate to the path when the item is clicked
                }}
              >
                <Icon />
                <span>{item.heading}</span>
              </div>
            );
          })}
          <div className="menuItem" onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
