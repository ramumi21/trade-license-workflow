/**
 * XJ3395 — Domain Layer
 * What this file handles: Interface contract for TradeLicenseApplicationRepository.
 */

/**
 * @interface TradeLicenseApplicationRepository
 */
class TradeLicenseApplicationRepository {
  /**
   * @param {string} id
   * @returns {Promise<TradeLicenseApplication|null>}
   */
  async findById(id) { throw new Error('Not implemented'); }

  /**
   * @param {string} applicantId
   * @returns {Promise<TradeLicenseApplication[]>}
   */
  async findByApplicantId(applicantId) { throw new Error('Not implemented'); }

  /**
   * returns SUBMITTED, ADJUSTED, RE_REVIEW
   * @returns {Promise<TradeLicenseApplication[]>}
   */
  async findForReviewerQueue() { throw new Error('Not implemented'); }

  /**
   * returns UNDER_REVIEW only
   * @returns {Promise<TradeLicenseApplication[]>}
   */
  async findForApproverQueue() { throw new Error('Not implemented'); }

  /**
   * @param {TradeLicenseApplication} application
   * @returns {Promise<TradeLicenseApplication>}
   */
  async save(application) { throw new Error('Not implemented'); }

  /**
   * @param {TradeLicenseApplication} application
   * @returns {Promise<TradeLicenseApplication>}
   */
  async update(application) { throw new Error('Not implemented'); }
}

module.exports = { TradeLicenseApplicationRepository };
