const express = require('express');
const User = require('../models/user'); // Import User model
const router = express.Router();


router.post('/', async (req, res) => {

    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        console.log('Checking if user exists with email:', email); // Debugging
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email); // Debugging
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ name, email, password });

        // Save the new user
        await newUser.save();

    } catch (error) {
        console.error('Error during registration:', error); // Debugging: Log any errors
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
