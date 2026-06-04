const express = require('express');
const router = express.Router();
const { getGames } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGames);

module.exports = router;
