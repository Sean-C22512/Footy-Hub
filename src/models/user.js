const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }] // Reference to players
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        console.log('Hashing password for user:', this.email); // Debugging
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed successfully'); // Debugging
        next();
    } catch (err) {
        console.error('Error hashing password:', err); // Debugging
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);
