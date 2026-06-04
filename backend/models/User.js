const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const gameSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true,
    trim: true
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Pro'],
    default: 'Beginner'
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  games: [gameSchema],
  role: {
    type: String,
    enum: ['player', 'admin'],
    default: 'player'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
    maxlength: 200
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
