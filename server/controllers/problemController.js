const Problem = require('../models/Problem');

// @desc    Get a single problem by id (sanitized: hidden keys and the
//          reference solution are stripped before sending to the client)
// @route   GET /api/problems/:id
// @access  Private
const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const safeProblem = problem.toObject();
    safeProblem.keys = safeProblem.keys.map((key) => {
      if (key.isHidden) {
        return { _id: key._id, type: key.type, isHidden: true, difficulty: key.difficulty };
      }
      return key;
    });
    delete safeProblem.referenceSolution;
    delete safeProblem.solutionExplanation; // only revealed after all keys collected, via progress endpoint

    res.json({ success: true, problem: safeProblem });
  } catch (err) {
    next(err);
  }
};

// @desc    Get progressive hints for a problem (SHOW SOLUTION style access
//          is gated separately once all prior hints are used)
// @route   GET /api/problems/:id/hints
// @access  Private
const getProblemHints = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id).select('hints');
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }
    res.json({ success: true, hints: problem.hints.sort((a, b) => a.order - b.order) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProblemById, getProblemHints };
