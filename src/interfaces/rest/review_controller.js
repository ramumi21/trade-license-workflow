/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Review controller.
 */
const Joi = require('joi');

class ReviewController {
  constructor(getApplicationsForReviewerQuery, reviewApplicationHandler) {
    this.getApplicationsForReviewerQuery = getApplicationsForReviewerQuery;
    this.reviewApplicationHandler = reviewApplicationHandler;
  }

  async getPending(req, res) {
    console.log('User Role:', req.user.role);
    const result = await this.getApplicationsForReviewerQuery.execute();
    res.json({ ...result, timestamp: new Date() });
  }

  async reviewAction(req, res) {
    const schema = Joi.object({
      action: Joi.string().valid('ACCEPT', 'REJECT', 'ADJUST').required(),
      comment: Joi.string().allow('').optional()
    });
    const { error, value } = schema.validate(req.body);
    if (error) throw error;

    const command = {
      applicationId: req.params.id,
      action: value.action,
      comment: value.comment,
      reviewerId: req.user.userId
    };
    const result = await this.reviewApplicationHandler.handle(command);
    res.json({ ...result, timestamp: new Date() });
  }
}

module.exports = { ReviewController };
