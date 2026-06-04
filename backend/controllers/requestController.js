const Request = require('../models/Request');
const User = require('../models/User');

// @desc    Send play request
// @route   POST /api/requests
const sendRequest = async (req, res) => {
  try {
    const { receiverId, game, message } = req.body;

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: 'Player not found' });

    // Check if pending request already exists
    const existing = await Request.findOne({
      senderId: req.user._id,
      receiverId,
      game,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ message: 'Request already sent for this game' });
    }

    const request = await Request.create({
      senderId: req.user._id,
      receiverId,
      game,
      message
    });

    await request.populate('senderId', 'name username games');
    await request.populate('receiverId', 'name username games');

    // Emit notification to receiver
    if (req.io && req.onlineUsers) {
      const receiverSocket = req.onlineUsers.get(receiverId.toString());
      if (receiverSocket) {
        req.io.to(receiverSocket).emit('receiveNotification', { type: 'new_request', request });
      }
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get incoming requests
// @route   GET /api/requests/incoming
const getIncomingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ receiverId: req.user._id })
      .populate('senderId', 'name username games bio averageRating reviewCount')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sent requests
// @route   GET /api/requests/sent
const getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ senderId: req.user._id })
      .populate('receiverId', 'name username games bio averageRating reviewCount')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept or Reject request
// @route   PUT /api/requests/:id
const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    await request.populate('senderId', 'name username games averageRating reviewCount');
    await request.populate('receiverId', 'name username games averageRating reviewCount');

    // Emit notification to sender that their request was accepted/rejected
    if (req.io && req.onlineUsers) {
      const senderSocket = req.onlineUsers.get(request.senderId._id.toString());
      if (senderSocket) {
        req.io.to(senderSocket).emit('receiveNotification', { type: 'request_responded', request });
      }
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my matches (accepted)
// @route   GET /api/requests/matches
const getMyMatches = async (req, res) => {
  try {
    const matches = await Request.find({
      $or: [
        { senderId: req.user._id, status: 'accepted' },
        { receiverId: req.user._id, status: 'accepted' }
      ]
    })
      .populate('senderId', 'name username games bio averageRating reviewCount')
      .populate('receiverId', 'name username games bio averageRating reviewCount')
      .sort({ updatedAt: -1 })
      .lean();

    const Message = require('../models/Message');

    for (let match of matches) {
      const otherId = match.senderId._id.toString() === req.user._id.toString() 
        ? match.receiverId._id 
        : match.senderId._id;

      const lastMessage = await Message.findOne({
        $or: [
          { senderId: req.user._id, receiverId: otherId },
          { senderId: otherId, receiverId: req.user._id }
        ]
      }).sort({ createdAt: -1 });

      match.lastMessage = lastMessage;
    }

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendRequest, getIncomingRequests, getSentRequests, respondToRequest, getMyMatches };
