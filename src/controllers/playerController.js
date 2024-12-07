const Player = require('../models/player'); // Import the Player model
const { verifyAuth } = require('../middlewares/authMiddleware'); // Import verifyAuth middleware

// Get all players
exports.getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Server error while fetching players' });
    }
};

// Get a single player by ID
exports.getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.status(200).json(player);
    } catch (error) {
        console.error('Error fetching player details:', error);
        res.status(500).json({ message: 'Server error while fetching player details' });
    }
};

// Create a new player (requires authentication)
exports.createPlayer = [
    verifyAuth, // Apply the JWT-based middleware
    async (req, res) => {
        try {
            const { name, team, position, nationality, age, goals } = req.body;

            if (!name || !team || !position) {
                return res.status(400).json({ message: 'Name, team, and position are required' });
            }

            const newPlayer = new Player({ name, team, position, nationality, age, goals });
            const savedPlayer = await newPlayer.save();
            res.status(201).json({ message: 'Player added successfully', player: savedPlayer });
        } catch (error) {
            console.error('Error adding player:', error);
            res.status(500).json({ message: 'Server error while adding player' });
        }
    },
];

// Update a player (requires authentication)
exports.updatePlayer = [
    verifyAuth, // Apply the JWT-based middleware
    async (req, res) => {
        try {
            const playerId = req.params.id;
            const updateData = req.body;

            const updatedPlayer = await Player.findByIdAndUpdate(playerId, updateData, { new: true });

            if (!updatedPlayer) {
                return res.status(404).json({ message: 'Player not found' });
            }

            res.status(200).json({ message: 'Player updated successfully', player: updatedPlayer });
        } catch (error) {
            console.error('Error updating player:', error);
            res.status(500).json({ message: 'Server error while updating player' });
        }
    },
];

// Delete a player (requires authentication)
exports.deletePlayer = [
    verifyAuth, // Apply the JWT-based middleware
    async (req, res) => {
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
    },
];
