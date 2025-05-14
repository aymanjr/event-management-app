import { Card, CardContent, Typography, Button, CardMedia, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)'
  },
  borderRadius: '12px',
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f8f9ff)',
  border: '1px solid rgba(0, 0, 0, 0.04)'
}));

const EventImage = styled(CardMedia)({
  height: 160,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)'
  }
});

const DateBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: 'rgba(26, 35, 126, 0.9)',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.875rem',
  fontWeight: 600,
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.1)'
}));

export default function EventCard({ event }) {
  const eventDate = event.date ? new Date(event.date) : null;
  const formattedDate = eventDate ? eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'Date TBD';

  return (
    <StyledCard>
      <Box sx={{ position: 'relative' }}>
        <EventImage
          image={event.image || 'https://source.unsplash.com/random/600x400?event'}
          title={event.title}
        />
        <DateBadge>
          <EventIcon fontSize="small" />
          {formattedDate}
        </DateBadge>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={event.category || 'General'} 
            size="small" 
            sx={{ 
              mb: 1.5, 
              backgroundColor: 'rgba(26, 35, 126, 0.1)',
              color: '#1a237e',
              fontWeight: 500
            }} 
          />
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              fontWeight: 700, 
              color: '#1a237e',
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {event.title}
          </Typography>
          
          {event.description && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {event.description}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            component={Link}
            to={`/events/${event.id}`}
            variant="contained"
            size="medium"
            fullWidth
            sx={{
              py: 0.8,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
              boxShadow: '0 4px 14px rgba(26, 35, 126, 0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(26, 35, 126, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View Event
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
}