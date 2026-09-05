const express = require('express');
const { getLeaderboard } = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getLeaderboard);

module.exports = router;
