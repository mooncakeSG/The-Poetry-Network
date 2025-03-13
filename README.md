# The Poetry Network

> ⚠️ **Work in Progress** ⚠️
> 
> This project is currently under active development. Features and functionality may change as we continue to build and improve the platform.

## Overview

The Poetry Network is a collaborative platform for poets and writers to share their work, participate in workshops, and receive feedback from the community. It's built with Next.js, TypeScript, and Prisma, providing a modern and responsive web application.

## Features (In Development)

- 🔐 User Authentication
- 📝 Draft System
- 📚 Workshop Management
- 💬 Comments and Feedback
- 🔍 Search Functionality
- 🏷️ Tag System
- 📱 Responsive Design

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Testing**: Jest

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

We welcome contributions! Please see our [Contributing Guide](.github/wiki/Contributing-Guide.md) for details.

## Documentation

For detailed documentation, please visit our [Wiki](.github/wiki/Home.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details. 