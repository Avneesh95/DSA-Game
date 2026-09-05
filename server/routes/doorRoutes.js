const express = require('express');
const { getDoors, getDoorByNumber } = require('../controllers/doorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getDoors);
router.get('/:doorNumber', protect, getDoorByNumber);

module.exports = router;
