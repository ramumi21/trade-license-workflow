/**
 * XJ3395 — Application Layer
 * What this file handles: Handler for canceling an application.
 */
const { Result } = require('../dto/result');
const { toApplicationDetailDto } = require('../mapper/application_mapper');

class CancelApplicationHandler {
  constructor(repository) {
    this.repository = repository;
  }
  async handle(command) {
    const app = await this.repository.findById(command.applicationId);
    if (!app) throw new Error('Application not found');
    
    app.cancel();
    await this.repository.save(app);
    return Result.success(toApplicationDetailDto(app), 'Application cancelled');
  }
}
module.exports = { CancelApplicationHandler };
