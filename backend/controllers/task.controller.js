const { readJSON } = require('../utils/fileHandler');

/**
 * Get all active tasks (for users)
 */
const getActiveTasks = (req, res) => {
  try {
    const tasks = readJSON('tasks');
    const activeTasks = tasks.filter(task => task.active === true);

    res.json({
      success: true,
      data: activeTasks,
      count: activeTasks.length,
    });
  } catch (error) {
    console.error('Get active tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
    });
  }
};

/**
 * Get task by ID
 */
const getTaskById = (req, res) => {
  try {
    const { id } = req.params;
    const tasks = readJSON('tasks');
    const task = tasks.find(t => t.id === id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
    });
  }
};

module.exports = {
  getActiveTasks,
  getTaskById,
};

