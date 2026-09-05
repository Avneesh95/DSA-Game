const UserProgress = require('../models/UserProgress');
const PatternMastery = require('../models/PatternMastery');

// @desc    Get the logged-in user's full progress summary
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res, next) => {
  try {
    const progress = await UserProgress.find({ userId: req.user._id }).sort({ doorNumber: 1 });
    const patternMastery = await PatternMastery.find({ userId: req.user._id });

    const completed = progress.filter((p) => p.status === 'COMPLETED');
    const avgSolveTimeMs = completed.length
      ? Math.round(
          completed.reduce((sum, p) => {
            if (p.startedAt && p.completedAt) {
              return sum + (new Date(p.completedAt) - new Date(p.startedAt));
            }
            return sum;
          }, 0) / completed.length
        )
      : 0;

    res.json({
      success: true,
      summary: {
        xp: req.user.xp,
        level: req.user.level,
        streak: req.user.streak,
        doorsCompleted: req.user.completedDoors.length,
        problemsSolved: completed.length,
        totalAttempts: progress.reduce((sum, p) => sum + p.attempts, 0),
        totalHintsUsed: progress.reduce((sum, p) => sum + p.hintsUsed, 0),
        avgSolveTimeMs,
      },
      progress,
      patternMastery,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update progress status manually (e.g. mark IN_PROGRESS when a
//          user opens the code editor for a door)
// @route   PUT /api/progress
// @access  Private
const updateProgress = async (req, res, next) => {
  try {
    const { doorNumber, status } = req.body;
    if (!doorNumber || !status) {
      return res.status(400).json({ success: false, message: 'doorNumber and status are required' });
    }

    const allowedStatuses = ['IN_PROGRESS'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Only IN_PROGRESS may be set manually; COMPLETED is set via submission.',
      });
    }

    const progress = await UserProgress.findOneAndUpdate(
      { userId: req.user._id, doorNumber },
      { status, startedAt: new Date() },
      { new: true, upsert: false }
    );

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found for this door' });
    }

    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProgress, updateProgress };
