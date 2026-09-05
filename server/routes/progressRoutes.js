const express = require('express');
const { getProgress, updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getProgress);
router.put('/', protect, updateProgress);

module.exports = router;
