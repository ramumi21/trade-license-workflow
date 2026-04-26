/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Clerk authentication middleware and RBAC role mapping.
 */
const { getAuth, clerkClient } = require('@clerk/express');

async function authMiddleware(req, res, next) {
  // Allow swagger UI without auth
  if (req.path.startsWith('/api-docs') || req.path === '/health') {
    return next();
  }

  try {
    const auth = getAuth(req);
    
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    // Try to get role from claims first (if JWT template is configured)
    const claims = auth.sessionClaims || {};
    const metadata = claims.metadata || claims.publicMetadata || {};
    let role = metadata.role;

    // If not in claims, fetch the user directly from Clerk API to ensure we have the latest publicMetadata
    if (!role) {
      const user = await clerkClient.users.getUser(auth.userId);
      if (user && user.publicMetadata) {
        role = user.publicMetadata.role;
      }
    }

    // Map it to req.user for backward compatibility with our handlers
    req.user = {
      userId: auth.userId,
      role: role || 'CUSTOMER'
    };
    
    // Add debugging log to help trace role assignment
    console.log(`[Auth] User ${auth.userId} hydrated with role: ${req.user.role}`);
    
    next();
  } catch (err) {
    console.error('[Auth Error]', err);
    next(err);
  }
}

module.exports = { authMiddleware };
