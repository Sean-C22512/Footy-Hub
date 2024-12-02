const express = require('express'); // Handle http requests
const dotenv = require('dotenv'); // Load environment Variables
const connectDB = require('./config/db'); // to connect to a MongoDB database.
const registerRoute = require('./routes/register'); // Route for user registration
const playerRoutes = require('./routes/playerRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes'); // Routes for managing favorites
const loginRoute = require('./routes/login');


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Framework for Node.js
const app = express();

// Middleware to parse JSON
// Assigns the parsed object to req.body
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Routes
app.use('/api/register', registerRoute); // Use the register route
app.use('/api/players', playerRoutes); // Prefix routes with /api/players
app.use('/api/favorites', favoritesRoutes); // Prefix routes with /api/favorites for managing favorite
app.use('/api', loginRoute); // Mount login routes at /api


module.exports = app; // Export the app
