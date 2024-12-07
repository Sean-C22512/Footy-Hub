const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController'); // Import playerController
const { verifyAuth } = require('../middlewares/authMiddleware'); // Import authentication middleware

// Define routes and map them to controller methods
router.get('/all', verifyAuth, playerController.getAllPlayers); // Restrict access to authenticated users
router.get('/:id', verifyAuth, playerController.getPlayerById); // Restrict access to authenticated users
router.post('/add', verifyAuth, playerController.createPlayer); // Restrict access to authenticated users
router.put('/update/:id', verifyAuth, playerController.updatePlayer); // Restrict access to authenticated users
router.delete('/delete/:id', verifyAuth, playerController.deletePlayer); // Restrict access to authenticated users

// Route to add a new player (authenticated)
router.post('/add', verifyAuth, playerController.createPlayer); // Middleware applied here

module.exports = router;
