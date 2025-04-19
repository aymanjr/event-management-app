import { useState, useEffect } from 'react'; // Add this import
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import api from '../../api';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{event.title}</Typography>
      <Typography>Location: {event.location}</Typography>
      <Typography>Date: {new Date(event.date).toLocaleString()}</Typography>
    </Box>
  );
}