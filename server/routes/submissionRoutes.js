const express = require('express');
const { runCode, submitCode } = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');
const { executionLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/run', protect, executionLimiter, runCode);
router.post('/submit', protect, executionLimiter, submitCode);

module.exports = router;
