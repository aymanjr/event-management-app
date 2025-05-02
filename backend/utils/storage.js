const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data');

const readData = (filename) => {
  try {
    const filePath = path.join(DATA_PATH, filename);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return [];
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    throw err; // Re-throw to be caught by the route handler
  }
};

module.exports = { readData };