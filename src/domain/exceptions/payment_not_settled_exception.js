/**
 * XJ3395 — Domain Layer
 * What this file handles: Custom exception for unsettled payments.
 */
class PaymentNotSettledException extends Error {
  constructor(message) {
    super(message);
    this.name = 'PaymentNotSettledException';
  }
}
module.exports = { PaymentNotSettledException };
