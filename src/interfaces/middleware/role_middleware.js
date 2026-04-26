/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Role-based access control middleware.
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, error: 'Forbidden', message: `Requires role: ${role}`, statusCode: 403, timestamp: new Date() });
    }

    const userRole = typeof req.user.role === 'string' ? req.user.role.toUpperCase() : String(req.user.role);
    const requiredRole = typeof role === 'string' ? role.toUpperCase() : String(role);

    if (userRole !== requiredRole) {
      return res.status(403).json({ success: false, error: 'Forbidden', message: `Requires role: ${role}`, statusCode: 403, timestamp: new Date() });
    }

    next();
  };
}

module.exports = { requireRole };
