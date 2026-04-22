/**
 * XJ3395 — Domain Layer
 * What this file handles: Custom exception for invalid workflow transitions.
 */
class InvalidWorkflowTransitionException extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidWorkflowTransitionException';
  }
}
module.exports = { InvalidWorkflowTransitionException };
