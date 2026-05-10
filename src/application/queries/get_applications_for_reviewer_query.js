/**
 * XJ3395 — Application Layer
 * What this file handles: Query to get applications for a reviewer.
 */
const { Result } = require('../dto/result');


class GetApplicationsForReviewerQuery {
  constructor(readRepository) {
    this.readRepository = readRepository;
  }
  async execute() {
    const apps = await this.readRepository.getReviewerQueue();
    return Result.success(apps, 'Reviewer queue retrieved');
  }
}
module.exports = { GetApplicationsForReviewerQuery };
