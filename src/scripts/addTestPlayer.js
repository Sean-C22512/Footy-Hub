const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Player = require('../models/player');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const newPlayer = new Player({
            name: 'Cristiano Ronaldo',
            team: 'Manchester United',
            position: 'Forward',
            nationality: 'Portuguese',
            age: 36,
            goals: 674,
        });

        await newPlayer.save();
        console.log('New player added:', newPlayer);
        await mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
    });
