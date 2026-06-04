const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:userId', getMessages);
router.post('/', sendMessage);

module.exports = router;
