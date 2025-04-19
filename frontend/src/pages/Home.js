import { useState, useEffect } from 'react';
import api from '../api';
import { Box } from '@mui/material';
import EventCard from '../components/EventCard';

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      p: 2
    }}>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </Box>
  );
}