const express = require('express');
const Player = require('../models/player'); // Import the Player model
const router = express.Router();

// POST route to create a new player
router.post('/add', async (req, res) => {
    try {
        const { name, team, position, nationality, age, goals } = req.body;

        // Validate required fields
        if (!name || !team || !position) {
            return res.status(400).json({ message: 'Name, team, and position are required' });
        }

        // Create a new player
        const newPlayer = new Player({
            name,
            team,
            position,
            nationality,
            age,
            goals,
        });

        // Save to the database
        const savedPlayer = await newPlayer.save();
        res.status(201).json({ message: 'Player added successfully', player: savedPlayer });
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({ message: 'Server error while adding player' });
    }
});

// Get all players
router.get('/all', async (req, res) => {
    try {
        const players = await Player.find(); // Fetch all players from MongoDB
        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
        if (!deletedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.status(200).json({ message: 'Player deleted successfully' });
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ message: 'Server error while deleting player' });
    }
});

module.exports = router;
