const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/fileHandler');

/**
 * Get user's points and history
 */
const getUserPoints = (req, res) => {
  try {
    const userId = req.user.id;

    const users = readJSON('users');
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get points history
    const points = readJSON('points');
    const userPoints = points.filter(p => p.userId === userId);

    // Get claim history
    const claims = readJSON('claims');
    const userClaims = claims.filter(c => c.userId === userId);

    res.json({
      success: true,
      data: {
        currentPoints: user.points,
        totalEarned: user.totalEarned,
        pointsHistory: userPoints,
        claimsHistory: userClaims,
      },
    });
  } catch (error) {
    console.error('Get user points error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching points',
    });
  }
};

/**
 * Claim reward (100 points)
 */
const claimReward = (req, res) => {
  try {
    const userId = req.user.id;
    const claimAmount = 100;

    const users = readJSON('users');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = users[userIndex];

    // Check if user has enough points
    if (user.points < claimAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You need ${claimAmount} points to claim a reward. Current: ${user.points}`,
      });
    }

    // Deduct points
    users[userIndex].points -= claimAmount;
    writeJSON('users', users);

    // Create claim record
    const claims = readJSON('claims');
    const newClaim = {
      id: uuidv4(),
      userId,
      points: claimAmount,
      claimedAt: new Date().toISOString(),
      status: 'success',
    };

    claims.push(newClaim);
    writeJSON('claims', claims);

    // Record points transaction
    const points = readJSON('points');
    points.push({
      id: uuidv4(),
      userId,
      points: -claimAmount,
      type: 'claimed',
      claimId: newClaim.id,
      createdAt: new Date().toISOString(),
    });
    writeJSON('points', points);

    res.json({
      success: true,
      message: `Successfully claimed ${claimAmount} points reward!`,
      data: {
        claim: newClaim,
        remainingPoints: users[userIndex].points,
      },
    });
  } catch (error) {
    console.error('Claim reward error:', error);
    res.status(500).json({
      success: false,
      message: 'Error claiming reward',
    });
  }
};

module.exports = {
  getUserPoints,
  claimReward,
};

