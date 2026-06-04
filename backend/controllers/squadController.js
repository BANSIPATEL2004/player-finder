const Squad = require('../models/Squad');

// @desc    Get all squads
// @route   GET /api/squads
const getSquads = async (req, res) => {
  try {
    const { game } = req.query;
    const filter = game ? { game } : {};
    
    const squads = await Squad.find(filter)
      .populate('leaderId', 'name username avatar averageRating reviewCount')
      .populate('members', 'name username avatar')
      .sort({ createdAt: -1 });

    res.json(squads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a squad
// @route   POST /api/squads
const createSquad = async (req, res) => {
  try {
    const { name, game } = req.body;

    const existing = await Squad.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Squad name already taken' });
    }

    const squad = await Squad.create({
      name,
      game,
      leaderId: req.user._id,
      members: [req.user._id]
    });

    await squad.populate('leaderId', 'name username avatar averageRating reviewCount');
    await squad.populate('members', 'name username avatar');

    res.status(201).json(squad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a squad
// @route   PUT /api/squads/:id/join
const joinSquad = async (req, res) => {
  try {
    const squad = await Squad.findById(req.params.id);
    if (!squad) return res.status(404).json({ message: 'Squad not found' });

    if (squad.members.length >= squad.maxPlayers) {
      return res.status(400).json({ message: 'Squad is full' });
    }

    if (squad.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already in this squad' });
    }

    squad.members.push(req.user._id);
    await squad.save();

    await squad.populate('leaderId', 'name username avatar averageRating reviewCount');
    await squad.populate('members', 'name username avatar');

    res.json(squad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSquads, createSquad, joinSquad };
