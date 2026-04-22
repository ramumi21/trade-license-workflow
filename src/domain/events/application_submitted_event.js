/**
 * XJ3395 — Domain Layer
 * What this file handles: Application submitted event.
 */
class ApplicationSubmittedEvent {
  constructor(applicationId) {
    this.name = 'ApplicationSubmittedEvent';
    this.applicationId = applicationId;
    this.timestamp = new Date();
  }
}
module.exports = { ApplicationSubmittedEvent };
