const express = require('express');
const router = express.Router();
const { hashPassword } = require('../utils/auth');
const { readData, writeData } = require('../utils/storage');

// Register
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readData('users.json');
  
  // Check if user exists
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create new user
  const newUser = {
    id: `usr-${Date.now()}`,
    email,
    passwordHash: await hashPassword(password),
    firstName,
    lastName,
    role: 'participant',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData('users.json', users);

  res.status(201).json({ 
    message: 'User registered successfully',
    userId: newUser.id
  });
});

module.exports = router;