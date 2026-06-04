const express = require('express');
const router = express.Router();
const { getSquads, createSquad, joinSquad } = require('../controllers/squadController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSquads);
router.post('/', protect, createSquad);
router.put('/:id/join', protect, joinSquad);

module.exports = router;
