const Problem = require('../models/Problem');
const UserProgress = require('../models/UserProgress');
const Submission = require('../models/Submission');
const User = require('../models/User');
const PatternMastery = require('../models/PatternMastery');
const { runAgainstKeys } = require('../execution/executionService');
const { calculateXP } = require('../services/xpService');

// @desc    Run code against PUBLIC keys only (no progress/XP impact)
// @route   POST /api/submissions/run
// @access  Private
const runCode = async (req, res, next) => {
  try {
    const { problemId, code, language } = req.body;
    if (!problemId || !code) {
      return res.status(400).json({ success: false, message: 'problemId and code are required' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const publicKeys = problem.keys.filter((k) => !k.isHidden);
    const result = await runAgainstKeys({ code, language, keys: publicKeys, problem });

    res.json({
      success: true,
      mode: 'run',
      status: result.status,
      keyResults: result.keyResults,
      executionTime: result.executionTime,
      memory: result.memory,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit code against ALL keys (public + hidden). Updates
//          progress, XP, streak, door completion, pattern mastery.
// @route   POST /api/submissions/submit
// @access  Private
const submitCode = async (req, res, next) => {
  try {
    const { problemId, code, language, hintsUsed = 0, patternGuess } = req.body;
    if (!problemId || !code) {
      return res.status(400).json({ success: false, message: 'problemId and code are required' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const result = await runAgainstKeys({ code, language, keys: problem.keys, problem });
    const keysCollectedCount = result.keyResults.filter((r) => r.passed).length;
    const doorUnlocked = keysCollectedCount === problem.keys.length;

    // Record the submission
    const submission = await Submission.create({
      userId: req.user._id,
      problemId: problem._id,
      doorNumber: problem.doorNumber,
      code,
      language,
      mode: 'submit',
      status: result.status,
      keyResults: result.keyResults,
      keysCollectedCount,
      totalKeys: problem.keys.length,
      executionTime: result.executionTime,
      memory: result.memory,
      hintsUsedAtSubmission: hintsUsed,
    });

    // Update / create progress record
    let progress = await UserProgress.findOne({ userId: req.user._id, doorNumber: problem.doorNumber });
    if (!progress) {
      progress = new UserProgress({
        userId: req.user._id,
        doorNumber: problem.doorNumber,
        problemId: problem._id,
        totalKeys: problem.keys.length,
      });
    }

    progress.attempts += 1;
    progress.hintsUsed = Math.max(progress.hintsUsed, hintsUsed);
    progress.keysCollected = result.keyResults.filter((r) => r.passed).map((r) => r.keyId);
    progress.status = doorUnlocked ? 'COMPLETED' : 'IN_PROGRESS';
    if (!progress.startedAt) progress.startedAt = new Date();

    let xpBreakdown = null;
    let alreadyCompleted = req.user.completedDoors.includes(problem.doorNumber);

    if (doorUnlocked && !alreadyCompleted) {
      xpBreakdown = calculateXP({
        difficulty: problem.difficulty,
        attempts: progress.attempts,
        hintsUsed: progress.hintsUsed,
      });

      progress.completedAt = new Date();
      progress.xpEarned = xpBreakdown.total;

      // Update user: XP, level, completed doors, current door, streak
      const user = await User.findById(req.user._id);
      user.xp += xpBreakdown.total;
      user.recalculateLevel();
      user.completedDoors.push(problem.doorNumber);
      user.currentDoor = Math.max(user.currentDoor, problem.doorNumber + 1);

      const today = new Date().toDateString();
      const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastActive === yesterday) user.streak += 1;
      else if (lastActive !== today) user.streak = 1;
      user.lastActiveDate = new Date();

      await user.save();

      // Update pattern mastery
      if (patternGuess) {
        const correct = patternGuess === problem.pattern;
        const mastery = await PatternMastery.findOneAndUpdate(
          { userId: req.user._id, pattern: problem.pattern },
          {
            $inc: {
              problemsSolved: 1,
              patternGuessesTotal: 1,
              patternGuessesCorrect: correct ? 1 : 0,
            },
          },
          { upsert: true, new: true }
        );
        mastery.accuracy = mastery.patternGuessesTotal
          ? Math.round((mastery.patternGuessesCorrect / mastery.patternGuessesTotal) * 100)
          : 0;
        mastery.masteryPercentage = Math.min(100, mastery.problemsSolved * 20); // simple curve
        await mastery.save();
      }
    }

    await progress.save();

    res.json({
      success: true,
      mode: 'submit',
      status: result.status,
      keyResults: result.keyResults,
      keysCollectedCount,
      totalKeys: problem.keys.length,
      doorUnlocked,
      xpBreakdown,
      progress,
      solutionExplanation: doorUnlocked ? problem.solutionExplanation : undefined,
      visualizationSteps: doorUnlocked ? problem.visualizationSteps : undefined,
      submissionId: submission._id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { runCode, submitCode };
