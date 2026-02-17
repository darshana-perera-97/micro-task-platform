const { readJSON, writeJSON } = require('../utils/fileHandler');

/**
 * Get submissions by status
 */
const getSubmissionsByStatus = (req, res) => {
  try {
    const { status } = req.query;
    const submissions = readJSON('submissions');

    let filteredSubmissions = submissions;

    if (status) {
      filteredSubmissions = submissions.filter(sub => sub.status === status);
    }

    const sortedSubmissions = filteredSubmissions.sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
    );

    res.json({
      success: true,
      data: sortedSubmissions,
      count: sortedSubmissions.length,
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
 * Approve submission
 */
const approveSubmission = (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const submissions = readJSON('submissions');
    const submission = submissions.find(sub => sub.id === id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Submission is not pending',
      });
    }

    // Get reviewer info
    const users = readJSON('users');
    const reviewer = users.find(u => u.id === req.user.id);
    const reviewerName = reviewer ? reviewer.name : 'Unknown';
    const reviewerId = req.user.id;

    // Update submission
    submission.status = 'approved';
    submission.qaComment = comment || '';
    submission.reviewedAt = new Date().toISOString();
    submission.reviewerId = reviewerId;
    submission.reviewerName = reviewerName;

    // Update user points
    const user = users.find(u => u.id === submission.userId);
    if (user) {
      const pointsToAward = submission.points || 0;
      user.points = (user.points || 0) + pointsToAward;
      user.totalEarned = (user.totalEarned || 0) + pointsToAward;
      writeJSON('users', users);

      // Record points history
      const points = readJSON('points');
      const pointRecord = {
        id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: submission.userId,
        amount: pointsToAward,
        type: 'task_approval',
        description: `Task approved: ${submission.taskTitle}`,
        submissionId: submission.id,
        createdAt: new Date().toISOString(),
      };
      points.push(pointRecord);
      writeJSON('points', points);
      
      console.log(`Points awarded: User ${user.name} received ${pointsToAward} points for task "${submission.taskTitle}"`);
    }

    // Save submission
    writeJSON('submissions', submissions);

    res.json({
      success: true,
      message: 'Submission approved successfully',
      data: submission,
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
 * Reject submission
 */
const rejectSubmission = (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const submissions = readJSON('submissions');
    const submission = submissions.find(sub => sub.id === id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Submission is not pending',
      });
    }

    // Get reviewer info
    const users = readJSON('users');
    const reviewer = users.find(u => u.id === req.user.id);
    const reviewerName = reviewer ? reviewer.name : 'Unknown';
    const reviewerId = req.user.id;

    // Update submission
    submission.status = 'rejected';
    submission.qaComment = comment || 'Submission rejected';
    submission.reviewedAt = new Date().toISOString();
    submission.reviewerId = reviewerId;
    submission.reviewerName = reviewerName;

    // Save submission
    writeJSON('submissions', submissions);

    res.json({
      success: true,
      message: 'Submission rejected',
      data: submission,
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

