/**
 * XJ3395 — Application Layer
 * What this file handles: Interface for identity service.
 */

/**
 * @interface IIdentityService
 */
class IIdentityService {
  /**
   * Gets a user by ID.
   * @param {string} userId 
   * @returns {Promise<{ email: string, firstName: string, lastName: string, fullName: string }>}
   */
  async getUserById(userId) {
    throw new Error('Method not implemented');
  }
}

module.exports = { IIdentityService };
