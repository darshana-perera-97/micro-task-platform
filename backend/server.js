const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import utilities
const { initializeDataFiles } = require('./utils/fileHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const submissionRoutes = require('./routes/submission.routes');
const adminRoutes = require('./routes/admin.routes');
const qaRoutes = require('./routes/qa.routes');
const pointsRoutes = require('./routes/points.routes');

const app = express();
const PORT = process.env.PORT || 2000;

// Initialize data files
initializeDataFiles();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/points', pointsRoutes);

// Serve static files from React app build folder (if it exists)
const frontendBuildPath = path.join(__dirname, '../frontend/build');

if (fs.existsSync(frontendBuildPath)) {
  // Serve static files (CSS, JS, images, etc.)
  app.use(express.static(frontendBuildPath));
  
  // Catch-all handler: send back React's index.html file for client-side routing
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: 'API route not found',
      });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // If build folder doesn't exist, just return 404 for non-API routes
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({
        success: false,
        message: 'API route not found',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Frontend build not found. Please build the frontend first.',
      });
    }
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💾 Data files initialized in ./data directory`);
  if (fs.existsSync(frontendBuildPath)) {
    console.log(`🌐 Frontend build folder found - serving static files`);
    console.log(`   Access the app at http://localhost:${PORT}`);
  } else {
    console.log(`⚠️  Frontend build folder not found at: ${frontendBuildPath}`);
    console.log(`   Run 'npm run build' in the frontend directory to create the build folder`);
  }
});

module.exports = app;

