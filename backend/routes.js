const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const eventRoutes = require('./routes/events');

router.get('/', (req, res) => {
  res.json({ message: 'Event Management API' });
});

router.use('/auth', authRoutes);
router.use('/events', eventRoutes); // Add this line

module.exports = router;