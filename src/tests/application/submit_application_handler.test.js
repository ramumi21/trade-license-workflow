const { SubmitApplicationHandler } = require('../../application/handlers/submit_application_handler');
const { TradeLicenseApplication } = require('../../domain/model/trade_license_application');

describe('SubmitApplicationHandler', () => {
  it('should save a new application if no id is provided', async () => {
    const repo = { save: jest.fn() };
    const generator = { generate: jest.fn().mockResolvedValue('TL-123') };
    const publisher = { publish: jest.fn() };
    const handler = new SubmitApplicationHandler(repo, generator, publisher);

    await handler.handle({ licenseType: 'TRADE_LICENSE', applicantId: '123' });
    
    expect(repo.save).toHaveBeenCalled();
  });

  it('should submit an existing application', async () => {
    const app = new TradeLicenseApplication({ status: 'PENDING' });
    app.submit = jest.fn();
    const repo = { findById: jest.fn().mockResolvedValue(app), save: jest.fn() };
    const handler = new SubmitApplicationHandler(repo, {}, { publish: jest.fn() });

    await handler.handle({ applicationId: '123' });
    
    expect(app.submit).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalledWith(app);
  });
});
