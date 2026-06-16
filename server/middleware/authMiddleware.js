const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SUPERADMIN_TOKEN = 'superadmin-session';
const ADMIN_TOKEN = 'admin-session';
const SUPERADMIN_USER = {
    _id: 'superadmin',
    name: 'Super Admin',
    email: 'superadmin@gmail.com',
    role: 'superadmin',
    studentId: '0000000000',
    department: 'Super Admin Console',
    bio: 'Global system control account.',
    completion: 100,
    achievements: ['Super Admin Access'],
    status: 'Super Admin'
};
const ADMIN_USER = {
    _id: 'admin',
    name: 'Campus Admin',
    email: 'admin@uiu.ac.bd',
    role: 'admin',
    studentId: '0000000001',
    department: 'Campus Administration',
    bio: 'Campus operations administrator.',
    completion: 100,
    achievements: ['Admin Access'],
    status: 'Admin'
};

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing.' });
        }

        const token = authHeader.split(' ')[1];
        if (token === SUPERADMIN_TOKEN) {
            req.user = SUPERADMIN_USER;
            return next();
        }
        if (token === ADMIN_TOKEN) {
            req.user = ADMIN_USER;
            return next();
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET || 'campus-connect-secret');
        const user = await User.findById(payload.userId).lean();
        if (!user) {
            return res.status(401).json({ message: 'Invalid authorization token.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed.', error: error.message });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied for your role.' });
        }
        next();
    };
};

module.exports = { authenticate, authorizeRoles };
