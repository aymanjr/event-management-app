import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Divider, 
  Chip, 
  IconButton, 
  useTheme,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { 
  LocationOn as LocationIcon, 
  Event as EventIcon, 
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
  AttachMoney as PriceIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../../api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
}));

const EventHeader = styled(Box)(({ theme, image }) => ({
  height: '400px',
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: theme.spacing(4),
  color: 'white',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    height: '300px',
  },
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
}));

const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{ color: 'primary.main', mr: 1 }}>{icon}</Box>
    <Typography variant="body1">
      <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>{label}:</Box>
      {value}
    </Typography>
  </Box>
);

export default function EventDetail() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleJoinEvent = async () => {
    if (!event) return;
    
    try {
      setIsJoining(true);
      const userId = localStorage.getItem('userId'); // Make sure to set this on login
      
      if (!userId) {
        // Redirect to login or show login modal
        navigate('/login', { state: { from: `/events/${id}` } });
        return;
      }

      const response = await api.post(`/events/${id}/register`, { userId });
      
      if (response.data.success) {
        setJoinSuccess(true);
        // Update the event to reflect the user has joined
        setEvent({ 
          ...event, 
          isJoined: true,
          registeredAttendees: (event.registeredAttendees || 0) + 1 
        });
        
        // Show success message
        setError('');
      }
    } catch (error) {
      console.error('Error joining event:', error);
      const errorMessage = error.response?.data?.error || 'Failed to join the event. Please try again.';
      setError(errorMessage);
    } finally {
      setIsJoining(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="textSecondary">
          Event not found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
        >
          Browse Events
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9ff', minHeight: '100vh' }}>
      <EventHeader image={event.image || 'https://source.unsplash.com/random/1200x800?event'}>        
        <BackButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </BackButton>
        
        <Container maxWidth="lg">
          <Chip 
            label={event.category || 'General'} 
            color="primary" 
            size="medium"
            sx={{ 
              mb: 2, 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: '0.9rem',
              px: 1.5,
              py: 1
            }} 
          />
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            {event.title}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <LocationIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">{event.location || 'Location TBD'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <EventIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">{formatDate(event.date)}</Typography>
            </Box>
            {event.price > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <PriceIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">${event.price.toFixed(2)}</Typography>
              </Box>
            )}
          </Box>
        </Container>
      </EventHeader>

      <Container maxWidth="lg" sx={{ py: 6, position: 'relative' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <StyledPaper sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                About This Event
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                {event.description || 'No description available for this event.'}
              </Typography>
              
              {event.agenda && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Event Agenda</Typography>
                  <Box component="ul" sx={{ pl: 2.5, '& li': { mb: 1 } }}>
                    {event.agenda.split('\n').map((item, index) => (
                      <li key={index}>
                        <Typography variant="body1">{item.trim()}</Typography>
                      </li>
                    ))}
                  </Box>
                </Box>
              )}
            </StyledPaper>

            <StyledPaper sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Location</Typography>
              <Box 
                sx={{ 
                  height: '300px', 
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                {/* Replace with your map component or iframe */}
                <Typography color="textSecondary">Map of {event.location}</Typography>
              </Box>
              <Typography variant="body1">{event.location}</Typography>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledPaper sx={{ p: 3, position: 'sticky', top: '20px' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                Event Details
              </Typography>
              
              <Stack spacing={2}>
                <DetailItem 
                  icon={<EventIcon />} 
                  label="Date & Time" 
                  value={formatDate(event.date)}
                />
                
                <DetailItem 
                  icon={<LocationIcon />} 
                  label="Location" 
                  value={event.location || 'TBD'}
                />
                
                {event.category && (
                  <DetailItem 
                    icon={<CategoryIcon />} 
                    label="Category" 
                    value={event.category}
                  />
                )}
                
                <DetailItem 
                  icon={<PriceIcon />} 
                  label="Price" 
                  value={event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
                />
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ textAlign: 'center', pt: 1 }}>
                  {joinSuccess ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      You've successfully joined this event!
                    </Alert>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleJoinEvent}
                      disabled={isJoining || event.isJoined}
                      sx={{
                        py: 1.5,
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                        boxShadow: '0 4px 14px rgba(26, 35, 126, 0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(26, 35, 126, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isJoining ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : event.isJoined ? (
                        'Already Joined'
                      ) : (
                        'Join Event'
                      )}
                    </Button>
                  )}
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2, fontSize: '0.85rem' }}>
                    {event.capacity ? 
                      `${event.registeredAttendees || 0} of ${event.capacity} spots filled` : 
                      'Unlimited spots available'}
                  </Typography>
                </Box>
              </Stack>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}