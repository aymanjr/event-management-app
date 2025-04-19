// storage.js
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data');

// Rename functions to match what auth.js expects
const readData = (file) => {
  try {
    return JSON.parse(fs.readFileSync(`${DATA_PATH}/${file}`));
  } catch (err) {
    if (err.code === 'ENOENT') return []; // Return empty array if file doesn't exist
    throw err;
  }
};

const writeData = (file, data) => {
  fs.writeFileSync(`${DATA_PATH}/${file}`, JSON.stringify(data, null, 2));
};

// Export with the expected names
module.exports = { readData, writeData };