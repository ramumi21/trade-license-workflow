# XJ3395 Trade License Workflow System
## Comprehensive Technical Reference Manual

---

# CHAPTER 1: Project Overview

The XJ3395 Trade License Workflow System is an enterprise-grade web application designed to manage the end-to-end lifecycle of trade license applications. It digitizes a historically manual bureaucratic process, offering a secure citizen-facing portal for applying and tracking licenses alongside an internal administrative dashboard for government officials to review, verify, and ultimately authorize the issuance of these licenses.

### System Roles
1. **Applicant (CUSTOMER):** Citizens or business owners who submit trade license applications, upload supporting documentation, and settle required fees.
2. **Reviewer (REVIEWER):** First-line administrative officers who inspect submitted documents for compliance. They can accept the application (moving it to the next stage), reject it, or return it to the applicant for adjustments.
3. **Approver (APPROVER):** Senior authorization officials who make the final legal decision to grant or deny the trade license.

### The Business Narrative
An Applicant logs into the system via the public portal and initiates a new trade license application. They are prompted to fill in details, settle the required application fee, and upload necessary documentation (e.g., ID cards, business registration). Once the payment is settled and documents are attached, the applicant submits the application.

A Reviewer logs into their dashboard and sees the application in their "Reviewer Waiting List". They open the application to inspect the documents. If a document is blurry, they choose the "Adjust" action and leave a comment, sending the application back to the Applicant. The Applicant fixes the issue and re-submits. The Reviewer checks it again and selects "Accept".

The application moves to the "Approver Waiting List". An Approver reviews the entire history, including the Reviewer's notes. Upon clicking "Approve", the system automatically generates an official, verifiable PDF license with a unique QR code and dispatches an automated email to the Applicant containing their new status. The Applicant can then download their license directly from the portal.

### Technology Stack
*   **Node.js (Express):** The core backend runtime and web framework.
*   **PostgreSQL:** Relational database for transactional integrity.
*   **Supabase Storage:** Cloud storage provider for securely storing uploaded applicant documents.
*   **Clerk (@clerk/express, @clerk/clerk-react):** Modern identity management system for seamless, secure authentication and role-based access control.
*   **Multer:** Middleware for handling `multipart/form-data` uploads.
*   **Nodemailer:** Transports automated email notifications.
*   **PDFKit & QRCode:** Generates dynamic, secure PDF certificates on-the-fly.
*   **React + Vite:** Frontend SPA framework optimized for speed.
*   **TanStack Query & Tailwind CSS:** Frontend data fetching and modern UI styling.

### How to Run Locally
1. Clone the repository and navigate to the root directory `/`.
2. Start the PostgreSQL database via Docker: `docker-compose up -d`.
3. Install backend dependencies: `npm install`.
4. Run the database migrations to set up the schema: `npm run migrate:up`.
5. Start the backend server: `npm run dev` (starts on `http://localhost:3000`).
6. Open a new terminal, navigate to `/frontend`, install dependencies: `npm install`.
7. Start the Vite development server: `npm run dev` (starts on `http://localhost:5173`).

### Environment Variables
**Root `.env`**
*   `PORT`: The port the backend runs on (default: `3000`).
*   `NODE_ENV`: E.g., `development` or `production`.
*   `DATABASE_URL`: Full connection string to PostgreSQL (e.g., `postgres://xj3395_user:xj3395_pass@localhost:5433/xj3395`).
*   `STORAGE_BASE_PATH`: Local temp directory for file uploads before moving to cloud (e.g., `uploads/`).
*   `CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: Keys to verify JWTs from Clerk.
*   `SUPABASE_URL`: Base URL for the Supabase project.
*   `SUPABASE_SERVICE_ROLE_KEY`: Admin API key for Supabase Storage.
*   `SUPABASE_BUCKET_NAME`: The name of the public storage bucket (e.g., `trade-license-uploads`).
*   `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Credentials for the email SMTP server (e.g., Mailtrap).
*   `EMAIL_FROM`: The verified sender address (e.g., `"Trade License System" <noreply@tradelicense.gov.et>`).

**Frontend `.env`**
*   `VITE_CLERK_PUBLISHABLE_KEY`: Clerk key for the React SDK.
*   `VITE_API_URL`: Backend URL (e.g., `http://localhost:3000/api/v1`).

---

# CHAPTER 2: Architecture Deep Dive

This project strictly adheres to **Clean Architecture** combined with **Domain-Driven Design (DDD)**. Clean Architecture ensures that the core business logic is completely isolated from frameworks, databases, and external APIs.

### The 4 Layers
1.  **Domain Layer (`src/domain/`):** The absolute core. It contains Entities, Value Objects, Enums, and Domain Exceptions. It has **zero dependencies** on any other layer or external npm package (except `uuid`). It knows nothing about PostgreSQL or HTTP.
2.  **Application Layer (`src/application/`):** Coordinates use cases (Commands and Queries). It orchestrates actions by fetching entities from repositories, calling domain methods, and saving them back. It defines Interfaces for external services (`IStorageService`, `IEmailService`) but does not implement them.
3.  **Infrastructure Layer (`src/infrastructure/`):** The implementation details. This layer implements the interfaces defined in the Application layer. It contains the actual SQL queries (`trade_license_repository_impl.js`), the Supabase SDK calls, and the Nodemailer configuration.
4.  **Interfaces Layer (`src/interfaces/`):** The presentation layer. It handles HTTP requests, Express routes, Joi validation, and JWT verification. It parses HTTP payloads and passes them to the Application layer.

### The Dependency Rule in Action
The Dependency Rule states that source code dependencies must only point *inward*, toward the Domain layer. 
**Example:** `SubmitApplicationHandler` (Application layer) depends on `TradeLicenseApplication` (Domain layer). It also depends on the `IStorageService` interface. The `SupabaseStorageService` (Infrastructure layer) implements `IStorageService`, but the Application layer never directly `require()`s the Supabase service. This allows us to swap Supabase out for AWS S3 without touching a single line of business logic.

### Why No ORM?
This project deliberately avoids ORMs like Prisma or TypeORM in favor of raw `pg` queries. 
**The Tradeoff:** ORMs often tightly couple domain entities to database tables (Active Record pattern). By using raw SQL, the persistence layer manually maps database rows into pure, framework-agnostic Domain Entities (in the `_buildDomainModel` method). This ensures the `TradeLicenseApplication` class remains a pure JavaScript class with encapsulated behaviors, rather than a data bag managed by an ORM.

### Dependency Injection
In `src/index.js`, the system is manually wired together. All Infrastructure services (`TradeLicenseRepositoryImpl`, `SupabaseStorageService`, `EmailService`) are instantiated at the application root and injected into the Application handlers via their constructors. Those handlers are then injected into the REST Controllers.

```text
       [Express Router]
              ↓
[ApplicationController (Interfaces)]
              ↓
[SubmitApplicationHandler (Application)]  <--- Injected: [TradeLicenseRepositoryImpl (Infrastructure)]
              ↓
[TradeLicenseApplication (Domain)]
```

---

# CHAPTER 3: Domain Layer — The Core

The Domain layer encapsulates all business rules.

### Entities & Value Objects

*   **`src/domain/model/trade_license_application.js`**
    *   **Purpose:** The Aggregate Root representing the core business object.
    *   **Properties:** `id`, `applicationNumber`, `licenseType`, `status`, `applicantId`, `commodityId`, `payment` (Value Object), `attachments` (Array of Entities), `comments` (Array of Entities), `createdAt`, `updatedAt`, `domainEvents`.
    *   **Method `submit()`:** Checks if status is `PENDING` or `ADJUSTED`. Validates that payment is settled (`this.payment.isSettled`). Ensures at least one attachment exists. Updates status to `SUBMITTED` and registers an `ApplicationSubmittedEvent`. Throws `PaymentNotSettledException` or `InvalidWorkflowTransitionException`.
    *   **Method `review(action, commentMessage, reviewerId)`:** Accepts `ACCEPT`, `REJECT`, or `ADJUST`. Transitions status from `SUBMITTED` to `UNDER_REVIEW`, `REJECTED`, or `ADJUSTED` respectively. Appends a new `WorkflowComment`.
    *   **Method `approve(action, commentMessage, approverId)`:** Transitions status from `UNDER_REVIEW` to `APPROVED`, `REJECTED`, or `RE_REVIEW`.

*   **`src/domain/model/payment.js`**
    *   **Purpose:** Value object representing a payment record.
    *   **Properties:** `amount`, `currency`, `transactionId`, `paidAt`, `isSettled`.

*   **`src/domain/model/attachment.js`** & **`workflow_comment.js`**
    *   **Purpose:** Child entities of the Application aggregate. Handled entirely through the Aggregate Root.

### Enums
*   **`src/domain/enums/workflow_status.js`**: `PENDING`, `SUBMITTED`, `UNDER_REVIEW`, `ADJUSTED`, `APPROVED`, `REJECTED`, `RE_REVIEW`, `CANCELLED`.
*   **`src/domain/enums/approval_action.js`**: `APPROVE`, `REJECT`, `REREVIEW`.
*   **`src/domain/enums/review_action.js`**: `ACCEPT`, `REJECT`, `ADJUST`.

### State Machine (ASCII)
```text
[PENDING] --------> (submit) --------> [SUBMITTED]
   ^                                      |    |
   | (adjust)                             |    | (accept)
[ADJUSTED] <------- (review) <------------+    v
   ^                                    [UNDER_REVIEW]
   | (rereview)                           |    |
   +--------------- (approve) <-----------+    | (approve/reject)
                                               v
                                [APPROVED] / [REJECTED]
```

### Domain Interfaces
*   **`src/domain/repository/trade_license_application_repository.js`**
    *   Defines signatures: `findById(id)`, `findByApplicantId(id)`, `findForReviewerQueue()`, `findForApproverQueue()`, `save(application)`, `update(application)`.

---

# CHAPTER 4: Application Layer — Use Cases

The Application layer coordinates execution but delegates business logic to the Domain.

### Handlers
*   **`src/application/handlers/submit_application_handler.js`**
    *   **Constructor:** Injects `repository`, `applicationNumberGenerator`, `domainEventPublisher`.
    *   **Execution:** If `command.applicationId` exists, fetches it and calls `application.submit()`. If creating new, generates a sequence number, creates a new `TradeLicenseApplication`, and saves. Publishes domain events and returns a `Result.success()`.
*   **`src/application/handlers/approve_application_handler.js`**
    *   **Execution:** Fetches application, calls `app.approve()`, saves it. If action is `APPROVE`, it triggers a fire-and-forget call to `this.emailService.sendApprovalEmail()`.
*   **`src/application/handlers/upload_attachment_handler.js`**
    *   **Execution:** Reads the local Multer temp file buffer. Calls `this.storageService.uploadFile()` to upload to Supabase. Pushes a new `Attachment` entity to `app.attachments`. Saves aggregate. Unlinks (deletes) the temp file.

### Queries & Mappers
*   Queries like `get_applications_for_approver_query.js` bypass complex domain logic and call the repository directly to fetch lists, piping them through `application_mapper.js`.
*   **`src/application/mapper/application_mapper.js`**: Converts raw Domain Entities into safe, flat DTO objects (`toApplicationDetailDto`, `toApplicationSummaryDto`) so HTTP controllers don't serialize internal domain states.

### Application Interfaces
*   **`src/application/interfaces/i_storage_service.js`**: Defines `uploadFile(fileBuffer, originalFilename, mimeType)`.
*   **`src/application/interfaces/i_email_service.js`**: Defines `sendApprovalEmail(to, applicantName, applicationId)`.

---

# CHAPTER 5: Infrastructure Layer — External World

This layer implements interfaces and interacts with actual technologies.

### Persistence (`src/infrastructure/persistence/`)
*   **`db.js`**: Initializes the `pg` Pool using `process.env.DATABASE_URL`. Includes an `on('error')` listener to prevent idle client crashes.
*   **`trade_license_repository_impl.js`**: Implements the Repository interface.
    *   `update(application)` executes a complex Upsert: `INSERT ... ON CONFLICT (id) DO UPDATE`. It saves the parent application, then iterates over `application.attachments` and `application.comments`, inserting any that don't have an `id` yet. This ensures atomic aggregate saves wrapped in `BEGIN` and `COMMIT` transactions.
    *   `_buildDomainModel(row)` does the heavy lifting of hydrating the raw DB row back into a `TradeLicenseApplication` instance.
*   **`analytics_repository.js`**: Contains raw analytical `GROUP BY` SQL queries to power the dashboard charts without instantiating domain entities (CQRS pattern).

### Services
*   **`src/infrastructure/storage/supabase_storage_service.js`**: Implements `IStorageService`. Uses `@supabase/supabase-js`. Calls `supabase.storage.from(bucketName).upload()` and `getPublicUrl()`.
*   **`src/infrastructure/email/email_service.js`**: Implements `IEmailService`. Uses `nodemailer`. Formats an HTML email acknowledging approval and sends it via SMTP.
*   **`src/infrastructure/services/pdf_generation_service.js`**: Uses `pdfkit` to draw a secure certificate. Generates a QR Code via `qrcode` pointing to the public `/verify/:id` route and embeds it in the PDF buffer stream.

### Migrations
*   **`1610000000000_create_trade_license_tables.js`**: Defines `trade_license_applications`, `attachments`, `workflow_comments`, and `application_sequences` tables. Uses `gen_random_uuid()` from `pgcrypto`.

---

# CHAPTER 6: Interfaces Layer — HTTP API

### Controllers (`src/interfaces/rest/`)
*   **`application_controller.js`**: 
    *   `createApplication`: Uses `Joi` to validate `licenseType`. Constructs `SubmitApplicationCommand`.
    *   `downloadLicense`: Enforces Zero Trust Security (`req.user.userId !== application.applicantId`). Pipes the PDF generation directly to the HTTP `res` stream.
    *   `verifyLicensePublic`: Calls Clerk `clerkClient.users.getUser()` to resolve the applicant's initials safely for public viewing without exposing PII.
*   **`approval_controller.js`**:
    *   `approveAction`: If approving, synchronously calls Clerk to look up the applicant's real email address before dispatching the command to the handler, enabling the email notification.

### Middleware (`src/interfaces/middleware/`)
*   **`auth_middleware.js`**: Extracts the JWT using `@clerk/express`'s `getAuth`. Bypasses auth for `/api-docs` and `/verify`. Hydrates the user's role from `clerkClient.users.getUser()` publicMetadata and assigns it to `req.user`.
*   **`role_middleware.js`**: Enforces specific RBAC roles (e.g., `requireRole('APPROVER')`).
*   **`error_middleware.js`**: A centralized error catcher. Translates `InvalidWorkflowTransitionException` to HTTP 422 (Unprocessable Entity).

### Routes (`src/interfaces/routes/`)
Routes define the Express architecture. `application_routes.js` maps `POST /:id/attachments` and injects the `multer({ dest: process.env.STORAGE_BASE_PATH })` middleware exactly where needed.

---

# CHAPTER 7: Database Schema

**`trade_license_applications`**
*   `id` (UUID, PK)
*   `application_number` (VARCHAR, UNIQUE)
*   `status` (VARCHAR)
*   `payment_amount`, `payment_currency`, `payment_is_settled`
*   `applicant_id` (VARCHAR) - Stores the Clerk User ID.

**`attachments`**
*   `id` (UUID, PK)
*   `application_id` (UUID, FK -> trade_license_applications.id ON DELETE CASCADE)
*   `file_path` (VARCHAR) - Stores the Supabase public URL.

**`workflow_comments`**
*   `id` (UUID, PK)
*   `application_id` (UUID, FK -> trade_license_applications.id ON DELETE CASCADE)
*   `role` (VARCHAR), `message` (TEXT)

**`application_sequences`**
*   `year` (INT, PK), `last_sequence` (INT) - Tracks the auto-incrementing application IDs per year.

---

# CHAPTER 8: Frontend

The React application inside `/frontend` handles the user interface.
*   **Authentication:** Uses `<ProtectedRoute>` leveraging the `@clerk/clerk-react` hooks (`useAuth`, `useUser`) to redirect unauthenticated users to `/auth/sign-in`.
*   **Features Directory:** Grouped by domain (`applications`, `approvals`, `dashboard`, `reviews`).
*   **Dashboards:** Conditionally rendered based on `req.user.role`.
    *   `ApproverDashboard.tsx` shows the "Approver Waiting List" and charts.
    *   `ReviewerDashboard.tsx` shows the "Reviewer Waiting List".
    *   `CustomerDashboard.tsx` shows active applications and drafts.
*   **State Management:** `useApi.ts` implements Axios wrappers configured to automatically attach the Clerk Bearer token to every backend request.

---

# CHAPTER 9: Key Workflows — Code Trace

### Trace: Applicant Uploads an Attachment
1.  **Client:** Hits `POST /api/v1/applications/:id/attachments` via `multipart/form-data`.
2.  **Route (`application_routes.js`):** Intercepted by `auth_middleware`, `requireRole('CUSTOMER')`, and `multer` (writes file to `/uploads/` locally).
3.  **Controller (`application_controller.js`):** `uploadAttachment()` verifies `req.file` exists, packages it into a command.
4.  **Handler (`upload_attachment_handler.js`):**
    *   Calls `repository.findById(id)`.
    *   Reads the temp file via `fs.readFile`.
    *   Calls `storageService.uploadFile()` -> uploads to Supabase, returns URL.
    *   Pushes `new Attachment(..., url)` to `app.attachments`.
    *   Calls `repository.save(app)`.
    *   Deletes local file via `fs.unlink`.
5.  **Repository (`trade_license_repository_impl.js`):** Executes `INSERT INTO attachments`.

### Trace: Approver Approves an Application
1.  **Client:** Hits `PUT /api/v1/approval/:id/action` with `{"action": "APPROVE"}`.
2.  **Controller (`approval_controller.js`):**
    *   Validates payload via Joi.
    *   Calls `clerkClient.users.getUser(applicantId)` to fetch the user's email address.
    *   Constructs command including `applicantEmail`.
3.  **Handler (`approve_application_handler.js`):**
    *   Calls `repository.findById(id)`.
    *   Calls domain method `app.approve()`, changing status to `APPROVED` and pushing `ApplicationApprovedEvent`.
    *   Calls `repository.save(app)`.
    *   Triggers `emailService.sendApprovalEmail(...)` (fire-and-forget promise).
    *   Calls `domainEventPublisher.publish()`.

---

# CHAPTER 10: DDD Concepts in This Project

*   **Aggregate Root:** `TradeLicenseApplication` protects the boundary of the application, its attachments, and its comments. All mutations to comments or status MUST go through methods on this class.
*   **Entities:** `Attachment`, `WorkflowComment`. They have unique `id`s but are scoped to the Aggregate Root.
*   **Value Objects:** `Payment`. It has no ID. Two payments with the same amount and transaction ID are conceptually identical.
*   **Domain Events:** `ApplicationSubmittedEvent`, etc. Raised inside the aggregate using `registerEvent()`.
*   **Ubiquitous Language:** Terms heavily used include `LicenseType`, `CommodityId`, `WorkflowStatus`, `Approver`, `Reviewer`.

---

# CHAPTER 11: Cross-Cutting Concerns

*   **Authentication Flow:** A user signs in via Clerk UI -> React app gets a JWT -> Axios sends JWT in `Authorization` header -> Express `authMiddleware` validates JWT using `getAuth(req)` -> Maps `publicMetadata.role` to `req.user.role`.
*   **Error Handling Strategy:** Throw errors aggressively in the Domain layer (`InvalidWorkflowTransitionException`). Do not catch them in Handlers or Controllers. Let them bubble up to `error_middleware.js` where they are gracefully mapped to appropriate HTTP status codes (e.g., 422 Unprocessable Entity) and standard JSON structures.
*   **Logging:** Minimal in production, but key milestones are logged via `console.log` in `DomainEventPublisher` and `EmailService`.

---

# CHAPTER 12: Developer Guide

### How to Add a New Database Column
1.  **Migration:** Create a new file in `src/infrastructure/persistence/migrations` via `node-pg-migrate`. Write the `ALTER TABLE ... ADD COLUMN ...` command.
2.  **Domain:** Add the new property to the `TradeLicenseApplication` constructor in the domain model.
3.  **Repository:** Update the `INSERT`, `UPDATE`, and `_buildDomainModel()` queries in `trade_license_repository_impl.js` to map the new column to the domain entity.
4.  **Mapper:** Update `toApplicationDetailDto` in `application_mapper.js` to expose it to the API.

### How to Add a New API Endpoint
1.  Define the route in `src/interfaces/routes/` (e.g., `router.post('/custom')`).
2.  Create the controller method in the corresponding controller. Validate input with `Joi`.
3.  Create a new Handler in `src/application/handlers/`.
4.  Register and inject the dependencies in `src/index.js`.

### Common Mistakes to Avoid
*   **Do not write business logic in controllers:** Controllers should only parse HTTP requests and format HTTP responses.
*   **Do not leak DB details into the Domain:** Entities should never know about PostgreSQL or SQL queries.
*   **Awaiting Fire-and-Forget Emails:** In `ApproveApplicationHandler`, do not `await` the email service. Catch the error instead. Awaiting it will slow down the API response unnecessarily.

### End-to-End Debugging
If a request fails, start by checking the Network tab in the Frontend. Identify the HTTP status code. Look at the terminal running `npm run dev`. If it's a 422, the failure occurred inside the Domain Layer (e.g., business rule violation). If it's a 500, it's likely a database mapping error in `trade_license_repository_impl.js` or an issue with the Supabase API keys.
