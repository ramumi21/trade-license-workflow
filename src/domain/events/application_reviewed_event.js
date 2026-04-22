/**
 * XJ3395 — Domain Layer
 * What this file handles: Application reviewed event.
 */
class ApplicationReviewedEvent {
  constructor(applicationId, action) {
    this.name = 'ApplicationReviewedEvent';
    this.applicationId = applicationId;
    this.action = action;
    this.timestamp = new Date();
  }
}
module.exports = { ApplicationReviewedEvent };
