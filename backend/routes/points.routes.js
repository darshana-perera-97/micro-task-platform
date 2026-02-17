const express = require('express');
const router = express.Router();
const { getUserPoints, claimReward } = require('../controllers/points.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All points routes require authentication
router.use(verifyToken);

router.get('/me', getUserPoints);
router.post('/claim', claimReward);

module.exports = router;

