const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Route for user signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username already exists in database
        const existingUser = await User.findOne({username});
        if (existingUser) {

            // If username is taken, send 400 error response
            return res.status(400).json({ message: 'Username already taken' });
        }
    
        // Hash password before saving for security
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        // Saving user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
})

// Route for user login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await User.findOne({ username });

        // If user is not found, respond with error
        if (!user) return res.status(400).json({ message: 'Invalid username or password' });

        // Compare submitted password with hashed password stored
        const isMatch = await bcrypt.compare(password, user.password);

        // If password doesn't match, respond with error
        if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router to be used in main app
module.exports = router;