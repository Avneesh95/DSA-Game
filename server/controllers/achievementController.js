const Achievement = require('../models/Achievement');
const User = require('../models/User');

// @desc    Get all achievements, annotated with whether this user has earned each
// @route   GET /api/achievements
// @access  Private
const getAchievements = async (req, res, next) => {
  try {
    const all = await Achievement.find();
    const earnedIds = new Set(req.user.achievements.map((id) => id.toString()));

    const annotated = all.map((a) => ({
      ...a.toObject(),
      earned: earnedIds.has(a._id.toString()),
    }));

    res.json({ success: true, achievements: annotated });
  } catch (err) {
    next(err);
  }
};

// @desc    Get the top players by XP
// @route   GET /api/leaderboard
// @access  Private
const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const topUsers = await User.find()
      .select('name xp level completedDoors streak')
      .sort({ xp: -1 })
      .limit(limit);

    const leaderboard = topUsers.map((u, index) => ({
      rank: index + 1,
      name: u.name,
      xp: u.xp,
      level: u.level,
      doorsCompleted: u.completedDoors.length,
      streak: u.streak,
    }));

    res.json({ success: true, leaderboard });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAchievements, getLeaderboard };
