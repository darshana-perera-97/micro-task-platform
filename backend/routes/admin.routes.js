const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getAllUsers,
  getAllSubmissions,
  createOperator,
  getPendingUsers,
  approveUser,
  updateUserStatus,
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
router.delete('/tasks/:id', deleteTask);

// User management
router.get('/users', getAllUsers);
router.get('/users/pending', getPendingUsers);
router.post('/users/:id/approve', approveUser);
router.put('/users/:id/status', updateUserStatus);

// Operator management
router.post('/operators', createOperator);

// Submission management
router.get('/submissions', getAllSubmissions);

module.exports = router;

