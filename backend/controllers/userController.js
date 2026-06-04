const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, username, bio, games } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ message: 'Username already taken' });
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.bio = bio !== undefined ? bio : user.bio;
    if (games) user.games = games;

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      username: updated.username,
      bio: updated.bio,
      games: updated.games,
      role: updated.role,
      averageRating: updated.averageRating,
      reviewCount: updated.reviewCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search players
// @route   GET /api/users/search
const searchPlayers = async (req, res) => {
  try {
    const { game, skillLevel, page = 1, limit = 10 } = req.query;

    let query = {
      _id: { $ne: req.user._id },
      role: 'player',
      isBlocked: false
    };

    if (game || skillLevel) {
      query.games = {
        $elemMatch: {
          ...(game && { gameName: { $regex: game, $options: 'i' } }),
          ...(skillLevel && { skillLevel })
        }
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const players = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      players,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get player by ID
// @route   GET /api/users/:id
const getPlayerById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Player not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, searchPlayers, getPlayerById };
