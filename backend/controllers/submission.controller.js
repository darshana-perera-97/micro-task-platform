const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/fileHandler');

/**
 * Create a new submission
 */
const createSubmission = (req, res) => {
  try {
    const { taskId, evidence } = req.body;
    const userId = req.user.id;

    // Validation
    if (!taskId || !evidence) {
      return res.status(400).json({
        success: false,
        message: 'Task ID and evidence are required',
      });
    }

    // Check if task exists and is active
    const tasks = readJSON('tasks');
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (!task.active) {
      return res.status(400).json({
        success: false,
        message: 'Task is not active',
      });
    }

    // Check for duplicate submission (prevent same user submitting same task twice)
    const submissions = readJSON('submissions');
    const existingSubmission = submissions.find(
      sub => sub.taskId === taskId && sub.userId === userId && sub.status === 'pending'
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending submission for this task',
      });
    }

    // Check if user already completed this task
    const completedSubmission = submissions.find(
      sub => sub.taskId === taskId && sub.userId === userId && sub.status === 'approved'
    );

    if (completedSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this task',
      });
    }

    // Get user info
    const users = readJSON('users');
    const user = users.find(u => u.id === userId);

    // Create new submission
    const newSubmission = {
      id: uuidv4(),
      taskId,
      userId,
      userName: user.name,
      taskTitle: task.title,
      evidence: {
        image: evidence.image || '',
        text: evidence.text || '',
        link: evidence.link || '',
      },
      status: 'pending',
      qaComment: '',
      points: task.points,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
    };

    // Save submission
    submissions.push(newSubmission);
    writeJSON('submissions', submissions);

    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: newSubmission,
    });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating submission',
    });
  }
};

/**
 * Get user's submissions
 */
const getUserSubmissions = (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = readJSON('submissions');
    const userSubmissions = submissions
      .filter(sub => sub.userId === userId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json({
      success: true,
      data: userSubmissions,
      count: userSubmissions.length,
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
    });
  }
};

/**
 * Get submission by ID
 */
const getSubmissionById = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const submissions = readJSON('submissions');
    const submission = submissions.find(sub => sub.id === id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Users can only view their own submissions
    if (submission.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'qa') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error('Get submission by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission',
    });
  }
};

module.exports = {
  createSubmission,
  getUserSubmissions,
  getSubmissionById,
};

