import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Avatar, Typography, Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { logout, getLoggedInUsername } from '../utils/auth';
// import { getLoggedInUsername } from '../utils/auth';

export default function MainLayout({ children }) {
  const [navValue, setNavValue] = useState(0);
  const navigate = useNavigate();
    const username = getLoggedInUsername();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f6f9fb', pb: 8, width: '100vw', position: 'relative', overflowX: 'hidden' }}>
      <Box sx={{ mx: 'auto', width: '100%', maxWidth: 430, minHeight: '100vh', position: 'relative', boxShadow: { xs: 0, md: 2 }, borderRadius: { xs: 0, md: 4 } }}>
        {/* Fixed AppBar/Header */}
        <AppBar position="fixed" color="primary" sx={{ borderRadius: 0, boxShadow: 2 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>{username.charAt(0).toUpperCase()}</Avatar>
              <Typography variant="h6" fontWeight={700}>
                Business Analyzer
              </Typography>
            </Box>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {/* Main Content (with top padding for AppBar) */}
        <Box sx={{ pt: 8, pb: 10 }}>
          {children}
        </Box>
        {/* Fixed Bottom Navigation Bar */}
        <Box sx={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1200, mx: 'auto' }}>
          <BottomNavigation
            value={navValue}
            onChange={(event, newValue) => {
              setNavValue(newValue);
              if (newValue === 0) navigate('/home');
              if (newValue === 1) navigate('/transactions');
              if (newValue === 2) navigate('/profile');
              if (newValue === 3) navigate('/settings');
            }}
            showLabels
          >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Transactions" icon={<AttachMoneyIcon />} />
            {/* <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
            <BottomNavigationAction label="Settings" icon={<SettingsIcon />} /> */}
          </BottomNavigation>
        </Box>
      </Box>
    </Box>
  );
}
