const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/storage');
const { v4: uuidv4 } = require('uuid');

// Create new event with ticket pool
router.post('/', (req, res) => {
  const events = readData('events.json');
  const tickets = readData('tickets.json');
  
  const newEvent = {
    id: `evt-${uuidv4()}`,
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    location: req.body.location,
    organizerId: req.body.organizerId,
    capacity: req.body.capacity,
    isPrivate: req.body.isPrivate || false,
    price: req.body.price || 0,
    image: req.body.image || '',
    createdAt: new Date().toISOString()
  };

  // Generate ticket pool
  const eventTickets = Array.from({ length: newEvent.capacity }, (_, i) => ({
    eventId: newEvent.id,
    ticketId: `TCK-${newEvent.id}-${i}-${uuidv4().slice(0, 8)}`, // Unique ticket ID
    isUsed: false,
    createdAt: new Date().toISOString()
  }));

  events.push(newEvent);
  writeData('events.json', events);
  
  writeData('tickets.json', [...tickets, ...eventTickets]);

  res.status(201).json({
    ...newEvent,
    ticketsGenerated: eventTickets.length
  });
});

// Register for event (claims a ticket)
router.post('/:id/register', (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;
  
  const events = readData('events.json');
  const tickets = readData('tickets.json');
  const registrations = readData('registrations.json');

  // Validate event exists
  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Check if already registered
  const existingRegistration = registrations.find(
    r => r.eventId === eventId && r.userId === userId
  );
  if (existingRegistration) {
    return res.status(400).json({ 
      error: 'Already registered',
      ticketId: existingRegistration.ticketId
    });
  }

  // Find available ticket
  const availableTicket = tickets.find(
    t => t.eventId === eventId && !t.isUsed
  );
  
  if (!availableTicket) {
    return res.status(400).json({ error: 'Event is full' });
  }

  // Update ticket
  availableTicket.isUsed = true;
  availableTicket.userId = userId;
  availableTicket.assignedAt = new Date().toISOString();

  // Create registration
  const newRegistration = {
    id: `reg-${uuidv4()}`,
    eventId,
    userId,
    ticketId: availableTicket.ticketId,
    registeredAt: new Date().toISOString(),
    attended: false
  };

  writeData('tickets.json', tickets);
  writeData('registrations.json', [...registrations, newRegistration]);

  res.status(201).json({
    message: 'Registration successful',
    ticket: {
      id: availableTicket.ticketId,
      event: {
        title: event.title,
        date: event.date,
        location: event.location
      },
      qrContent: JSON.stringify({ // For QR generation
        ticketId: availableTicket.ticketId,
        eventId,
        userId
      })
    }
  });
});

// Validate ticket (for scanning)
router.post('/:id/validate-ticket', (req, res) => {
  const { ticketId } = req.body;
  const tickets = readData('tickets.json');
  const registrations = readData('registrations.json');

  const ticket = tickets.find(t => t.ticketId === ticketId);
  if (!ticket) {
    return res.status(404).json({ valid: false, error: 'Invalid ticket' });
  }

  const registration = registrations.find(
    r => r.ticketId === ticketId && !r.attended
  );

  if (!registration) {
    return res.json({ 
      valid: false,
      error: ticket.isUsed ? 'Ticket already scanned' : 'Ticket not assigned'
    });
  }

  // Mark as attended
  registration.attended = true;
  writeData('registrations.json', registrations);

  res.json({
    valid: true,
    ticketId,
    eventId: ticket.eventId,
    userId: ticket.userId,
    timestamp: new Date().toISOString()
  });
});

// Get all public events
router.get('/', (req, res) => {
  const events = readData('events.json');
  res.json(events.filter(event => !event.isPrivate));
});

// Get event details
router.get('/:id', (req, res) => {
  const events = readData('events.json');
  const event = events.find(e => e.id === req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Get remaining tickets
  const tickets = readData('tickets.json');
  const availableTickets = tickets.filter(
    t => t.eventId === event.id && !t.isUsed
  ).length;

  res.json({
    ...event,
    availableTickets,
    totalTickets: event.capacity
  });
});

module.exports = router;