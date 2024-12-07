const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.verifyAuth = async (req, res, next) => {
    console.log('verifyAuth middleware called');

    try {
        // Log the incoming Authorization header
        const authHeader = req.headers.authorization;
        console.log('Authorization Header:', authHeader);

        // Extract the token from the "Bearer" scheme
        const token = authHeader?.split(' ')[1];
        if (!token) {
            console.warn('No token provided in the Authorization header');
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Log the extracted token
        console.log('Extracted Token:', token);

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        // Check if the user exists in the database
        const user = await User.findById(decoded.id);
        if (!user) {
            console.warn('No user found for the provided token');
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Attach the user object to the request and log it
        req.user = user;
        console.log('Authenticated User:', user);

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Log the error details
        console.error('Authentication error:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
