const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  updateTask,
  getAdminAnalytics,
  getAllUsers,
  updateUserStatus,
  getAllClaims,
} = require('../controllers/admin.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(allowRoles(['admin']));

// Task management
router.post('/tasks', createTask);
router.get('/tasks', getAllTasks);
router.put('/tasks/:id', updateTask);

// Analytics
router.get('/analytics', getAdminAnalytics);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);

// Claims management
router.get('/claims', getAllClaims);

module.exports = router;

