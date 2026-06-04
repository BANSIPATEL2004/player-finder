const Game = require('../models/Game');

// @desc    Get all games
// @route   GET /api/games
const getGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ name: 1 });
    res.json({ games });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGames };
