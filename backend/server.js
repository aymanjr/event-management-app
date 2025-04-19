const express = require('express');
const cors = require('cors'); // ✅ CORS
const path = require('path');
const app = express();

// CORS middleware (should come early)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSP Header
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; media-src 'self' data:;"
  );
  next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use('/api', require('./routes')); // ✅ make sure this exists

// Start server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
  console.log('API available at http://localhost:3001/api');
});
