import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper
} from '@mui/material';
import api from '../../api';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    isPrivate: 'false',
    price: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Please login first');
      }

      const eventData = {
        ...formData,
        organizerId: userId,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        isPrivate: formData.isPrivate === 'true'
      };

      await api.post('/events', eventData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Event
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Event Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Event Date (YYYY-MM-DD)"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="2025-12-31"
          />

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="20"
          />

          <TextField
            fullWidth
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="299"
          />

          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            margin="normal"
            placeholder="https://example.com/image.jpg"
          />

          <TextField
            fullWidth
            label="Private Event (true/false)"
            name="isPrivate"
            value={formData.isPrivate}
            onChange={handleChange}
            margin="normal"
            placeholder="false"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
