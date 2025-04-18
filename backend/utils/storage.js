const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data');

const readData = (file) => {
  try {
    const rawData = fs.readFileSync(path.join(dataPath, file));
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading ${file}:`, error);
    return [];
  }
};

const writeData = (file, data) => {
  try {
    fs.writeFileSync(path.join(dataPath, file), JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${file}:`, error);
  }
};

module.exports = { readData, writeData };