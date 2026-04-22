/**
 * XJ3395 — Application Layer
 * What this file handles: Handler for approving an application.
 */
const { Result } = require('../dto/result');
const { toApplicationDetailDto } = require('../mapper/application_mapper');

class ApproveApplicationHandler {
  constructor(repository, domainEventPublisher) {
    this.repository = repository;
    this.domainEventPublisher = domainEventPublisher;
  }
  async handle(command) {
    const app = await this.repository.findById(command.applicationId);
    if (!app) throw new Error('Application not found');
    
    app.approve(command.action, command.comment, command.approverId);
    await this.repository.save(app);
    
    const events = app.getDomainEvents();
    if (events.length > 0) {
      this.domainEventPublisher.publish(events);
      app.clearEvents();
    }
    
    return Result.success(toApplicationDetailDto(app), `Application approved with action ${command.action}`);
  }
}
module.exports = { ApproveApplicationHandler };
