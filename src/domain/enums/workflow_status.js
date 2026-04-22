/**
 * XJ3395 — Domain Layer
 * What this file handles: Defines workflow status constants.
 */
const WorkflowStatus = {
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ADJUSTED: 'ADJUSTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RE_REVIEW: 'RE_REVIEW',
  CANCELLED: 'CANCELLED'
};
module.exports = { WorkflowStatus };
