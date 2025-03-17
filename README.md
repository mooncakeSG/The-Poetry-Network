# Poetry Network

A simple web application for sharing and creating poetry with AI assistance.

## Features

- 📝 Create and share poems
- 😊 Track your mood
- 🤖 AI-powered poem generation
- 👥 User authentication
- 📱 Responsive design

## Tech Stack

- Next.js 14
- PostgreSQL with Prisma
- NextAuth.js for authentication
- OpenAI API for AI features
- TailwindCSS for styling

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/poetry-network.git
cd poetry-network
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your credentials.

4. Set up the database:
```bash
npm run db:generate
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
poetry-network/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── page.tsx          # Home page
├── prisma/               # Database schema and migrations
├── public/              # Static assets
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 