const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get messages between two users
// @route   GET /api/messages/:userId
const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    const message = await Message.create({
      senderId,
      receiverId,
      text
    });

    const sender = await User.findById(senderId).select('name username');

    // Emit notification to receiver
    if (req.io && req.onlineUsers) {
      const receiverSocket = req.onlineUsers.get(receiverId.toString());
      if (receiverSocket) {
        req.io.to(receiverSocket).emit('receiveNotification', { 
          type: 'new_message', 
          message,
          senderName: sender.name 
        });
      }
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage };
