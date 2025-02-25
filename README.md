# 💼 Handle My Business

A robust NestJS application implementing Clean Architecture and CQRS patterns for business management.

## ✨ Features

- Clean Architecture implementation
- CQRS pattern
- Authentication & Authorization
- Product Management
- User Management
- PostgreSQL database
- Comprehensive test coverage
- CI/CD pipeline

## 🔧 Prerequisites

- Node.js (v20+)
- PostgreSQL (v16+)
- npm
- Docker (optional)

## 🐳 Quick Start with Docker

```bash
# Start development database
docker-compose up postgres-dev -d

# Start test database
docker-compose up postgres-test -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down

# Remove volumes
docker-compose down -v
```

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/handle-my-business.git

# Install dependencies
npm install
```

## ⚙️ Environment Setup

Create `.env` and `.env.test` files in the root directory:

```env
# Development environment (.env)
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=dev_user
DATABASE_PASSWORD=dev_password
DATABASE_NAME=dev_db

# Test environment (.env.test)
JWT_SECRET=test_secret_key
JWT_EXPIRES_IN=1h
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=test_user
DATABASE_PASSWORD=test_password
DATABASE_NAME=test_db
```

> Note: When using Docker, the database ports are fixed to 5432 (dev) and 5433 (test).

## 🗄️ Database Setup

```bash
# Using Docker
docker-compose up postgres-dev -d   # For development
docker-compose up postgres-test -d   # For testing

# Using local PostgreSQL
# Run migrations
npm run migration:run

# Generate a new migration
npm run migration:generate --name=YourMigrationName

# Revert last migration
npm run migration:revert

# Reset database (drop + run migrations)
npm run db:reset
```

## 🏃 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific module tests
npm run test:auth
npm run test:user
npm run test:product

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📊 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run prettier

# Type check
npm run typecheck

# Security audit
npm run security:audit
```

## 📁 Project Structure

```
src/
├── common/               # Shared utilities, filters, etc.
├── database/             # Database configuration and migrations
├── modules/              # Feature modules
│   ├── auth/             # Authentication module
│   ├── product/          # Product management
│   └── user/             # User management
└── main.ts               # Application entry point
```

## 🏗️ Architecture

This project follows Clean Architecture principles:

- **Domain Layer**: Business rules and entities
- **Application Layer**: Use cases and business logic
- **Infrastructure Layer**: External concerns (database, framework, etc.)
- **Interface Layer**: Controllers and DTOs

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is unlicensed.

## 👨‍💻 Author

This project is developed by [@BenjaminChoron](https://github.com/BenjaminChoron).
