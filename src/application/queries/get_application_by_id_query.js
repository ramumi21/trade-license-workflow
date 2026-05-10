/**
 * XJ3395 — Application Layer
 * What this file handles: Query to get application by ID.
 */
const { Result } = require('../dto/result');


class GetApplicationByIdQuery {
  constructor(readRepository) {
    this.readRepository = readRepository;
  }
  async execute(id) {
    const app = await this.readRepository.getApplicationDetail(id);
    if (!app) return Result.failure('Application not found', 404);
    return Result.success(app, 'Application retrieved');
  }
}
module.exports = { GetApplicationByIdQuery };
