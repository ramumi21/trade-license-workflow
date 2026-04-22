# Project: XJ3395 — Trade License Workflow

## Architecture Overview
This project follows Domain-Driven Design (DDD) and Clean Architecture:
1. **Domain Layer**: Contains business entities, value objects, domain events, and the repository interfaces. No external dependencies.
2. **Application Layer**: Contains Use Cases (CQRS patterns), DTOs, Handlers, and application logic.
3. **Infrastructure Layer**: Implements persistence (PostgreSQL via node-pg-migrate), file storage, and event publishing.
4. **Interfaces Layer**: Exposes REST APIs, routing, controllers, and middlewares.

## Workflow State Machine
```
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

## How to run
a. `docker-compose up -d`
b. `npm install`
c. `npm run migrate:up`
d. `npm run dev`
e. Swagger UI: http://localhost:3000/api-docs
f. pgAdmin: http://localhost:5050
   Login: admin@xj3395.com / admin123
   Add server: host=postgres, port=5432, db=xj3395

## Sample curl requests
1. Get a Customer Token:
   `curl -X POST http://localhost:3000/api/v1/auth/token -H "Content-Type: application/json" -d '{"userId": "uuid-here", "role": "CUSTOMER"}'`
2. Create Application:
   `curl -X POST http://localhost:3000/api/v1/applications -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"licenseType":"TRADE_LICENSE"}'`

## Design Decisions
- **DDD & Clean Architecture**: Isolation of business rules.
- **node-pg-migrate**: Database migrations.
- **Result Pattern**: Uniform responses from Application Layer.
- **Dependency Rule**: Domain ← Application ← Infrastructure → Interfaces
