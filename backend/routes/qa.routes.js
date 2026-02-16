const express = require('express');
const router = express.Router();
const { getSubmissionsByStatus, approveSubmission, rejectSubmission } = require('../controllers/qa.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

// All QA routes require authentication and QA role
router.use(verifyToken);
router.use(allowRoles(['qa', 'admin'])); // Admin can also access QA routes

// Get submissions by status
router.get('/submissions', getSubmissionsByStatus);

// Approve submission
router.post('/submissions/:id/approve', approveSubmission);

// Reject submission
router.post('/submissions/:id/reject', rejectSubmission);

module.exports = router;

