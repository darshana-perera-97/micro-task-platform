const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/fileHandler');

/**
 * Create a new task (Admin only)
 */
const createTask = (req, res) => {
  try {
    const { title, type, description, instructions, points, active = true, evidenceType = 'text', completedAmount = 0 } = req.body;

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

    const validEvidenceTypes = ['text', 'url', 'image'];
    if (evidenceType && !validEvidenceTypes.includes(evidenceType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid evidence type. Must be one of: ${validEvidenceTypes.join(', ')}`,
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
      evidenceType: evidenceType || 'text',
      completedAmount: parseInt(completedAmount) || 0,
      createdAt: new Date().toISOString(),
    };

    // Save task to addedTasks.json
    const addedTasks = readJSON('addedTasks');
    // Ensure addedTasks is an array
    const tasksArray = Array.isArray(addedTasks) ? addedTasks : [];
    tasksArray.push(newTask);
    
    const writeSuccess = writeJSON('addedTasks', tasksArray);
    if (!writeSuccess) {
      console.error('Failed to write to addedTasks.json');
      return res.status(500).json({
        success: false,
        message: 'Error saving task to file',
      });
    }
    
    console.log(`Task saved to addedTasks.json. Total tasks: ${tasksArray.length}`);

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
 * Get all tasks (Admin only) - Returns tasks from addedTasks.json
 */
const getAllTasks = (req, res) => {
  try {
    const addedTasks = readJSON('addedTasks');
    const tasks = readJSON('tasks');
    
    // Ensure both are arrays
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    const addedTasksArray = Array.isArray(addedTasks) ? addedTasks : [];
    
    // Combine both addedTasks and tasks, removing duplicates by ID
    const allTasksMap = new Map();
    
    // Add tasks from tasks.json first
    tasksArray.forEach(task => {
      if (task && task.id) {
        allTasksMap.set(task.id, task);
      }
    });
    
    // Add/override with tasks from addedTasks.json
    addedTasksArray.forEach(task => {
      if (task && task.id) {
        allTasksMap.set(task.id, task);
      }
    });
    
    const allTasks = Array.from(allTasksMap.values());
    const sortedTasks = allTasks.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    console.log(`getAllTasks: Found ${tasksArray.length} tasks, ${addedTasksArray.length} addedTasks, ${sortedTasks.length} total tasks`);

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
    const { title, type, description, instructions, points, active, evidenceType, completedAmount } = req.body;

    // Read both task sources
    const addedTasks = readJSON('addedTasks');
    const tasks = readJSON('tasks');
    
    // Check in addedTasks first (newly created tasks)
    let taskIndex = addedTasks.findIndex(t => t.id === id);
    let taskSource = 'addedTasks';
    
    // If not found, check in tasks.json
    if (taskIndex === -1) {
      taskIndex = tasks.findIndex(t => t.id === id);
      taskSource = 'tasks';
    }

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Get the task array to update
    const taskArray = taskSource === 'addedTasks' ? addedTasks : tasks;
    const task = taskArray[taskIndex];

    // Update task fields
    if (title !== undefined) task.title = title;
    if (type !== undefined) {
      const validTypes = ['youtube', 'social_media', 'website_visit', 'survey'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid task type. Must be one of: ${validTypes.join(', ')}`,
        });
      }
      task.type = type;
    }
    if (description !== undefined) task.description = description;
    if (instructions !== undefined) task.instructions = instructions;
    if (points !== undefined) task.points = parseInt(points);
    if (active !== undefined) task.active = active === true || active === 'true';
    if (evidenceType !== undefined) {
      const validEvidenceTypes = ['text', 'url', 'image'];
      if (!validEvidenceTypes.includes(evidenceType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid evidence type. Must be one of: ${validEvidenceTypes.join(', ')}`,
        });
      }
      task.evidenceType = evidenceType;
    }
    if (completedAmount !== undefined) task.completedAmount = parseInt(completedAmount) || 0;

    // Save updated task
    writeJSON(taskSource, taskArray);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
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
 * Get admin analytics and save to adminAnalytics.json
 */
const getAdminAnalytics = (req, res) => {
  try {
    const users = readJSON('users');
    const tasks = readJSON('tasks');
    const addedTasks = readJSON('addedTasks');
    const submissions = readJSON('submissions');
    const points = readJSON('points');
    const claims = readJSON('claims');

    // Ensure all data is in array format
    const usersArray = Array.isArray(users) ? users : [];
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    const addedTasksArray = Array.isArray(addedTasks) ? addedTasks : [];
    const submissionsArray = Array.isArray(submissions) ? submissions : [];
    const pointsArray = Array.isArray(points) ? points : [];
    const claimsArray = Array.isArray(claims) ? claims : [];

    // Combine all tasks
    const allTasks = [...tasksArray, ...addedTasksArray];
    const uniqueTasks = Array.from(new Map(allTasks.map(task => [task.id, task])).values());

    // Calculate statistics
    const totalUsers = usersArray.length;
    const activeUsers = usersArray.filter(u => u.status === 'active').length;
    const pendingUsers = usersArray.filter(u => u.status === 'pending').length;
    const suspendedUsers = usersArray.filter(u => u.status === 'suspended').length;
    const regularUsers = usersArray.filter(u => u.role === 'user').length;
    const adminUsers = usersArray.filter(u => u.role === 'admin').length;
    const qaUsers = usersArray.filter(u => u.role === 'qa').length;

    const totalTasks = uniqueTasks.length;
    const activeTasks = uniqueTasks.filter(t => t.active).length;
    const inactiveTasks = uniqueTasks.filter(t => !t.active).length;

    const totalSubmissions = submissionsArray.length;
    const pendingSubmissionsArray = submissionsArray.filter(s => s.status === 'pending');
    const approvedSubmissionsArray = submissionsArray.filter(s => s.status === 'approved');
    const rejectedSubmissionsArray = submissionsArray.filter(s => s.status === 'rejected');
    
    const pendingSubmissions = pendingSubmissionsArray.length;
    const approvedSubmissions = approvedSubmissionsArray.length;
    const rejectedSubmissions = rejectedSubmissionsArray.length;

    const totalPointsAwarded = approvedSubmissionsArray.reduce((sum, sub) => sum + (sub.points || 0), 0);
    const totalPointsClaimed = claimsArray.reduce((sum, claim) => sum + (claim.points || 0), 0);
    const totalPointsInCirculation = usersArray.reduce((sum, user) => sum + (user.points || 0), 0);

    // Top users by points
    const topUsers = usersArray
      .filter(u => u.role === 'user')
      .sort((a, b) => (b.totalEarned || 0) - (a.totalEarned || 0))
      .slice(0, 10)
      .map(({ password, ...user }) => user); // Remove passwords

    // Recent submissions
    const recentSubmissions = submissionsArray
      .sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0))
      .slice(0, 10);

    // Task completion stats
    const taskStats = uniqueTasks.map(task => {
      const taskSubmissions = submissionsArray.filter(s => s.taskId === task.id);
      return {
        taskId: task.id,
        taskTitle: task.title,
        totalSubmissions: taskSubmissions.length,
        approved: taskSubmissions.filter(s => s.status === 'approved').length,
        rejected: taskSubmissions.filter(s => s.status === 'rejected').length,
        pending: taskSubmissions.filter(s => s.status === 'pending').length,
        pointsAwarded: taskSubmissions
          .filter(s => s.status === 'approved')
          .reduce((sum, s) => sum + (s.points || 0), 0),
      };
    });

    // Create analytics object
    const analytics = {
      generatedAt: new Date().toISOString(),
      overview: {
        totalUsers,
        activeUsers,
        pendingUsers,
        suspendedUsers,
        regularUsers,
        adminUsers,
        qaUsers,
      },
      tasks: {
        total: totalTasks,
        active: activeTasks,
        inactive: inactiveTasks,
      },
      submissions: {
        total: totalSubmissions,
        pending: pendingSubmissions,
        approved: approvedSubmissions,
        rejected: rejectedSubmissions,
        approvalRate: totalSubmissions > 0 
          ? ((approvedSubmissions / totalSubmissions) * 100).toFixed(2) + '%'
          : '0%',
      },
      points: {
        totalAwarded: totalPointsAwarded,
        totalClaimed: totalPointsClaimed,
        inCirculation: totalPointsInCirculation,
        availableToClaim: totalPointsInCirculation - totalPointsClaimed,
      },
      topUsers,
      recentSubmissions: recentSubmissions.slice(0, 5),
      taskStats: taskStats.sort((a, b) => b.totalSubmissions - a.totalSubmissions).slice(0, 10),
    };

    // Save to adminAnalytics.json
    writeJSON('adminAnalytics', analytics);

    res.json({
      success: true,
      message: 'Analytics generated successfully',
      data: analytics,
    });
  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating analytics',
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
 * Update user status (Admin only)
 */
const updateUserStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'pending', 'suspended', 'hibernate'];
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

    // Prevent changing admin status to suspended or hibernate
    if (users[userIndex].role === 'admin' && (status === 'suspended' || status === 'hibernate')) {
      return res.status(400).json({
        success: false,
        message: 'Cannot suspend or hibernate admin users',
      });
    }

    // Update user status
    users[userIndex].status = status;
    writeJSON('users', users);

    // Return user without password
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

/**
 * Get all claims (Admin only)
 */
const getAllClaims = (req, res) => {
  try {
    const claims = readJSON('claims');
    const users = readJSON('users');

    // Enrich claims with user information
    const enrichedClaims = claims.map(claim => {
      const user = users.find(u => u.id === claim.userId);
      return {
        ...claim,
        userName: user?.name || 'Unknown',
        userEmail: user?.email || 'Unknown',
      };
    });

    // Sort by most recent first
    const sortedClaims = enrichedClaims.sort(
      (a, b) => new Date(b.claimedAt) - new Date(a.claimedAt)
    );

    res.json({
      success: true,
      data: sortedClaims,
      count: sortedClaims.length,
    });
  } catch (error) {
    console.error('Get all claims error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching claims',
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  getAdminAnalytics,
  getAllUsers,
  updateUserStatus,
  getAllClaims,
};
