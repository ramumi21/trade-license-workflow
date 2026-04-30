/**
 * @interface IEmailService
 */
class IEmailService {
  /**
   * @param {string} to - The email address to send to.
   * @param {string} applicantName - The name of the applicant.
   * @param {string} applicationId - The ID of the application.
   * @returns {Promise<void>}
   */
  async sendApprovalEmail(to, applicantName, applicationId) {
    throw new Error('Method not implemented.');
  }
}

module.exports = { IEmailService };
