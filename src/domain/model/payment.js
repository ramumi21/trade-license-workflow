/**
 * XJ3395 — Domain Layer
 * What this file handles: Value object for payment details.
 */
class Payment {
  constructor(amount, currency, transactionId, paidAt, isSettled = false) {
    this.amount = amount;
    this.currency = currency;
    this.transactionId = transactionId;
    this.paidAt = paidAt;
    this.isSettled = isSettled;
  }
}
module.exports = { Payment };
