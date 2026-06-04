const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getIncomingRequests,
  getSentRequests,
  respondToRequest,
  getMyMatches
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendRequest);
router.get('/incoming', protect, getIncomingRequests);
router.get('/sent', protect, getSentRequests);
router.get('/matches', protect, getMyMatches);
router.put('/:id', protect, respondToRequest);

module.exports = router;
