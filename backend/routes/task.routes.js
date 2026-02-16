const express = require('express');
const router = express.Router();
const { getActiveTasks, getTaskById } = require('../controllers/task.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All task routes require authentication
router.use(verifyToken);

// Get active tasks
router.get('/', getActiveTasks);

// Get task by ID
router.get('/:id', getTaskById);

module.exports = router;

