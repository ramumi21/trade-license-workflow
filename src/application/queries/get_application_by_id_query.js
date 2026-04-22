/**
 * XJ3395 — Application Layer
 * What this file handles: Query to get application by ID.
 */
const { Result } = require('../dto/result');
const { toApplicationDetailDto } = require('../mapper/application_mapper');

class GetApplicationByIdQuery {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    const app = await this.repository.findById(id);
    if (!app) return Result.failure('Application not found', 404);
    return Result.success(toApplicationDetailDto(app), 'Application retrieved');
  }
}
module.exports = { GetApplicationByIdQuery };
