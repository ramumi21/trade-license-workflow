/**
 * XJ3395 — Application Layer
 * What this file handles: Handler for approving an application.
 */
const { Result } = require('../dto/result');
const { toApplicationDetailDto } = require('../mapper/application_mapper');

class ApproveApplicationHandler {
  constructor(repository, domainEventPublisher, emailService) {
    this.repository = repository;
    this.domainEventPublisher = domainEventPublisher;
    this.emailService = emailService;
  }
  async handle(command) {
    const app = await this.repository.findById(command.applicationId);
    if (!app) throw new Error('Application not found');
    
    app.approve(command.action, command.comment, command.approverId);
    await this.repository.save(app);
    
    if (command.action === 'APPROVE' && command.applicantEmail && this.emailService) {
      // Fire-and-forget: Do not await the email service so the frontend responds instantly
      this.emailService.sendApprovalEmail(
        command.applicantEmail,
        command.applicantName || 'Applicant',
        app.id
      ).catch(err => {
        console.error('[ApproveApplicationHandler] Error sending approval email:', err);
      });
    }
    
    const events = app.getDomainEvents();
    if (events.length > 0) {
      this.domainEventPublisher.publish(events);
      app.clearEvents();
    }
    
    return Result.success(toApplicationDetailDto(app), `Application approved with action ${command.action}`);
  }
}
module.exports = { ApproveApplicationHandler };
