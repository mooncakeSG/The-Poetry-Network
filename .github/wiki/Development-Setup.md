# Development Setup

This guide will help you set up Poetry Network for local development.

## Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- Git
- npm or yarn
- A code editor (we recommend VS Code)

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/poetry-network.git
cd poetry-network
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/poetry_network"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npm run prisma:seed
```

## Running the Development Server

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Tools

### VS Code Extensions

We recommend installing these VS Code extensions:
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- GitLens

### Code Style

We use:
- ESLint for linting
- Prettier for code formatting
- TypeScript for type checking

Configure your editor:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

### Writing Tests

- Place tests next to the code they test
- Use `.test.ts` or `.test.tsx` extension
- Follow the testing patterns in existing tests

## Database Management

### Prisma Studio

To view and edit the database:
```bash
npx prisma studio
```

### Migrations

```bash
# Create a migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

## Common Tasks

### Adding a New Feature

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Run tests
4. Submit a pull request

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update a specific package
npm update package-name
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Authentication Issues**
   - Verify OAuth credentials
   - Check NEXTAUTH_URL matches your development URL
   - Ensure NEXTAUTH_SECRET is set

3. **Build Errors**
   - Clear .next directory
   - Delete node_modules and reinstall
   - Check TypeScript errors

### Getting Help

1. Check the [troubleshooting guide](Troubleshooting)
2. Search [existing issues](https://github.com/your-username/poetry-network/issues)
3. Ask in our [Discord community](https://discord.gg/poetry-network)

## Deployment

See our [Deployment Guide](Deployment) for production deployment instructions. 