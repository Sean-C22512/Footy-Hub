const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController'); // Import playerController

// Define routes and map them to controller methods
router.get('/all', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);
router.post('/add', playerController.createPlayer);
router.put('/update/:id', playerController.updatePlayer);
router.delete('/delete/:id', playerController.deletePlayer);

module.exports = router;
