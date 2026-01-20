# Backend Structure

The backend is built with **Node.js, Express, and Prisma ORM**, following a **Layered Architecture** and **Dependency Injection** principles.

## Architecture Layers

### 1. Routes (`src/routes`)
- Entry points for HTTP requests.
- Maps URLs to Controllers.
- Minimal logic; simply routes requests to the appropriate controller method.

### 2. Controllers (`src/controllers`)
- Handles HTTP requests and responses (parsing body, params, sending JSON).
- Does **not** contain business logic.
- Validates input and delegates to Services.
- **Dependency**: Uses `Service` classes.

### 3. Services (`src/services`)
- Contains the core **Business Logic**.
- Handles complex operations, calculations, and data transformation.
- Agnostic of HTTP (doesn't know about `req` or `res`).
- **Dependency**: Uses `Repository` classes.

### 4. Repositories (`src/repositories`)
- Handles **Data Access** logic.
- Interacts directly with the Database (via Prisma).
- Abstract database operations (find, create, update, delete).
- **Dependency**: Uses `PrismaClient`.

### 5. Dependency Injection (`src/container.js`)
- Centralized wiring of all components.
- Creates instances of Repositories, Services, and Controllers.
- Injects dependencies into constructors.
- Ensures loose coupling and easier testing.

## Directory Overview

```
server/
├── api/
│   ├── src/
│   │   ├── config.js         # Environment configuration
│   │   ├── container.js      # Dependency Injection Container
│   │   ├── app.js            # Express App Entry Point
│   │   ├── controllers/      # Request Handlers
│   │   ├── services/         # Business Logic
│   │   ├── repositories/     # Database Access
│   │   ├── routes/           # API Route Definitions
│   │   ├── middlewares/      # Express Middlewares (Auth, Error, etc.)
│   │   ├── utils/            # Helper functions
│   │   └── prisma.js         # Prisma Client Instance
```

## Key Principles
- **SOLID**: Classes are designed with Single Responsibility in mind.
- **Async/Await**: All async operations use modern JS patterns with `asyncHandler` wrapper.
- **Validation**: Zod (or custom validation) is used in Controllers/Services.
