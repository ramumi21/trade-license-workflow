/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Auth routes for generating developer tokens.
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/token', (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !role) {
    return res.status(400).json({ error: 'userId and role required' });
  }
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET || 'xj3395-secret-key-min-32-characters', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
  res.json({ token: `Bearer ${token}` });
});

module.exports = router;
