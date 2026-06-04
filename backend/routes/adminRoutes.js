const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getGames,
  addGame,
  deleteGame
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.get('/games', getGames);
router.post('/games', addGame);
router.delete('/games/:id', deleteGame);

module.exports = router;
