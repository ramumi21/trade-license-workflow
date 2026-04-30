/**
 * XJ3395 — Entry Point
 * What this file handles: Wires up dependency injection and starts the Express server.
 */
require('dotenv').config();
require('express-async-errors'); // Must be required before routes
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');

const { authMiddleware } = require('./interfaces/middleware/auth_middleware');
const { errorMiddleware } = require('./interfaces/middleware/error_middleware');
const { clerkMiddleware } = require('@clerk/express');

const { TradeLicenseRepositoryImpl } = require('./infrastructure/persistence/trade_license_repository_impl');
const { LocalFileStorageService } = require('./infrastructure/storage/local_file_storage_service');
const { DomainEventPublisher } = require('./infrastructure/events/domain_event_publisher');
const { PdfGenerationService } = require('./infrastructure/services/pdf_generation_service');
const { EmailService } = require('./infrastructure/email/email_service');
const { ApplicationNumberGenerator } = require('./application/services/application_number_generator');

const { SubmitApplicationHandler } = require('./application/handlers/submit_application_handler');
const { ReviewApplicationHandler } = require('./application/handlers/review_application_handler');
const { ApproveApplicationHandler } = require('./application/handlers/approve_application_handler');
const { CancelApplicationHandler } = require('./application/handlers/cancel_application_handler');
const { UploadAttachmentHandler } = require('./application/handlers/upload_attachment_handler');
const { SettlePaymentHandler } = require('./application/handlers/settle_payment_handler');

const { GetApplicationByIdQuery } = require('./application/queries/get_application_by_id_query');
const { GetApplicationsForReviewerQuery } = require('./application/queries/get_applications_for_reviewer_query');
const { GetApplicationsForApproverQuery } = require('./application/queries/get_applications_for_approver_query');

const { ApplicationController } = require('./interfaces/rest/application_controller');
const { ReviewController } = require('./interfaces/rest/review_controller');
const { ApprovalController } = require('./interfaces/rest/approval_controller');

const applicationRoutes = require('./interfaces/routes/application_routes');
const reviewRoutes = require('./interfaces/routes/review_routes');
const approvalRoutes = require('./interfaces/routes/approval_routes');
const publicRoutes = require('./interfaces/routes/public_routes');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const uploadsDir = process.env.STORAGE_BASE_PATH || 'uploads/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.log('Swagger file not found or invalid, skipping Swagger UI setup.');
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(clerkMiddleware());
app.use(authMiddleware);

const repository = new TradeLicenseRepositoryImpl();
const fileStorageService = new LocalFileStorageService();
const domainEventPublisher = new DomainEventPublisher();
const applicationNumberGenerator = new ApplicationNumberGenerator();
const pdfGenerationService = new PdfGenerationService();
const emailService = new EmailService();

const submitApplicationHandler = new SubmitApplicationHandler(repository, applicationNumberGenerator, domainEventPublisher);
const reviewApplicationHandler = new ReviewApplicationHandler(repository, domainEventPublisher);
const approveApplicationHandler = new ApproveApplicationHandler(repository, domainEventPublisher, emailService);
const cancelApplicationHandler = new CancelApplicationHandler(repository);
const uploadAttachmentHandler = new UploadAttachmentHandler(repository, fileStorageService);
const settlePaymentHandler = new SettlePaymentHandler(repository);

const getApplicationByIdQuery = new GetApplicationByIdQuery(repository);
const getApplicationsForReviewerQuery = new GetApplicationsForReviewerQuery(repository);
const getApplicationsForApproverQuery = new GetApplicationsForApproverQuery(repository);

const applicationController = new ApplicationController(
  submitApplicationHandler,
  getApplicationByIdQuery,
  repository,
  settlePaymentHandler,
  uploadAttachmentHandler,
  cancelApplicationHandler,
  pdfGenerationService
);
const reviewController = new ReviewController(getApplicationsForReviewerQuery, reviewApplicationHandler);
const approvalController = new ApprovalController(
  getApplicationsForApproverQuery,
  approveApplicationHandler,
  getApplicationByIdQuery
);

const { AnalyticsRepository } = require('./infrastructure/persistence/analytics_repository');
const { AnalyticsController } = require('./interfaces/rest/analytics_controller');
const analyticsRoutes = require('./interfaces/routes/analytics_routes');

const analyticsRepository = new AnalyticsRepository();
const analyticsController = new AnalyticsController(analyticsRepository);

app.use('/api/v1/public', publicRoutes(applicationController));
app.use('/api/v1/applications', applicationRoutes(applicationController));
app.use('/api/v1/review', reviewRoutes(reviewController));
app.use('/api/v1/approval', approvalRoutes(approvalController));
app.use('/api/v1/analytics', analyticsRoutes(analyticsController));

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, 'localhost', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
