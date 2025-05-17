import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Box, Alert, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import EventCard from '../components/EventCard';
import api from '../api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Custom styled Paper component for the page background
  const PagePaper = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: theme.spacing(4),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginTop: theme.spacing(2),
  }));

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%)',
      py: 4,
      px: { xs: 2, sm: 3 }
    }}>
      <Container maxWidth="xl">
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{
            color: '#1a237e',
            fontWeight: 700,
            mb: 4,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 80,
              height: 4,
              background: 'linear-gradient(90deg, #1a237e, #5c6bc0)',
              borderRadius: 2
            }
          }}
        >
          Upcoming Events
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(211, 47, 47, 0.1)'
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, maxWidth: 400 }}>
          <input
            type="text"
            placeholder="Filter by title..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #bdbdbd',
              fontSize: '16px',
              marginBottom: '10px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </Box>
        <PagePaper elevation={0}>
          {events.filter(event => event.title.toLowerCase().includes(filter.toLowerCase())).length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              color: 'text.secondary'
            }}>
              <Typography variant="h6" color="textSecondary">
                No events found
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Check back later for upcoming events!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {events.filter(event => event.title.toLowerCase().includes(filter.toLowerCase())).map((event) => (
                <Grid item key={event.id} xs={12} sm={6} lg={4}>
                  <EventCard event={event} />
                </Grid>
              ))}
            </Grid>
          )}
        </PagePaper>
      </Container>
    </Box>
  );
};

export default Events;