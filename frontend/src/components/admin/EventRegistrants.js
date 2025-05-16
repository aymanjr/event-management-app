import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../api';

const EventRegistrants = () => {
  const { eventId } = useParams();
  const [registrants, setRegistrants] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventResponse = await api.get(`/api/events/${eventId}`);
        setEvent(eventResponse.data);

        // Fetch event registrants
        const registrantsResponse = await api.get(`/api/events/${eventId}/registrants`);
        setRegistrants(registrantsResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch event registrants');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleDeleteRegistrant = async (registrantId) => {
    try {
      await api.delete(`/api/events/${eventId}/registrants/${registrantId}`);
      setRegistrants(registrants.filter(r => r.id !== registrantId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete registrant');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {event && (
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Event Registrants
          </Typography>
        </Box>
      )}

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Registration Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No registrants found for this event
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                registrants.map((registrant) => (
                  <TableRow 
                    key={registrant.id}
                    sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell>{`${registrant.firstName} ${registrant.lastName}`}</TableCell>
                    <TableCell>{registrant.email}</TableCell>
                    <TableCell>
                      {new Date(registrant.registrationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: registrant.status === 'registered' ? 'success.light' : 'warning.light',
                          color: registrant.status === 'registered' ? 'success.dark' : 'warning.dark',
                          py: 0.5,
                          px: 1.5,
                          borderRadius: 1,
                          display: 'inline-block',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        {registrant.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Remove Registrant">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteRegistrant(registrant.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default EventRegistrants;
