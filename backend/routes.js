const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

// Health check endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Event Management API' });
});

// Auth routes
router.use('/auth', authRoutes);

module.exports = router;