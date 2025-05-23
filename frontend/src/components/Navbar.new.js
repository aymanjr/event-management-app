import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import {
  Home as HomeIcon,
  Event as EventIcon,
  Logout as LogoutIcon,
  AccountCircle,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import GoEventLogo from '../Images/GoEvent Logo.png';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const renderAuthButtons = () => {
    if (isAuthenticated()) {
      return (
        <>
          <Button
            component={Link}
            to="/dashboard"
            color="inherit"
            startIcon={<DashboardIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              display: { xs: 'none', md: 'flex' },
            }}
          >
            Dashboard
          </Button>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ ml: 1 }}
          >
            {currentUser?.firstName ? (
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {currentUser.firstName.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </>
      );
    }
    
    return (
      <>
        <Button
          component={Link}
          to="/login"
          color="inherit"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            display: { xs: 'none', md: 'flex' },
            bgcolor: isLoginPage ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
            '&:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.12)',
            },
          }}
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          color="primary"
          sx={{
            ml: 2,
            textTransform: 'none',
            fontWeight: 500,
            display: { xs: 'none', md: 'flex' },
            bgcolor: isRegisterPage ? 'primary.dark' : 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Sign Up
        </Button>
      </>
    );
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Link 
              to="/" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: 'inherit' 
              }}
            >
              <img 
                src={GoEventLogo} 
                alt="GoEvent Logo" 
                style={{ 
                  height: '40px', 
                  marginRight: '10px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }} 
              />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700, 
                  display: { xs: 'none', sm: 'block' },
                  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                GoEvent
              </Typography>
            </Link>
          </Box>
          
          {/* Desktop Navigation */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 1,
            mr: 2
          }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              startIcon={<HomeIcon />}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                '&.active': {
                  color: 'primary.main',
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/events"
              color="inherit"
              startIcon={<EventIcon />}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                '&.active': {
                  color: 'primary.main',
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              Events
            </Button>
          </Box>
          
          {/* Auth Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderAuthButtons()}
          </Box>
          
          {/* Mobile menu button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls="mobile-menu"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      
      {/* Desktop Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {currentUser?.firstName || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {currentUser?.email || ''}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleNavigate('/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error.main' }}>
            Logout
          </ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Mobile Menu */}
      <Menu
        id="mobile-menu"
        anchorEl={mobileMenuAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {isAuthenticated() ? (
          <>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {currentUser?.firstName || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {currentUser?.email || ''}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => handleNavigate('/dashboard')}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/profile')}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ color: 'error.main' }}>
                Logout
              </ListItemText>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleNavigate('/login')}>
              <ListItemText>Login</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/register')}>
              <ListItemText>Sign Up</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
