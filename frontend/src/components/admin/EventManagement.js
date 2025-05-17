import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, People as PeopleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddEventDialog from './AddEventDialog';
import EditEventDialog from './EditEventDialog';

const EventManagement = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
  });
  const [openAddEventDialog, setOpenAddEventDialog] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [openEditEventDialog, setOpenEditEventDialog] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleOpenDialog = () => {
    setFormData({ title: '', description: '', date: '', location: '', capacity: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/events', formData);
      handleCloseDialog();
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:3001/api/events/${eventId}`);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Event Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpenAddEventDialog(true)}
        sx={{ mb: 3, mr: 2 }}
      >
        Add Event
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.capacity}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton 
                      color="info" 
                      onClick={() => navigate(`/admin/events/${event._id}/registrants`)}
                      title="View Registrants"
                    >
                      <PeopleIcon />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      title="Edit Event"
                      onClick={() => { setEditEvent(event); setOpenEditEventDialog(true); }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteEvent(event._id)}
                      title="Delete Event"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Old dialog removed, now using AddEventDialog */}
      <AddEventDialog 
        open={openAddEventDialog} 
        onClose={() => setOpenAddEventDialog(false)} 
        onEventAdded={fetchEvents}
      />
      <EditEventDialog
        open={openEditEventDialog}
        onClose={() => setOpenEditEventDialog(false)}
        event={editEvent}
        onEventUpdated={fetchEvents}
      />
    </Container>
  );
};

export default EventManagement;
