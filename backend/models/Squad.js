const mongoose = require('mongoose');

const squadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  game: {
    type: String,
    required: true
  },
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxPlayers: {
    type: Number,
    default: 5
  }
}, { timestamps: true });

module.exports = mongoose.model('Squad', squadSchema);
