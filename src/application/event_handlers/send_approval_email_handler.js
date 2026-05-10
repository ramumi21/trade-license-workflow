/**
 * XJ3395 — Application Layer
 * What this file handles: Event handler for sending approval emails.
 */

class SendApprovalEmailHandler {
  constructor(repository, identityService, emailService) {
    this.repository = repository;
    this.identityService = identityService;
    this.emailService = emailService;
    
    // Bind handle so it can be passed as a callback
    this.handle = this.handle.bind(this);
  }

  async handle(event) {
    if (event.action !== 'APPROVE') {
      return;
    }

    try {
      const app = await this.repository.findById(event.applicationId);
      if (!app) {
        console.error(`[SendApprovalEmailHandler] Application ${event.applicationId} not found`);
        return;
      }

      const user = await this.identityService.getUserById(app.applicantId);
      if (user && user.email) {
        await this.emailService.sendApprovalEmail(
          user.email,
          user.fullName,
          app.id
        );
      } else {
        console.warn(`[SendApprovalEmailHandler] No email found for user ${app.applicantId}`);
      }
    } catch (err) {
      console.error('[SendApprovalEmailHandler] Error processing event:', err);
    }
  }
}

module.exports = { SendApprovalEmailHandler };
