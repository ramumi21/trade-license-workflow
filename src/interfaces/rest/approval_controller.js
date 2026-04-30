/** @file approval_controller.js - Manages the transition of application states and triggers post-approval automation (PDF & Email). */
const Joi = require('joi');
const { clerkClient } = require('@clerk/express');

class ApprovalController {
  constructor(getApplicationsForApproverQuery, approveApplicationHandler, getApplicationByIdQuery) {
    this.getApplicationsForApproverQuery = getApplicationsForApproverQuery;
    this.approveApplicationHandler = approveApplicationHandler;
    this.getApplicationByIdQuery = getApplicationByIdQuery;
  }

  async getPending(req, res) {
    const result = await this.getApplicationsForApproverQuery.execute();
    res.json({ ...result, timestamp: new Date() });
  }

  async approveAction(req, res) {
    const schema = Joi.object({
      action: Joi.string().valid('APPROVE', 'REJECT', 'REREVIEW').required(),
      comment: Joi.string().allow('').optional()
    });
    const { error, value } = schema.validate(req.body);
    if (error) throw error;

    let applicantEmail = null;
    let applicantName = 'Applicant';

    if (value.action === 'APPROVE') {
      try {
        const appResult = await this.getApplicationByIdQuery.execute(req.params.id);
        if (appResult.success) {
          const application = appResult.data;
          
          const user = await clerkClient.users.getUser(application.applicantId);
          applicantEmail = user?.emailAddresses?.[0]?.emailAddress;
          applicantName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Applicant';

          if (applicantEmail) {
            console.log(`[ApprovalController Debug] Resolved email from Clerk: ${applicantEmail}`);
          } else {
            console.warn(`[ApprovalController Debug] No email found in Clerk for user ${application.applicantId}`);
          }
        }
      } catch (err) {
        console.error('[ApprovalController Debug] Error resolving user email:', err);
      }
    }

    const command = {
      applicationId: req.params.id,
      action: value.action,
      comment: value.comment,
      approverId: req.user.userId,
      applicantEmail,
      applicantName
    };
    
    const result = await this.approveApplicationHandler.handle(command);

    res.json({ ...result, timestamp: new Date() });
  }
}

module.exports = { ApprovalController };
