# The Poetry Network

A modern platform for poetry and short story workshops, built with Next.js, TypeScript, and Prisma.

## 🌟 Features

### Content Creation
- 📝 Rich text editor for both poetry and short stories
- 📊 Real-time analysis of poetry metrics (rhyme, meter, syllables)
- 📈 Story analysis (word count, reading time, readability)
- 💾 Multiple content templates for different styles and genres

### Workshop Management
- 👥 Create and join writing workshops
- 🔍 Workshop categories and tags for easy discovery
- 📅 Event scheduling and calendar management
- 📨 Member invitations and role management

### Feedback System
- 💬 Structured commenting system
- ✍️ Detailed feedback templates
- 📋 Progress tracking
- 🔔 Real-time notifications

### Analytics
- 📊 Workshop engagement metrics
- 📈 Participation statistics
- 🎯 Progress tracking
- 📉 Activity monitoring

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Real-time**: Pusher
- **Email**: Resend
- **Styling**: Tailwind CSS + shadcn/ui

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
# or
yarn install
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
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## 📖 Usage

### Creating a Workshop

1. Sign up/Login to your account
2. Navigate to "Create Workshop"
3. Fill in workshop details:
   - Title and description
   - Category and tags
   - Privacy settings
   - Member limits

### Submitting Content

1. Join a workshop
2. Click "New Submission"
3. Choose content type (poem/short story)
4. Use the rich text editor to create your content
5. Add notes (optional)
6. Submit for feedback

### Providing Feedback

1. Open a submission
2. Use the commenting system
3. Provide structured feedback
4. Engage in discussions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Pusher](https://pusher.com/)
- [Resend](https://resend.com/)

## 📞 Support & Community

For support and community engagement:

### GitHub
- [Open an issue](https://github.com/mooncakeSG/The-Poetry-Network/issues) for bug reports and feature requests
- [Discussions](https://github.com/mooncakeSG/The-Poetry-Network/discussions) for general questions and community interaction

### Discord Community
Join our vibrant Discord community to:
- Get help and support
- Share your work
- Connect with other writers
- Participate in workshops
- Stay updated on announcements

[Join our Discord Server](https://discord.gg/your-invite-link) <!-- Replace with your Discord invite link -->

### Email
For private inquiries:
- General Support: poetrynetwork.support@gmail.com <!-- Replace with your support email -->
- Security Issues: security@poetrynetwork.com <!-- Replace with your security email -->

### Documentation
- [User Guide](https://github.com/mooncakeSG/The-Poetry-Network/wiki) <!-- Create this wiki -->
- [API Documentation](https://github.com/mooncakeSG/The-Poetry-Network/wiki/API) <!-- Create this wiki page -->
- [FAQs](https://github.com/mooncakeSG/The-Poetry-Network/wiki/FAQ) <!-- Create this wiki page -->

---

Made with ❤️ for the writing community 