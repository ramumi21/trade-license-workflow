/** @file approval_controller.js - Manages the transition of application states and triggers post-approval automation (PDF & Email). */
const Joi = require('joi');

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
