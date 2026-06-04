const express = require('express');
const router = express.Router();
const { getReviews, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:userId', protect, getReviews);
router.post('/', protect, addReview);

module.exports = router;
