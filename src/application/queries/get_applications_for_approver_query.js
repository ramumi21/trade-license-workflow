/**
 * XJ3395 — Application Layer
 * What this file handles: Query to get applications for an approver.
 */
const { Result } = require('../dto/result');


class GetApplicationsForApproverQuery {
  constructor(readRepository) {
    this.readRepository = readRepository;
  }
  async execute() {
    const apps = await this.readRepository.getApproverQueue();
    return Result.success(apps, 'Approver queue retrieved');
  }
}
module.exports = { GetApplicationsForApproverQuery };
