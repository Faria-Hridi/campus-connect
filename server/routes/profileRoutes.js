const express = require('express');
const router = express.Router();
const { profile } = require('../data/mockData');

router.get('/', (req, res) => {
  res.json(profile);
});

module.exports = router;
