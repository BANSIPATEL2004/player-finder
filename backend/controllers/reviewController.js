const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Get reviews for a user
// @route   GET /api/reviews/:userId
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedId: req.params.userId })
      .populate('reviewerId', 'name username avatar')
      .sort({ createdAt: -1 });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length ? (totalRating / reviews.length).toFixed(1) : 0;

    res.json({ reviews, averageRating, totalCount: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a review
// @route   POST /api/reviews
const addReview = async (req, res) => {
  try {
    const { reviewedId, rating, feedback, game } = req.body;
    const reviewerId = req.user._id;

    if (reviewedId === reviewerId.toString()) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    // Check if review already exists
    const existing = await Review.findOne({ reviewerId, reviewedId, game });
    if (existing) {
      existing.rating = rating;
      existing.feedback = feedback;
      await existing.save();

      // Update User rating
      const allReviews = await Review.find({ reviewedId });
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / allReviews.length;
      await User.findByIdAndUpdate(reviewedId, { averageRating, reviewCount: allReviews.length });

      return res.json(existing);
    }

    const review = await Review.create({
      reviewerId,
      reviewedId,
      rating,
      feedback,
      game
    });

    // Update User rating
    const allReviews = await Review.find({ reviewedId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;
    await User.findByIdAndUpdate(reviewedId, { averageRating, reviewCount: allReviews.length });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReviews, addReview };
