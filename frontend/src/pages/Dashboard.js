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
  Divider
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Welcome, {firstName || 'User'}!
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/create-event')}
              sx={{ mr: 2 }}
            >
              Create Event
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Your Event Registrations
        </Typography>
        
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : registrations.length > 0 ? (
          <List component="div">
            {registrations.map((reg) => (
              <Box component="div" key={reg.id}>
                <ListItem alignItems="flex-start" component="div">
                  <ListItemText
                    primary={reg.event?.title || 'Unknown Event'}
                    secondary={
                      <Box component="div">
                        <Typography component="span" display="block" variant="body2">
                          {reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : 'No date'} • {reg.event?.location || 'No location'}
                        </Typography>
                        <Typography component="span" display="block" variant="body2">
                          Ticket: {reg.ticketId}
                        </Typography>
                        <Box component="div" sx={{ mt: 1 }}>
                          <Chip 
                            icon={reg.attended ? <CheckCircle /> : <Cancel />}
                            label={reg.attended ? 'Attended' : 'Not attended'}
                            color={reg.attended ? 'success' : 'default'}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip 
                            label={`$${reg.event?.price || 0}`} 
                            color="primary" 
                            size="small"
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="div" />
              </Box>
            ))}
          </List>
        ) : (
          <Typography>You have no event registrations yet.</Typography>
        )}
      </Paper>
    </Container>
  );
}