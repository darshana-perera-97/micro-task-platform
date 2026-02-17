const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Read JSON file from data directory
 * @param {string} fileName - Name of the JSON file (without .json extension)
 * @returns {Array|Object} - Parsed JSON data or empty array if file doesn't exist
 */
function readJSON(fileName) {
  const filePath = path.join(dataDir, `${fileName}.json`);
  
  try {
    if (!fs.existsSync(filePath)) {
      // Create empty array file if it doesn't exist
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8').trim();
    
    // Handle empty or whitespace-only files
    if (!fileContent || fileContent === '') {
      return [];
    }
    
    const parsed = JSON.parse(fileContent);
    // Ensure we return an array for addedTasks
    if (fileName === 'addedTasks' && !Array.isArray(parsed)) {
      console.warn(`addedTasks.json is not an array, resetting to empty array`);
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error reading ${fileName}.json:`, error);
    // If file exists but is corrupted, reset it to empty array
    if (fileName === 'addedTasks') {
      try {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
        console.log(`Reset corrupted ${fileName}.json to empty array`);
      } catch (writeError) {
        console.error(`Failed to reset ${fileName}.json:`, writeError);
      }
    }
    return [];
  }
}

/**
 * Write JSON file to data directory
 * @param {string} fileName - Name of the JSON file (without .json extension)
 * @param {Array|Object} data - Data to write
 * @returns {boolean} - Success status
 */
function writeJSON(fileName, data) {
  const filePath = path.join(dataDir, `${fileName}.json`);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${fileName}.json:`, error);
    return false;
  }
}

/**
 * Initialize data files with default structure if they don't exist
 */
function initializeDataFiles() {
  const files = ['users', 'tasks', 'submissions', 'points', 'claims', 'addedTasks'];
  
  files.forEach(file => {
    const filePath = path.join(dataDir, `${file}.json`);
    if (!fs.existsSync(filePath)) {
      writeJSON(file, []);
      console.log(`✅ Created ${file}.json`);
    }
  });
  
  // Initialize adminAnalytics.json with empty object if it doesn't exist
  const analyticsPath = path.join(dataDir, 'adminAnalytics.json');
  if (!fs.existsSync(analyticsPath)) {
      writeJSON('adminAnalytics', {});
      console.log(`✅ Created adminAnalytics.json`);
  }
}

module.exports = {
  readJSON,
  writeJSON,
  dataDir,
  initializeDataFiles,
};

