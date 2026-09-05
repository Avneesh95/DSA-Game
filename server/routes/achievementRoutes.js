const express = require('express');
const { getAchievements } = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAchievements);

module.exports = router;
