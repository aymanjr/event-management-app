const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registrant = require('../models/Registrant');
const auth = require('../middleware/auth');

// Get all registrants for a specific event
router.get('/:eventId/registrants', auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrants = await Registrant.find({ eventId });
    res.json(registrants);
  } catch (error) {
    console.error('Error fetching registrants:', error);
    res.status(500).json({ error: 'Error fetching registrants' });
  }
});

// Add a registrant to an event
router.post('/:eventId/registrants', auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const registrant = new Registrant({
      eventId,
      ...req.body,
      registrationDate: new Date(),
      status: 'registered'
    });

    await registrant.save();
    res.status(201).json(registrant);
  } catch (error) {
    console.error('Error adding registrant:', error);
    res.status(500).json({ error: 'Error adding registrant' });
  }
});

// Delete a registrant
router.delete('/:eventId/registrants/:registrantId', auth, async (req, res) => {
  try {
    const { registrantId } = req.params;
    await Registrant.findByIdAndDelete(registrantId);
    res.status(200).json({ message: 'Registrant deleted successfully' });
  } catch (error) {
    console.error('Error deleting registrant:', error);
    res.status(500).json({ error: 'Error deleting registrant' });
  }
});

module.exports = router;
