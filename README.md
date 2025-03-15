# The Poetry Network (Work in Progress 🚧)

A modern platform for poetry and short story workshops, built with Next.js, TypeScript, and Prisma. **Currently under active development and seeking contributors!**

## 🌟 Current Status

This project is actively being developed and **needs help from contributors**. While the basic infrastructure is in place, there are many features that need implementation and improvements to be made.

### What's Working
- Basic authentication system
- Core poetry creation and editing
- Initial workshop system setup
- Basic user profiles
- API foundation

### What Needs Help
- Email verification system
- Password reset functionality
- Workshop real-time collaboration
- Advanced search features
- Analytics dashboard
- Testing coverage
- Documentation improvements
- Security enhancements

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Real-time**: Pusher
- **Email**: Resend
- **Styling**: Tailwind CSS + shadcn/ui

## 🤝 Want to Help?

We're looking for contributors! If you're interested in helping, you can:

1. Check our [TODO.md](TODO.md) for specific tasks
2. Look at our [Project Board](https://github.com/your-username/poetry-network/projects) for current priorities
3. Review our [Contributing Guide](CONTRIBUTING.md)
4. Join our development discussions

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mooncakeSG/The-Poetry-Network.git
cd poetry-network
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your `.env` file with:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/poetry_network"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
RESEND_API_KEY="your-resend-api-key"
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📝 Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 🆘 Need Help?

If you're interested in contributing but need guidance:
1. Open an issue with questions
2. Check our [Wiki](https://github.com/your-username/poetry-network/wiki)
3. Contact the maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 