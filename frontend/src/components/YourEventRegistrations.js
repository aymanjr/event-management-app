import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Button, Grid } from '@mui/material';
import api from '../api';

export default function YourEventRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setRegistrations([]);
      return;
    }
    api.get(`/dashboard/${userId}/registrations`)
      .then(res => setRegistrations(res.data))
      .catch(() => setError('Failed to load your registrations.'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="120px">
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>Your Event Registrations</Typography>
        {registrations.length === 0 ? (
          <Typography variant="body2" color="text.secondary">You have not registered for any events yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {registrations.map(reg => (
              <Grid item xs={12} sm={6} md={4} key={reg.id}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>{reg.event?.title || reg.eventId}</Typography>
                    <Typography variant="body2" color="text.secondary">Date: {reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : '-'}</Typography>
                    <Typography variant="body2" color="text.secondary">Ticket: {reg.ticket?.ticketId || reg.ticketId || '-'}</Typography>
                    {reg.attended !== undefined && <Typography variant="body2" color="text.secondary">Attended: {reg.attended ? 'Yes' : 'No'}</Typography>}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
