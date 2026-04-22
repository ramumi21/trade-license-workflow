/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Approval controller.
 */
const Joi = require('joi');

class ApprovalController {
  constructor(getApplicationsForApproverQuery, approveApplicationHandler) {
    this.getApplicationsForApproverQuery = getApplicationsForApproverQuery;
    this.approveApplicationHandler = approveApplicationHandler;
  }

  async getPending(req, res) {
    const result = await this.getApplicationsForApproverQuery.execute();
    res.json({ ...result, timestamp: new Date() });
  }

  async approveAction(req, res) {
    const schema = Joi.object({
      action: Joi.string().valid('APPROVE', 'REJECT', 'REREVIEW').required(),
      comment: Joi.string().optional()
    });
    const { error, value } = schema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const command = {
      applicationId: req.params.id,
      action: value.action,
      comment: value.comment,
      approverId: req.user.userId
    };
    const result = await this.approveApplicationHandler.handle(command);
    res.json({ ...result, timestamp: new Date() });
  }
}

module.exports = { ApprovalController };
