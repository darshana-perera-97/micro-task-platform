const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/fileHandler');

/**
 * Create a new task (Admin only)
 */
const createTask = (req, res) => {
  try {
    const { title, type, description, instructions, points, active = true } = req.body;

    // Validation
    if (!title || !type || !description || !points) {
      return res.status(400).json({
        success: false,
        message: 'Title, type, description, and points are required',
      });
    }

    const validTypes = ['youtube', 'social_media', 'website_visit', 'survey'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task type. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    // Create new task
    const newTask = {
      id: uuidv4(),
      title,
      type,
      description,
      instructions: instructions || description,
      points: parseInt(points),
      active: active === true || active === 'true',
      createdAt: new Date().toISOString(),
    };

    // Save task
    const tasks = readJSON('tasks');
    tasks.push(newTask);
    writeJSON('tasks', tasks);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
    });
  }
};

/**
 * Get all tasks (Admin only)
 */
const getAllTasks = (req, res) => {
  try {
    const tasks = readJSON('tasks');
    const sortedTasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: sortedTasks,
      count: sortedTasks.length,
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
    });
  }
};

/**
 * Update task (Admin only)
 */
const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description, instructions, points, active } = req.body;

    const tasks = readJSON('tasks');
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Update task
    if (title) tasks[taskIndex].title = title;
    if (type) {
      const validTypes = ['youtube', 'social_media', 'website_visit', 'survey'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid task type. Must be one of: ${validTypes.join(', ')}`,
        });
      }
      tasks[taskIndex].type = type;
    }
    if (description) tasks[taskIndex].description = description;
    if (instructions !== undefined) tasks[taskIndex].instructions = instructions;
    if (points !== undefined) tasks[taskIndex].points = parseInt(points);
    if (active !== undefined) tasks[taskIndex].active = active === true || active === 'true';

    writeJSON('tasks', tasks);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: tasks[taskIndex],
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
    });
  }
};

/**
 * Delete task (Admin only)
 */
const deleteTask = (req, res) => {
  try {
    const { id } = req.params;

    const tasks = readJSON('tasks');
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if task has submissions
    const submissions = readJSON('submissions');
    const taskSubmissions = submissions.filter(sub => sub.taskId === id);

    if (taskSubmissions.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete task with existing submissions. Deactivate it instead.',
      });
    }

    // Delete task
    tasks.splice(taskIndex, 1);
    writeJSON('tasks', tasks);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
    });
  }
};

/**
 * Get all users (Admin only)
 */
const getAllUsers = (req, res) => {
  try {
    const users = readJSON('users');
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    res.json({
      success: true,
      data: usersWithoutPasswords,
      count: usersWithoutPasswords.length,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
};

/**
 * Get all submissions (Admin only)
 */
const getAllSubmissions = (req, res) => {
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
    console.error('Get all submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
    });
  }
};

/**
 * Create operator (Admin or QA user) - Admin only
 */
const createOperator = async (req, res) => {
  try {
    const { name, email, password, role = 'qa' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Only admin and qa roles allowed for operators
    if (role !== 'admin' && role !== 'qa') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Operators must be either "admin" or "qa"',
      });
    }

    const bcrypt = require('bcrypt');
    const { v4: uuidv4 } = require('uuid');

    // Check if user already exists
    const users = readJSON('users');
    const existingUser = users.find(u => u.email === email.toLowerCase());
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new operator
    const newOperator = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      points: 0,
      totalEarned: 0,
      status: 'active', // Operators are automatically active
      createdAt: new Date().toISOString(),
    };

    // Save operator
    users.push(newOperator);
    writeJSON('users', users);

    // Return operator without password
    const { password: _, ...operatorWithoutPassword } = newOperator;

    res.status(201).json({
      success: true,
      message: `${role === 'admin' ? 'Admin' : 'QA operator'} created successfully`,
      data: operatorWithoutPassword,
    });
  } catch (error) {
    console.error('Create operator error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating operator',
    });
  }
};

/**
 * Get pending user requests (users with status 'pending') - Admin only
 */
const getPendingUsers = (req, res) => {
  try {
    const users = readJSON('users');
    const pendingUsers = users
      .filter(u => u.status === 'pending')
      .map(({ password, ...user }) => user); // Remove passwords

    res.json({
      success: true,
      data: pendingUsers,
      count: pendingUsers.length,
    });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending users',
    });
  }
};

/**
 * Approve user request - Admin only
 */
const approveUser = (req, res) => {
  try {
    const { id } = req.params;

    const users = readJSON('users');
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (users[userIndex].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'User is not pending approval',
      });
    }

    // Approve user
    users[userIndex].status = 'active';
    writeJSON('users', users);

    const { password: _, ...userWithoutPassword } = users[userIndex];

    res.json({
      success: true,
      message: 'User approved successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving user',
    });
  }
};

/**
 * Reject/Suspend user - Admin only
 */
const updateUserStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'pending', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const users = readJSON('users');
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent changing admin status
    if (users[userIndex].role === 'admin' && status === 'suspended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot suspend admin users',
      });
    }

    // Update user status
    users[userIndex].status = status;
    writeJSON('users', users);

    const { password: _, ...userWithoutPassword } = users[userIndex];

    res.json({
      success: true,
      message: `User status updated to ${status}`,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getAllUsers,
  getAllSubmissions,
  createOperator,
  getPendingUsers,
  approveUser,
  updateUserStatus,
};

