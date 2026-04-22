const { ReviewApplicationHandler } = require('../../application/handlers/review_application_handler');
const { TradeLicenseApplication } = require('../../domain/model/trade_license_application');

describe('ReviewApplicationHandler', () => {
  it('should review an application', async () => {
    const app = new TradeLicenseApplication({ status: 'SUBMITTED' });
    app.review = jest.fn();
    const repo = { findById: jest.fn().mockResolvedValue(app), save: jest.fn() };
    const publisher = { publish: jest.fn() };
    const handler = new ReviewApplicationHandler(repo, publisher);

    await handler.handle({ applicationId: '123', action: 'ACCEPT' });
    
    expect(app.review).toHaveBeenCalledWith('ACCEPT', undefined, undefined);
    expect(repo.save).toHaveBeenCalledWith(app);
  });
});
