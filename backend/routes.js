const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const eventRoutes = require('./routes/events');
const { readData } = require('./utils/storage');

router.get('/', (req, res) => {
  res.json({ message: 'Event Management API' });
});

router.use('/auth', authRoutes);
router.use('/events', eventRoutes); // Add this line
router.get('/dashboard/:userId/registrations', async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching registrations for ${userId}`);

  try {
    // Read all data files first
    const [allRegistrations, allEvents, allTickets] = await Promise.all([
      readData('registrations.json'),
      readData('events.json'),
      readData('tickets.json')
    ]);

    console.log(`Found ${allRegistrations.length} registrations, ${allEvents.length} events, ${allTickets.length} tickets`);

    // Filter and map the data
    const userRegistrations = allRegistrations
      .filter(reg => reg.userId === userId)
      .map(reg => {
        const event = allEvents.find(e => e.id === reg.eventId);
        const ticket = allTickets.find(t => t.ticketId === reg.ticketId);

        if (!event) console.warn(`Event not found for registration ${reg.id}`);
        if (!ticket) console.warn(`Ticket not found for registration ${reg.id}`);

        return {
          ...reg,
          event: event || null,
          ticket: ticket || null
        };
      });

    console.log(`Found ${userRegistrations.length} registrations for user`);
    res.json(userRegistrations);
    
  } catch (err) {
    console.error('Dashboard route error:', err);
    res.status(500).json({ 
      error: 'Failed to process registrations',
      details: err.message 
    });
  }
});

module.exports = router;