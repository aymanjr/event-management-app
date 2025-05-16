import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { PeopleAlt as UsersIcon, Event as EventIcon } from '@mui/icons-material';

const AdminPanel = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
            component={Link}
            to="/admin/users"
          >
            <UsersIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6">Manage Users</Typography>
            <Typography variant="body2" color="text.secondary">
              View, add, edit, and manage users
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
            component={Link}
            to="/admin/events"
          >
            <EventIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6">Manage Events</Typography>
            <Typography variant="body2" color="text.secondary">
              View, add, edit, and manage events
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanel;
