const mongoose = require('mongoose');

// User Schema for MongoDB
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: { type: String, required: true}
});

// Export the User model based on the UserSchema
module.exports = mongoose.model('User', UserSchema);