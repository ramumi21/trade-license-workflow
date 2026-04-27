# Project: XJ3395 — Trade License Workflow System

A full-stack enterprise web application for managing the end-to-end lifecycle of Trade License applications. It provides a citizen-facing portal for applying and tracking licenses, and an internal administrative dashboard for Reviewers and Approvers to verify and issue licenses.

## Architecture Overview

The system is composed of a **Node.js backend** and a **React frontend**, integrated with **Clerk** for authentication and role-based access control.

### Backend (Node.js / Express / PostgreSQL)
Follows Domain-Driven Design (DDD) and Clean Architecture principles:
1. **Domain Layer**: Contains business entities, value objects, domain events, and repository interfaces. No external dependencies.
2. **Application Layer**: Contains Use Cases (CQRS patterns), DTOs, Handlers, and application logic.
3. **Infrastructure Layer**: Implements persistence (PostgreSQL via node-pg-migrate), file storage (Multer), and PDF generation.
4. **Interfaces Layer**: Exposes REST APIs (Express), routing, controllers, and middlewares (including Clerk Auth).

### Frontend (React / Vite / TypeScript)
Modern Single Page Application built with:
- **Vite** & **React** for fast development and rendering.
- **TypeScript** for type safety.
- **TanStack Query** for data fetching, caching, and state management.
- **Shadcn UI** & **Tailwind CSS** for a responsive, modern, glassmorphism-inspired enterprise UI.
- **React Router** for routing.
- **Clerk React SDK** for secure authentication and user management.

## Workflow State Machine

The core business logic enforces the following application lifecycle:

```text
PENDING <---> ADJUSTED
  |             |
  v             v
SUBMITTED <--> RE_REVIEW
  |
  v
UNDER_REVIEW -> REJECTED (terminal)
  |
  v
APPROVED (terminal)
```

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- A [Clerk](https://clerk.com) account (for authentication)

## Project Structure

- `/` - Backend Node.js application (Root directory)
- `/frontend` - Frontend React application
- `/src` - Backend source code
- `/src/infrastructure/persistence/migrations` - Database migrations
- `/uploads` - Locally stored attachments and generated PDFs

## How to Run Locally

To run the project, you need to start the database, the backend API, and the frontend development server simultaneously.

### 1. Setup & Start Database (Terminal 1 - Root Directory)
Make sure you are in the root directory (`/`).
```bash
# Start PostgreSQL and pgAdmin containers
docker-compose up -d

# Install backend dependencies
npm install

# Run database migrations (only needed initially or after DB changes)
npm run migrate:up
```

### 2. Start Backend Server (Terminal 1 - Root Directory)
```bash
# Start the Node.js API (runs on port 3000)
npm run dev
```

### 3. Start Frontend Application (Terminal 2 - Frontend Directory)
Open a new terminal and navigate to the `frontend` folder.
```bash
cd frontend

# Install frontend dependencies
npm install

# Start the Vite development server (runs on port 5173)
npm run dev
```

The application will now be available at:
- **Frontend App:** http://localhost:5173
- **Backend Swagger UI:** http://localhost:3000/api-docs
- **pgAdmin (DB Management):** http://localhost:5050 (Login: `admin@xj3395.com` / `admin123`, DB host: `postgres`, DB user: `xj3395_user`)

## Environment Variables

The project requires `.env` files in both the root and `frontend` directories containing your Clerk API keys and database configuration.

**Root `.env` Example:**
```env
PORT=3000
DATABASE_URL=postgres://xj3395_user:xj3395_pass@localhost:5433/xj3395
```

**Frontend `.env` Example (`frontend/.env`):**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3000/api/v1
```
