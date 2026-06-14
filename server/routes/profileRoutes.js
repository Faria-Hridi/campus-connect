const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, async (req, res) => {
  const { name, email, role, studentId, department, bio, completion, achievements, status } = req.user;
  res.json({ name, email, role, studentId, department, bio, completion, achievements, status });
});

module.exports = router;
