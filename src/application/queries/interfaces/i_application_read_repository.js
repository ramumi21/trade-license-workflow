/**
 * XJ3395 — Application Layer
 * What this file handles: Interface for application read repository.
 */

class IApplicationReadRepository {
  getReviewerQueue() { throw new Error('Not implemented'); }
  getApproverQueue() { throw new Error('Not implemented'); }
  getApplicationsByApplicantId(id) { throw new Error('Not implemented'); }
  getApplicationDetail(id) { throw new Error('Not implemented'); }
}

module.exports = { IApplicationReadRepository };
