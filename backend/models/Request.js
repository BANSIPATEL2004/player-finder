const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    default: '',
    maxlength: 200
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

// Prevent duplicate pending requests
requestSchema.index({ senderId: 1, receiverId: 1, game: 1 }, { unique: false });

module.exports = mongoose.model('Request', requestSchema);
