/**
 * XJ3395 — Application Layer
 * What this file handles: Handler for settling payment.
 */
const { Result } = require('../dto/result');
const { toApplicationDetailDto } = require('../mapper/application_mapper');
const { Payment } = require('../../domain/model/payment');

class SettlePaymentHandler {
  constructor(repository) {
    this.repository = repository;
  }
  async handle(command) {
    const app = await this.repository.findById(command.applicationId);
    if (!app) throw new Error('Application not found');
    
    app.payment = new Payment(command.amount, command.currency, command.transactionId, new Date(), true);
    await this.repository.save(app);
    return Result.success(toApplicationDetailDto(app), 'Payment settled');
  }
}
module.exports = { SettlePaymentHandler };
