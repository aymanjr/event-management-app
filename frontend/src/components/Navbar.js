import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import { AccountCircle, Home, Event } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#6200EE' }}>
      <Toolbar>
        {/* Left Corner: Brand Name + Home */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'white' }}>
            EVENT Management
          </Typography>
          <IconButton component={Link} to="/" color="inherit" sx={{ ml: 1 }}>
            <Home />
          </IconButton>
        </Box>

        {/* Right Corner: Events Tab + Profile Dropdown */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            component={Link} 
            to="/events" 
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {isMobile ? <Event /> : <Typography sx={{ mr: 1 }}>Events</Typography>}
          </IconButton>

          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose} component={Link} to="/profile">Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;