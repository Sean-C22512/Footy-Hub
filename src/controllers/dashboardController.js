const Player = require('../models/player'); // Adjust the path as per your structure

exports.getDashboardPlayers = async (req, res) => {
    try {
        const players = await Player.find({}, 'name'); // Fetch only player names
        res.status(200).json({ players });
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Server error fetching players' });
    }
};
