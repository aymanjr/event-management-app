import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress
} from '@mui/material';
import axios from 'axios';

export default function EditEventDialog({ open, onClose, event, onEventUpdated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    isPrivate: false,
    price: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? event.date.slice(0, 10) : '',
        location: event.location || '',
        capacity: event.capacity || '',
        isPrivate: event.isPrivate || false,
        price: event.price || '',
        image: event.image || ''
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isPrivate' ? value === 'true' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:3001/api/events/${event.id || event._id}`, {
        ...formData,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        isPrivate: formData.isPrivate === true || formData.isPrivate === 'true'
      });
      if (onEventUpdated) onEventUpdated();
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Event</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={formData.description}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={formData.location}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="capacity"
            label="Capacity"
            type="number"
            fullWidth
            value={formData.capacity}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="text"
            fullWidth
            value={formData.image}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="isPrivate"
            label="Is Private"
            select
            SelectProps={{ native: true }}
            fullWidth
            value={formData.isPrivate.toString()}
            onChange={handleChange}
          >
            <option value={false}>false</option>
            <option value={true}>true</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={22} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
