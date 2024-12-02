const User = require('../models/user');


// Add a player to user's favorites
exports.addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { playerId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.favorites.includes(playerId)) {
            user.favorites.push(playerId);
            await user.save();
            return res.status(200).json({ message: 'Player added to favorites' });
        }

        res.status(200).json({ message: 'Player already in favorites' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove a player from user's favorites
exports.removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { playerId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favorites = user.favorites.filter(id => id.toString() !== playerId);
        await user.save();

        res.status(200).json({ message: 'Player removed from favorites' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all favorite players for a user
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate('favorites');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
