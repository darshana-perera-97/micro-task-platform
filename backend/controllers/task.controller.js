const { readJSON } = require('../utils/fileHandler');

/**
 * Get all active tasks (for users)
 */
const getActiveTasks = (req, res) => {
  try {
    const tasks = readJSON('tasks');
    const addedTasks = readJSON('addedTasks');
    
    // Ensure both are arrays
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    const addedTasksArray = Array.isArray(addedTasks) ? addedTasks : [];
    
    // Combine both sources
    const allTasksMap = new Map();
    tasksArray.forEach(task => {
      if (task && task.id) {
        allTasksMap.set(task.id, task);
      }
    });
    addedTasksArray.forEach(task => {
      if (task && task.id) {
        allTasksMap.set(task.id, task);
      }
    });
    
    const allTasks = Array.from(allTasksMap.values());
    const activeTasks = allTasks.filter(task => task && task.active === true);

    console.log(`getActiveTasks: Found ${tasksArray.length} tasks, ${addedTasksArray.length} addedTasks, ${activeTasks.length} active tasks`);

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
    const addedTasks = readJSON('addedTasks');
    
    const allTasks = [...tasks, ...addedTasks];
    const task = allTasks.find(t => t.id === id);

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

