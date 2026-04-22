/**
 * XJ3395 — Application Layer
 * What this file handles: Command payload for creating an application.
 */
class SubmitApplicationCommand {
  constructor(applicantId, licenseType, commodityId) {
    this.applicantId = applicantId;
    this.licenseType = licenseType;
    this.commodityId = commodityId;
  }
}

module.exports = { SubmitApplicationCommand };
