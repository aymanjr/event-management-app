const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/storage');

// Create new event
router.post('/', (req, res) => {
  const events = readData('events.json');
  const newEvent = {
    id: `evt-${Date.now()}`,
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    location: req.body.location,
    organizerId: req.body.organizerId, // Should come from authenticated user
    capacity: req.body.capacity,
    isPrivate: req.body.isPrivate || false,
    price: req.body.price || 0,
    image: req.body.image || '',
    createdAt: new Date().toISOString()
  };
  
  events.push(newEvent);
  writeData('events.json', events);
  
  res.status(201).json(newEvent);
});

// Get all public events
router.get('/', (req, res) => {
  const events = readData('events.json');
  res.json(events.filter(event => !event.isPrivate));
});
// Register for event
router.post('/:id/register', (req, res) => {
    const eventId = req.params.id;
    const { userId } = req.body;
    
    const events = readData('events.json');
    const registrations = readData('registrations.json');
    
    const event = events.find(e => e.id === eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Check if already registered
    if (registrations.some(r => r.eventId === eventId && r.userId === userId)) {
      return res.status(400).json({ error: 'Already registered' });
    }
    
    // Check capacity
    const eventRegistrations = registrations.filter(r => r.eventId === eventId).length;
    if (eventRegistrations >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }
    
    const newRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      userId,
      registeredAt: new Date().toISOString(),
      attended: false
    };
    
    registrations.push(newRegistration);
    writeData('registrations.json', registrations);
    
    res.status(201).json(newRegistration);
  });
module.exports = router;