# Handle My Business

A NestJS application for managing business operations.

## Description

This application is built using NestJS and follows Domain-Driven Design (DDD) and CQRS patterns. It provides a robust API for managing products and other business operations.

## Features

- Product Management (CRUD operations)
- CQRS implementation
- PostgreSQL database integration
- Clean Architecture principles
- Comprehensive test coverage

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Docker (optional)

## Installation

```bash
# Install dependencies
$ npm install

# Copy environment file
$ cp .env.example .env

# Configure your environment variables in .env
```

## Running the app

```bash
# Development
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Database

```bash
# Run database migrations
$ npm run migration:run

# Generate a new migration
$ npm run migration:generate --name=your-migration-name

# Reset database (drops all tables and reruns migrations)
$ npm run db:reset
```

## Test

```bash
# Unit tests
$ npm run test

# Test coverage
$ npm run test:cov

# E2E tests
$ npm run test:e2e
```

## Project Structure

```
src/
├── modules/                    # Feature modules
│   └── product/                # Product module
│       ├── application/        # Application layer (commands, queries, handlers)
│       ├── domain/             # Domain layer (entities, repositories)
│       └── infrastructure/     # Infrastructure layer (database, external services)
├── database/                   # Database configurations and migrations
└── main.ts                     # Application entry point
```

## Architecture

This project follows Clean Architecture principles and CQRS pattern:

- **Domain Layer**: Contains business logic and entities
- **Application Layer**: Implements use cases using CQRS
- **Infrastructure Layer**: Handles external concerns (database, external services)

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is is unlicensed.

## Author

This project is developed by [@BenjaminChoron](https://github.com/BenjaminChoron).
