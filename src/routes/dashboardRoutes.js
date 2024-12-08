const express = require('express');
const { verifyAuth } = require('../middlewares/authMiddleware');
const { getDashboardPlayers } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/players', verifyAuth, getDashboardPlayers);

module.exports = router;
