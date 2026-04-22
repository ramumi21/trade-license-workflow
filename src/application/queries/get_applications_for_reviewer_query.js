/**
 * XJ3395 — Application Layer
 * What this file handles: Query to get applications for a reviewer.
 */
const { Result } = require('../dto/result');
const { toApplicationSummaryDto } = require('../mapper/application_mapper');

class GetApplicationsForReviewerQuery {
  constructor(repository) {
    this.repository = repository;
  }
  async execute() {
    const apps = await this.repository.findForReviewerQueue();
    return Result.success(apps.map(toApplicationSummaryDto), 'Reviewer queue retrieved');
  }
}
module.exports = { GetApplicationsForReviewerQuery };
