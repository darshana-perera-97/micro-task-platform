const jwt = require('jsonwebtoken');
const { readJSON } = require('../utils/fileHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token and attach user to request
 */
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization required.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const users = readJSON('users');
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token invalid.',
      });
    }

    // Check user status
    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval. Please wait for admin approval.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact admin.',
      });
    }

    // Attach user to request (without password)
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      status: user.status,
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Token verification failed.',
    });
  }
};

module.exports = {
  verifyToken,
  JWT_SECRET,
};

