const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController'); // Import favoritesController
const { verifyAuth } = require('../middlewares/authMiddleware'); // Middleware to verify authentication

// Map routes to controller methods
router.post('/:playerId', verifyAuth, favoritesController.addFavorite);
router.delete('/:playerId', verifyAuth, favoritesController.removeFavorite);
router.get('/', verifyAuth, favoritesController.getFavorites);

module.exports = router;
