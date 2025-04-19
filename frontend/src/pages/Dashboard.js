import { useState, useEffect } from 'react';
import api from '../api';
import { Typography, Box } from '@mui/material';

export default function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    api.get(`/dashboard/${userId}/registrations`)
      .then(res => setRegistrations(res.data));
  }, [userId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>My Events</Typography>
      {registrations.map(reg => (
        <Box key={reg.id} sx={{ mb: 2, p: 2, border: '1px solid #ddd' }}>
          <Typography variant="h6">{reg.event.title}</Typography>
          <Typography>Ticket: {reg.ticketId}</Typography>
        </Box>
      ))}
    </Box>
  );
}