const express = require('express');
const router = express.Router();

// Import route modules
const eventRoutes = require('./events');
const userRoutes = require('./users');
const registrantRoutes = require('./registrants');

// Use route modules
router.use('/events', eventRoutes);
router.use('/users', userRoutes);
router.use('/events', registrantRoutes);

module.exports = router;
