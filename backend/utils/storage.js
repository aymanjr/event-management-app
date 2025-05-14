const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_PATH)) {
  fs.mkdirSync(DATA_PATH, { recursive: true });
}

const readData = (filename) => {
  try {
    const filePath = path.join(DATA_PATH, filename);
    if (!fs.existsSync(filePath)) {
      return []; // Return empty array for new files
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    throw err;
  }
};

const writeData = (filename, data) => {
  try {
    const filePath = path.join(DATA_PATH, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Data written to ${filename} successfully`);
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    throw err;
  }
};

module.exports = { 
  readData, 
  writeData  // Now properly exported
};