const User = require('../models/User');
const Request = require('../models/Request');

const Game = require('../models/Game');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'player' });
    const totalMatches = await Request.countDocuments({ status: 'accepted' });
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    const recentUsers = await User.find({ role: 'player' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: { totalUsers, totalMatches, pendingRequests, blockedUsers },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let query = { role: 'player' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block / Unblock user
// @route   PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot block admin' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });

    await Request.deleteMany({
      $or: [{ senderId: user._id }, { receiverId: user._id }]
    });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all games list (admin)
// @route   GET /api/admin/games
const getGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ name: 1 });
    res.json({ games });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new game
// @route   POST /api/admin/games
const addGame = async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ message: 'Game name is required' });

    const existingGame = await Game.findOne({ name });
    if (existingGame) return res.status(400).json({ message: 'Game already exists' });

    const game = await Game.create({ name, icon });
    res.status(201).json({ message: 'Game added successfully', game });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a game
// @route   DELETE /api/admin/games/:id
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard, getAllUsers, toggleBlockUser, deleteUser, getGames, addGame, deleteGame };
