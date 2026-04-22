/**
 * XJ3395 — Domain Layer
 * What this file handles: Application approved event.
 */
class ApplicationApprovedEvent {
  constructor(applicationId, action) {
    this.name = 'ApplicationApprovedEvent';
    this.applicationId = applicationId;
    this.action = action;
    this.timestamp = new Date();
  }
}
module.exports = { ApplicationApprovedEvent };
