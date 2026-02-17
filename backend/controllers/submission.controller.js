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
    const addedTasks = readJSON('addedTasks');
    const allTasks = [...tasks, ...addedTasks];
    const task = allTasks.find(t => t.id === taskId);

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

    // Check if user has already submitted this task (any status - one attempt only)
    const submissions = readJSON('submissions');
    const existingSubmission = submissions.find(
      sub => sub.taskId === taskId && sub.userId === userId
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this task. Each task can only be completed once.',
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
      userName: user?.name || 'Unknown',
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
    const userSubmissions = submissions.filter(sub => sub.userId === userId);

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

module.exports = {
  createSubmission,
  getUserSubmissions,
};

