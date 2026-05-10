/**
 * XJ3395 — Application Layer
 * What this file handles: Query to verify a license publicly.
 */
const { Result } = require('../dto/result');

class VerifyLicenseQuery {
  constructor(readRepository, identityService) {
    this.readRepository = readRepository;
    this.identityService = identityService;
  }

  async execute(id) {
    const application = await this.readRepository.getApplicationDetail(id);
    if (!application) {
      return Result.failure('License not found', 404);
    }

    let ownerInitials = 'N/A';
    try {
      const user = await this.identityService.getUserById(application.applicantId);
      if (user && (user.firstName || user.lastName)) {
        const first = user.firstName ? user.firstName[0].toUpperCase() + '.' : '';
        const last = user.lastName ? user.lastName[0].toUpperCase() + '.' : '';
        ownerInitials = `${first}${last}`.trim();
      } else if (user && user.fullName && user.fullName !== 'Applicant') {
        ownerInitials = user.fullName.substring(0, 2).toUpperCase();
      } else {
        ownerInitials = 'User';
      }
    } catch (err) {
      console.error('[VerifyLicenseQuery] Failed to fetch user initials for verification:', err.message);
    }

    return Result.success({
      id: application.id,
      status: application.status,
      licenseType: application.licenseType,
      issueDate: application.createdAt,
      ownerInitials
    }, 'License verified');
  }
}

module.exports = { VerifyLicenseQuery };
