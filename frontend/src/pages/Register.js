import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Link,
  Paper,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
  LinearProgress,
  Alert,
  Stack
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import api from '../api';

const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length === 0) return 0;
    if (pass.length >= 8) strength += 1;
    if (pass.match(/[a-z]+/)) strength += 1;
    if (pass.match(/[A-Z]+/)) strength += 1;
    if (pass.match(/[0-9]+/)) strength += 1;
    if (pass.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength += 1;
    return (strength / 5) * 100;
  };

  const strength = getStrength(password);
  const getColor = () => {
    if (strength < 30) return 'error';
    if (strength < 70) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <LinearProgress 
        variant="determinate" 
        value={strength} 
        color={getColor()}
        sx={{ height: 4, borderRadius: 2 }}
      />
      <Typography variant="caption" color="text.secondary">
        {strength === 0 ? 'Enter a password' : 
         strength < 30 ? 'Weak' : 
         strength < 70 ? 'Moderate' : 'Strong'}
      </Typography>
    </Box>
  );
};

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (touched.password) {
      validateField('password', formData.password);
    }
  }, [formData.password, touched.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Email is invalid';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          newErrors.password = 'Include at least one uppercase letter';
        } else if (!/(?=.*[0-9])/.test(value)) {
          newErrors.password = 'Include at least one number';
        } else {
          delete newErrors.password;
        }
        break;
      case 'firstName':
        if (!value) {
          newErrors.firstName = 'First name is required';
        } else {
          delete newErrors.firstName;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post('/auth/register', formData);
      navigate('/login', { 
        state: { 
          success: 'Registration successful! Please login to your account.',
          email: formData.email
        } 
      });
    } catch (err) {
      setErrors({
        submit: err.response?.data?.error || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(90deg, #1A237E 0%, #4CAF50 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Create Your Account
          </Typography>
          <Typography color="text.secondary">
            Join thousands of event organizers and attendees
          </Typography>
        </Box>
        
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.firstName}
                helperText={errors.firstName}
                variant="outlined"
                size="medium"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                size="medium"
              />
            </Grid>
          </Grid>
          
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
            size="medium"
            autoComplete="username"
          />
          
          <Box>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
              size="medium"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <PasswordStrength password={formData.password} />
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(90deg, #1A237E 0%, #4CAF50 100%)',
              '&:hover': {
                opacity: 0.95,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/login" 
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
          
          <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={2}>
            By registering, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}