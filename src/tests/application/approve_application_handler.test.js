const { ApproveApplicationHandler } = require('../../application/handlers/approve_application_handler');
const { TradeLicenseApplication } = require('../../domain/model/trade_license_application');

describe('ApproveApplicationHandler', () => {
  it('should approve an application', async () => {
    const app = new TradeLicenseApplication({ status: 'UNDER_REVIEW' });
    app.approve = jest.fn();
    const repo = { findById: jest.fn().mockResolvedValue(app), save: jest.fn() };
    const publisher = { publish: jest.fn() };
    const handler = new ApproveApplicationHandler(repo, publisher);

    await handler.handle({ applicationId: '123', action: 'APPROVE' });
    
    expect(app.approve).toHaveBeenCalledWith('APPROVE', undefined, undefined);
    expect(repo.save).toHaveBeenCalledWith(app);
  });
});
