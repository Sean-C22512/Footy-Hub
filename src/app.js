const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const registerRoute = require('./routes/register');
const playerRoutes = require('./routes/playerRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const loginRoute = require('./routes/login');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Framework for Node.js
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Routes
app.use('/api/register', registerRoute);
app.use('/api/players', playerRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api', loginRoute);

// Centralized error-handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ message });
};

app.use(errorHandler);

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});


module.exports = app;
