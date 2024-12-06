const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/user'); // Import User model
const router = express.Router();

router.post(
    '/',
    [
        // Input validation
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res, next) => {
        // Validate input data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create and save the new user
            const newUser = new User({ name, email, password });
            await newUser.save();

            // Send success response
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Error during registration:', error);
            next(error); // Pass error to centralized handler
        }
    }
);

module.exports = router;
