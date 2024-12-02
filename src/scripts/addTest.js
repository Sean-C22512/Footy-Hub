const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user'); // Import the User model

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const newUser = new User({
            name: 'Test User 2',       // Replace with desired user details
            email: 'test2@example.com',
            password: 'password124', // Note: Hashing would be applied if a pre-save hook exists

        });

        await newUser.save();
        console.log('New user added:', newUser);

        // Close the database connection
        await mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
    });
