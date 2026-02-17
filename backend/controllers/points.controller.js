const { readJSON, writeJSON } = require('../utils/fileHandler');

/**
 * Get user's points and history
 */
const getUserPoints = (req, res) => {
  try {
    const userId = req.user.id;
    const users = readJSON('users');
    const points = readJSON('points');
    const claims = readJSON('claims');

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userPoints = points.filter(p => p.userId === userId);
    const userClaims = claims.filter(c => c.userId === userId);

    res.json({
      success: true,
      data: {
        points: user.points || 0,
        totalEarned: user.totalEarned || 0,
        history: userPoints,
        claims: userClaims,
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
 * Claim 100 points reward
 */
const claimReward = (req, res) => {
  try {
    const userId = req.user.id;
    const users = readJSON('users');
    const claims = readJSON('claims');
    const points = readJSON('points');

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user has enough APPROVED points (100 required)
    // Note: user.points only contains points from approved tasks (awarded by QA)
    // Pending submissions do NOT contribute to claimable points
    const approvedPoints = user.points || 0;
    if (approvedPoints < 100) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient points. You need at least 100 approved points to claim a reward. Points from pending submissions cannot be claimed until they are approved by QA.',
      });
    }

    // Check if user already claimed today
    // Get today's date in YYYY-MM-DD format (UTC)
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // e.g., "2026-02-16"
    
    // Get user's claims
    const userClaims = claims.filter(c => c.userId === userId);
    
    // Check if user has claimed today
    const todayClaim = userClaims.find(c => {
      if (!c.claimedAt) return false;
      
      try {
        // Parse the claim date and get YYYY-MM-DD format
        const claimDate = new Date(c.claimedAt);
        const claimDateStr = claimDate.toISOString().split('T')[0];
        
        // Compare dates (YYYY-MM-DD format)
        return claimDateStr === todayStr;
      } catch (error) {
        console.error('Error parsing claim date:', c.claimedAt, error);
        return false;
      }
    });

    if (todayClaim) {
      console.log(`User ${userId} already claimed today. Last claim: ${todayClaim.claimedAt}, Today: ${todayStr}`);
      return res.status(400).json({
        success: false,
        message: 'You have already claimed your reward today. Come back tomorrow!',
      });
    }
    
    console.log(`User ${userId} can claim. Today: ${todayStr}, User claims count: ${userClaims.length}`);

    // Deduct 100 points
    user.points = (user.points || 0) - 100;
    writeJSON('users', users);

    // Create claim record
    const newClaim = {
      id: `claim-${Date.now()}`,
      userId,
      points: 100,
      claimedAt: new Date().toISOString(),
    };
    claims.push(newClaim);
    writeJSON('claims', claims);

    // Add to points history
    const pointRecord = {
      id: `point-${Date.now()}`,
      userId,
      amount: -100,
      type: 'claim',
      description: 'Claimed 100 points reward',
      createdAt: new Date().toISOString(),
    };
    points.push(pointRecord);
    writeJSON('points', points);

    res.json({
      success: true,
      message: 'Reward claimed successfully!',
      data: {
        remainingPoints: user.points,
        claim: newClaim,
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

