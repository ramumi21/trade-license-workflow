/**
 * XJ3395 — Application Layer
 * What this file handles: Query to get applications for an approver.
 */
const { Result } = require('../dto/result');
const { toApplicationSummaryDto } = require('../mapper/application_mapper');

class GetApplicationsForApproverQuery {
  constructor(repository) {
    this.repository = repository;
  }
  async execute() {
    const apps = await this.repository.findForApproverQueue();
    return Result.success(apps.map(toApplicationSummaryDto), 'Approver queue retrieved');
  }
}
module.exports = { GetApplicationsForApproverQuery };
