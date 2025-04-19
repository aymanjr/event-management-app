import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardContent>
        <Typography gutterBottom variant="h5">
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.location}
        </Typography>
        <Button 
          component={Link} 
          to={`/events/${event.id}`}
          variant="contained"
          sx={{ mt: 2 }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}