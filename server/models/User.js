const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        studentId: { type: String, required: true, unique: true },
        department: { type: String, required: true },
        role: {
            type: String,
            enum: ['student', 'moderator', 'admin', 'superadmin'],
            default: 'student'
        },
        bio: { type: String, default: 'Student member of campus community.' },
        completion: { type: Number, default: 78 },
        achievements: { type: [String], default: ['Joined Campus Connect'] },
        status: { type: String, default: 'Active' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
