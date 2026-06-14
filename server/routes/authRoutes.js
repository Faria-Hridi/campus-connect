const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'campus-connect-secret', {
        expiresIn: '7d'
    });
};

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, studentId, department, role } = req.body;
        if (!name || !email || !password || !studentId || !department) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { studentId }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Email or student ID already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            studentId,
            department,
            role: role || 'student'
        });

        const token = createToken(user._id);
        res.status(201).json({ user: { name: user.name, email: user.email, role: user.role, studentId: user.studentId, department: user.department, bio: user.bio, completion: user.completion, achievements: user.achievements, status: user.status }, token });
    } catch (error) {
        res.status(500).json({ message: 'Signup failed.', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = createToken(user._id);
        res.json({ user: { name: user.name, email: user.email, role: user.role, studentId: user.studentId, department: user.department, bio: user.bio, completion: user.completion, achievements: user.achievements, status: user.status }, token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed.', error: error.message });
    }
});

router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing.' });
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'campus-connect-secret');
        const user = await User.findById(payload.userId).lean();
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const userData = { name: user.name, email: user.email, role: user.role, studentId: user.studentId, department: user.department, bio: user.bio, completion: user.completion, achievements: user.achievements, status: user.status };
        res.json({ user: userData });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.', error: error.message });
    }
});

module.exports = router;
