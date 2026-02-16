const { readJSON, writeJSON } = require('../utils/fileHandler');

/**
 * Get submissions by status (QA only)
 */
const getSubmissionsByStatus = (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const submissions = readJSON('submissions');

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const filteredSubmissions = submissions
      .filter(sub => sub.status === status)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json({
      success: true,
      data: filteredSubmissions,
      count: filteredSubmissions.length,
    });
  } catch (error) {
    console.error('Get submissions by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
    });
  }
};

/**
 * Approve submission (QA only)
 */
const approveSubmission = (req, res) => {
  try {
    const { id } = req.params;
    const { comment = '' } = req.body;

    const submissions = readJSON('submissions');
    const submissionIndex = submissions.findIndex(sub => sub.id === id);

    if (submissionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    const submission = submissions[submissionIndex];

    if (submission.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Submission is not pending',
      });
    }

    // Update submission status
    submissions[submissionIndex].status = 'approved';
    submissions[submissionIndex].qaComment = comment;
    submissions[submissionIndex].reviewedAt = new Date().toISOString();

    writeJSON('submissions', submissions);

    // Update user points
    const users = readJSON('users');
    const userIndex = users.findIndex(u => u.id === submission.userId);

    if (userIndex !== -1) {
      users[userIndex].points += submission.points;
      users[userIndex].totalEarned += submission.points;
      writeJSON('users', users);

      // Record points transaction
      const points = readJSON('points');
      points.push({
        id: require('uuid').v4(),
        userId: submission.userId,
        submissionId: submission.id,
        points: submission.points,
        type: 'earned',
        createdAt: new Date().toISOString(),
      });
      writeJSON('points', points);
    }

    res.json({
      success: true,
      message: 'Submission approved successfully',
      data: submissions[submissionIndex],
    });
  } catch (error) {
    console.error('Approve submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving submission',
    });
  }
};

/**
 * Reject submission (QA only)
 */
const rejectSubmission = (req, res) => {
  try {
    const { id } = req.params;
    const { comment = '' } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required when rejecting a submission',
      });
    }

    const submissions = readJSON('submissions');
    const submissionIndex = submissions.findIndex(sub => sub.id === id);

    if (submissionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    const submission = submissions[submissionIndex];

    if (submission.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Submission is not pending',
      });
    }

    // Update submission status
    submissions[submissionIndex].status = 'rejected';
    submissions[submissionIndex].qaComment = comment;
    submissions[submissionIndex].reviewedAt = new Date().toISOString();

    writeJSON('submissions', submissions);

    res.json({
      success: true,
      message: 'Submission rejected',
      data: submissions[submissionIndex],
    });
  } catch (error) {
    console.error('Reject submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting submission',
    });
  }
};

module.exports = {
  getSubmissionsByStatus,
  approveSubmission,
  rejectSubmission,
};

