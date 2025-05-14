import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Grid,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle, Cancel, Event as EventIcon, Person, Logout } from '@mui/icons-material';

export default function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const firstName = localStorage.getItem('userFirstName');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await api.get(`/dashboard/${userId}/registrations`);
        console.log('Registration data:', res.data);
        setRegistrations(res.data);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.error || 'Failed to load registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userFirstName');
    navigate('/login');
  };

  const theme = useTheme();

  // Custom styled components
  const StatCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
    }
  }));

  const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: theme.spacing(4),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginTop: theme.spacing(2),
  }));

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  const upcomingEvents = registrations.filter(reg => new Date(reg.event?.date) > new Date());
  const pastEvents = registrations.filter(reg => new Date(reg.event?.date) <= new Date());

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%)',
      py: 4,
      px: { xs: 2, sm: 3 }
    }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4
        }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{
                color: '#1a237e',
                fontWeight: 700,
                mb: 1,
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '100%',
                  height: 4,
                  background: 'linear-gradient(90deg, #1a237e, #5c6bc0)',
                  borderRadius: 2
                }
              }}
            >
              Welcome, {firstName || 'User'}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here's your event dashboard
            </Typography>
          </Box>
          <Button 
            variant="contained"
            color="error"
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{
              mt: { xs: 2, sm: 0 },
              px: 3,
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(211, 47, 47, 0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Logout
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard>
              <CardActionArea sx={{ p: 3, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#e3f2fd', mr: 2 }}>
                      <EventIcon color="primary" />
                    </Avatar>
                    <Typography variant="h6" color="textSecondary">
                      Total Events
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
                    {registrations.length}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard>
              <CardActionArea sx={{ p: 3, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#e8f5e9', mr: 2 }}>
                      <CheckCircle color="success" />
                    </Avatar>
                    <Typography variant="h6" color="textSecondary">
                      Upcoming
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
                    {upcomingEvents.length}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard>
              <CardActionArea sx={{ p: 3, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#f3e5f5', mr: 2 }}>
                      <Person color="secondary" />
                    </Avatar>
                    <Typography variant="h6" color="textSecondary">
                      Past Events
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
                    {pastEvents.length}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </StatCard>
          </Grid>
        </Grid>

        <StyledPaper elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ 
              color: '#1a237e',
              fontWeight: 600,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 60,
                height: 4,
                background: 'linear-gradient(90deg, #1a237e, #5c6bc0)',
                borderRadius: 2
              }
            }}>
              Your Event Registrations
            </Typography>
          </Box>

          {error ? (
            <Typography color="error">{error}</Typography>
          ) : registrations.length > 0 ? (
            <List component="div" sx={{ width: '100%' }}>
              {registrations.map((reg, index) => (
                <Box component="div" key={reg.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    component="div"
                    sx={{
                      p: 3,
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.01)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography 
                          variant="h6" 
                          component="div"
                          sx={{ 
                            fontWeight: 600,
                            color: '#1a237e',
                            mb: 0.5
                          }}
                        >
                          {reg.event?.title || 'Unknown Event'}
                        </Typography>
                      }
                      secondary={
                        <Box component="div">
                          <Typography 
                            component="span" 
                            display="block" 
                            variant="body2"
                            sx={{ 
                              color: 'text.secondary',
                              mb: 0.5
                            }}
                          >
                            <EventIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1rem' }} />
                            {reg.event?.date ? new Date(reg.event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'No date'}
                          </Typography>
                          <Typography 
                            component="span" 
                            display="block" 
                            variant="body2"
                            sx={{ color: 'text.secondary', mb: 1 }}
                          >
                            📍 {reg.event?.location || 'No location specified'}
                          </Typography>
                          <Chip 
                            label={`Ticket: ${reg.ticketId}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ 
                              mr: 1,
                              fontWeight: 500,
                              borderColor: '#5c6bc0',
                              color: '#5c6bc0',
                              backgroundColor: 'rgba(92, 107, 192, 0.08)'
                            }}
                          />
                          <Chip 
                            icon={reg.attended ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                            label={reg.attended ? 'Attended' : 'Upcoming'}
                            color={reg.attended ? 'success' : 'primary'}
                            size="small"
                            sx={{ 
                              mt: 1,
                              fontWeight: 500,
                              '& .MuiChip-icon': {
                                color: reg.attended ? theme.palette.success.main : theme.palette.primary.main
                              }
                            }}
                          />
                          <Chip 
                            label={`$${reg.event?.price || 0}`} 
                            color="primary" 
                            size="small"
                          />
                        </Box>
                      }
                      sx={{ m: 0 }}      
                    />
                  </ListItem>
                  <Divider component="div" />
                </Box>
              ))}
            </List>
          ) : (
            <Typography>You have no event registrations yet.</Typography>
          )}
        </StyledPaper>
      </Container>
    </Box>
  );
}