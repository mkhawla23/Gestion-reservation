const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const router = express.Router()
const secretKey = "nodejsexpress";

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8); // Hash the password
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id }, secretKey);
        res.send({ token: token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Logout
router.post('/logout', (req, res) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(400).json({ msg: 'No token, authorization denied' });
    }

    try {
        jwt.verify(token, secretKey);
        res.json({ msg: 'User logged out' });
    } catch (err) {
        res.status(400).json({ msg: 'Invalid token' });
    }
});

module.exports = router;
