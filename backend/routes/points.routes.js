const express = require('express');
const router = express.Router();
const { getUserPoints, claimReward } = require('../controllers/points.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All points routes require authentication
router.use(verifyToken);

// Get user's points
router.get('/me', getUserPoints);

// Claim reward
router.post('/claim', claimReward);

module.exports = router;

