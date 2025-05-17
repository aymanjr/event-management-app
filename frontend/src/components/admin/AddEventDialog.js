import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import axios from 'axios';

export default function AddEventDialog({ open, onClose, onEventAdded }) {
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
      const organizerId = localStorage.getItem('userId');
      const eventData = {
        ...formData,
        organizerId,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        isPrivate: formData.isPrivate === true || formData.isPrivate === 'true'
      };
      await axios.post('http://localhost:3000/api/events', eventData);
      if (onEventAdded) onEventAdded();
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Event</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            required
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            required
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            value={formData.date}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            fullWidth
            required
            value={formData.location}
            onChange={handleChange}
          />

          <TextField
            margin="dense"
            name="capacity"
            label="Capacity"
            type="number"
            fullWidth
            required
            value={formData.capacity}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            required
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            fullWidth
            value={formData.image}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="isPrivate"
            label="Private Event (true/false)"
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
            {loading ? 'Adding...' : 'Add Event'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
