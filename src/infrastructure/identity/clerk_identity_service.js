/**
 * XJ3395 — Infrastructure Layer
 * What this file handles: Implementation of IIdentityService using Clerk.
 */
const { IIdentityService } = require('../../application/interfaces/i_identity_service');
const { clerkClient } = require('@clerk/express');

class ClerkIdentityService extends IIdentityService {
  async getUserById(userId) {
    try {
      const user = await clerkClient.users.getUser(userId);
      const email = user?.emailAddresses?.[0]?.emailAddress || null;
      const firstName = user?.firstName || '';
      const lastName = user?.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim() || 'Applicant';
      
      return {
        email,
        firstName,
        lastName,
        fullName
      };
    } catch (err) {
      console.error(`[ClerkIdentityService] Error fetching user ${userId}:`, err.message);
      return { email: null, firstName: '', lastName: '', fullName: 'Applicant' };
    }
  }
}

module.exports = { ClerkIdentityService };
