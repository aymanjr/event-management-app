import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import api from '../../api';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEventAndRegistration = async () => {
      try {
        const [eventResponse, registrationsResponse] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/dashboard/${localStorage.getItem('userId')}/registrations`)
        ]);
        setEvent(eventResponse.data);
        
        // Check if user is already registered for this event
        const isUserRegistered = registrationsResponse.data.some(
          reg => reg.eventId === id
        );
        setIsRegistered(isUserRegistered);
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndRegistration();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  const handleRegister = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login first');
      return;
    }

    setRegistering(true);
    try {
      await api.post(`/events/${id}/register`, { userId });
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>{event.title}</Typography>
      <Typography sx={{ mb: 1 }}>Location: {event.location}</Typography>
      <Typography sx={{ mb: 2 }}>Date: {new Date(event.date).toLocaleString()}</Typography>
      
      {isRegistered ? (
        <Typography color="primary" sx={{ mt: 2 }}>
          You are already registered for this event
        </Typography>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          disabled={registering}
        >
          {registering ? 'Registering...' : 'Register for Event'}
        </Button>
      )}
    </Box>
  );
}