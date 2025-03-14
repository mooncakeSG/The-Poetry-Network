# Poetry Network

A modern web application for poets and writers to create, share, and collaborate on poetry.

## Database Setup

### Prerequisites
- MySQL Server installed and running
- Node.js and npm installed
- Git installed

### Configuration
1. Create a MySQL user and set up credentials:
   ```sql
   CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON poetry_network.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. Update the `.env.local` file with your MySQL credentials:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/poetry_network"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up the database:
   ```bash
   npm run db:setup
   ```

5. Run database migrations:
   ```bash
   npm run db:migrate
   ```

### Database Structure
The application uses Prisma ORM with the following main models:
- Users
- Poems
- Workshops
- Comments
- Privacy Settings

For detailed schema information, see `prisma/schema.prisma`.

## Features

### AI-Powered Writing Tools

The application includes a suite of AI-powered tools to enhance the writing experience:

1. **Writing Assistant**
   - Get instant feedback on your writing
   - Receive suggestions for improvements
   - Check grammar and style issues
   - Enhance your writing quality

2. **Content Generator**
   - Generate poems and short stories from prompts
   - Get AI-generated content with metadata
   - Analyze generated content for themes and emotions
   - Customize content type and style

3. **Sentiment Analysis**
   - Analyze the emotional tone of your writing
   - Detect underlying themes and topics
   - Get detailed emotion breakdowns
   - Understand how your writing might be perceived

### Privacy Features

- Granular privacy controls for profiles and content
- Customizable visibility settings
- Interaction permissions management
- Private information filtering

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for AI features
- `DATABASE_URL`: Your database connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Your application URL

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 