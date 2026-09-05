const express = require('express');
const { getProblemById, getProblemHints } = require('../controllers/problemController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', protect, getProblemById);
router.get('/:id/hints', protect, getProblemHints);

module.exports = router;
