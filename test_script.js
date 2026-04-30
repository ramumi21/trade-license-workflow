const { ApprovalController } = require('./src/interfaces/rest/approval_controller');
const { GetApplicationByIdQuery } = require('./src/application/queries/get_application_by_id_query');
const { EmailService } = require('./src/infrastructure/services/email_service');
const { PdfGenerationService } = require('./src/infrastructure/services/pdf_generation_service');
const pool = require('./src/infrastructure/persistence/db');
const { TradeLicenseRepositoryImpl } = require('./src/infrastructure/persistence/trade_license_repository_impl');
const { ApproveApplicationHandler } = require('./src/application/handlers/approve_application_handler');
const { DomainEventPublisher } = require('./src/infrastructure/events/domain_event_publisher');

async function test() {
  const repo = new TradeLicenseRepositoryImpl();
  const publisher = new DomainEventPublisher();
  const approveHandler = new ApproveApplicationHandler(repo, publisher);
  const getByIdQuery = new GetApplicationByIdQuery(repo);
  const pdfService = new PdfGenerationService();
  const emailService = new EmailService();

  const controller = new ApprovalController(null, approveHandler, getByIdQuery, pdfService, emailService);

  const req = {
    params: { id: 'b3eab33c-97f3-4224-af07-a25b22b4ac27' },
    body: { action: 'APPROVE', comment: 'Test comment' },
    user: { userId: 'user_2f9rC8yZ...' }
  };

  const res = {
    json: (data) => console.log('Response:', data)
  };

  try {
    // First, let's put the application back in UNDER_REVIEW
    const app = await repo.findById(req.params.id);
    if (app && app.status === 'APPROVED') {
      app.status = 'UNDER_REVIEW';
      await repo.save(app);
      console.log('Reverted to UNDER_REVIEW');
    }
    
    await controller.approveAction(req, res);
  } catch (err) {
    console.error('Controller Error:', err);
  } finally {
    pool.end();
  }
}

test();
