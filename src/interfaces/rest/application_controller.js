/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Application controller.
 */
const Joi = require('joi');
const { Result } = require('../../application/dto/result');
const { SubmitApplicationCommand } = require('../../application/commands/submit_application_command');

class ApplicationController {
  constructor(
    submitApplicationHandler,
    getApplicationByIdQuery,
    repository,
    settlePaymentHandler,
    uploadAttachmentHandler,
    cancelApplicationHandler
  ) {
    this.submitApplicationHandler = submitApplicationHandler;
    this.getApplicationByIdQuery = getApplicationByIdQuery;
    this.repository = repository;
    this.settlePaymentHandler = settlePaymentHandler;
    this.uploadAttachmentHandler = uploadAttachmentHandler;
    this.cancelApplicationHandler = cancelApplicationHandler;
  }

  async createApplication(req, res) {
    try {
      console.log('--- createApplication DEBUG ---');
      console.log('req.user:', req.user);
      console.log('req.body:', req.body);
      
      const schema = Joi.object({
        licenseType: Joi.string().required(),
        commodityId: Joi.string().uuid().optional()
      });
      const { error, value } = schema.validate(req.body);
      if (error) throw new Error(error.details[0].message);

      const command = new SubmitApplicationCommand(req.user.userId, value.licenseType, value.commodityId);
      console.log('Command:', command);
      const result = await this.submitApplicationHandler.handle(command);
      res.status(201).json({ ...result, timestamp: new Date() });
    } catch (err) {
      console.error('Error in createApplication:', err);
      throw err;
    }
  }

  async submitApplication(req, res) {
    const command = { applicationId: req.params.id };
    const result = await this.submitApplicationHandler.handle(command);
    res.json({ ...result, timestamp: new Date() });
  }

  async getApplicationById(req, res) {
    const result = await this.getApplicationByIdQuery.execute(req.params.id);
    if (!result.success) return res.status(404).json({ ...result, timestamp: new Date() });
    res.json({ ...result, timestamp: new Date() });
  }

  async getMyApplications(req, res) {
    if (req.user.userId !== req.params.applicantId) {
      return res.status(403).json(Result.failure('Forbidden', 403));
    }
    const apps = await this.repository.findByApplicantId(req.params.applicantId);
    res.json({ success: true, data: apps, timestamp: new Date() });
  }

  async settlePayment(req, res) {
    const schema = Joi.object({
      amount: Joi.number().required(),
      currency: Joi.string().required(),
      transactionId: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const command = { applicationId: req.params.id, ...value };
    const result = await this.settlePaymentHandler.handle(command);
    res.json({ ...result, timestamp: new Date() });
  }

  async uploadAttachment(req, res) {
    if (!req.file) throw new Error('File is required');
    const command = {
      applicationId: req.params.id,
      file: req.file,
      documentType: req.body.documentType || 'GENERAL'
    };
    const result = await this.uploadAttachmentHandler.handle(command);
    res.json({ ...result, timestamp: new Date() });
  }

  async cancelApplication(req, res) {
    const command = { applicationId: req.params.id };
    const result = await this.cancelApplicationHandler.handle(command);
    res.json({ ...result, timestamp: new Date() });
  }
}

module.exports = { ApplicationController };
