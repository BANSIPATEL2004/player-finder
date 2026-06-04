const express = require('express');
const router = express.Router();
const { updateProfile, searchPlayers, getPlayerById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchPlayers);
router.put('/profile', protect, updateProfile);
router.get('/:id', protect, getPlayerById);

module.exports = router;
