/**
 * XJ3395 — Interfaces Layer
 * What this file handles: JWT verification middleware.
 */
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Allow auth token generation and swagger UI without auth
  if (req.path.startsWith('/api/v1/auth') || req.path.startsWith('/api-docs')) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized', message: 'No token provided', statusCode: 401, timestamp: new Date() });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'xj3395-secret-key-min-32-characters');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized', message: 'Invalid token', statusCode: 401, timestamp: new Date() });
  }
}

module.exports = { authMiddleware };
