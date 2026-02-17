const express = require('express');
const router = express.Router();
const { createSubmission, getUserSubmissions } = require('../controllers/submission.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All submission routes require authentication
router.use(verifyToken);

router.post('/', createSubmission);
router.get('/me', getUserSubmissions);

module.exports = router;

