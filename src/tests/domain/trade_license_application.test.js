const { TradeLicenseApplication } = require('../../domain/model/trade_license_application');
const { Payment } = require('../../domain/model/payment');

describe('TradeLicenseApplication', () => {
  it('should successfully submit when valid', () => {
    const app = new TradeLicenseApplication({ status: 'PENDING' });
    app.payment = new Payment(100, 'USD', 'TX1', new Date(), true);
    app.attachments = [{}];
    
    app.submit();
    expect(app.status).toBe('SUBMITTED');
  });

  it('should throw when submitting without settled payment', () => {
    const app = new TradeLicenseApplication({ status: 'PENDING' });
    expect(() => app.submit()).toThrow('Payment must be settled before submission');
  });

  it('should transition to UNDER_REVIEW when ACCEPTed', () => {
    const app = new TradeLicenseApplication({ status: 'SUBMITTED' });
    app.review('ACCEPT', 'Looks good', 'reviewer-1');
    expect(app.status).toBe('UNDER_REVIEW');
  });

  it('should throw when invalid transition', () => {
    const app = new TradeLicenseApplication({ status: 'APPROVED' });
    expect(() => app.review('ACCEPT', '', 'reviewer-1')).toThrow();
  });
});
