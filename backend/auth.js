const express = require('express');
const router = express.Router();
const { readData, writeData } = require('./utils/storage');

router.post('/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readData('users.json');
  
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email,
    password,
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

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readData('users.json');
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ 
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName
    }
  });
});

module.exports = router;