/**
 * XJ3395 — Application Layer
 * What this file handles: Handler for reviewing an application.
 */
const { Result } = require('../dto/result');
const { toApplicationDetailDto } = require('../mapper/application_mapper');

class ReviewApplicationHandler {
  constructor(repository, domainEventPublisher) {
    this.repository = repository;
    this.domainEventPublisher = domainEventPublisher;
  }
  async handle(command) {
    const app = await this.repository.findById(command.applicationId);
    if (!app) throw new Error('Application not found');
    
    app.review(command.action, command.comment, command.reviewerId);
    await this.repository.save(app);
    
    const events = app.getDomainEvents();
    if (events.length > 0) {
      this.domainEventPublisher.publish(events);
      app.clearEvents();
    }
    
    return Result.success(toApplicationDetailDto(app), `Application reviewed with action ${command.action}`);
  }
}
module.exports = { ReviewApplicationHandler };
