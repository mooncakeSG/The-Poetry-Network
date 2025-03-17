import { render, screen } from '@testing-library/react';
import { Dashboard } from '../page';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    poem: {
      findMany: jest.fn(),
    },
    mood: {
      findMany: jest.fn(),
    },
  },
}));

const mockSession = {
  user: {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
  },
};

const mockPoems = [
  {
    id: '1',
    title: 'Test Poem 1',
    content: 'Content 1',
    author: {
      name: 'Test Author',
      image: 'https://example.com/avatar.jpg',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    published: true,
    publishedAt: new Date('2024-01-01'),
    authorId: 'author1',
    workshopId: null,
  },
  {
    id: '2',
    title: 'Test Poem 2',
    content: 'Content 2',
    author: {
      name: 'Test Author',
      image: 'https://example.com/avatar.jpg',
    },
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    published: true,
    publishedAt: new Date('2024-01-02'),
    authorId: 'author1',
    workshopId: null,
  },
];

const mockMoods = [
  {
    id: '1',
    userId: 'user1',
    mood: 'HAPPY',
    notes: 'Great day!',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    userId: 'user1',
    mood: 'SAD',
    notes: 'Feeling down',
    createdAt: new Date('2024-01-02'),
  },
];

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render dashboard for authenticated user', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.poem.findMany as jest.Mock).mockResolvedValue(mockPoems);
    (prisma.mood.findMany as jest.Mock).mockResolvedValue(mockMoods);

    const { container } = render(await Dashboard());

    // Check if welcome message is rendered
    expect(screen.getByText(`Welcome back, ${mockSession.user.name}!`)).toBeInTheDocument();

    // Check if poems section is rendered
    expect(screen.getByText('Recent Poems')).toBeInTheDocument();
    expect(screen.getByText('Test Poem 1')).toBeInTheDocument();
    expect(screen.getByText('Test Poem 2')).toBeInTheDocument();

    // Check if mood history section is rendered
    expect(screen.getByText('Mood History')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="mood-chart"]')).toBeInTheDocument();

    // Check if action buttons are rendered
    expect(screen.getByText('Write New Poem')).toBeInTheDocument();
    expect(screen.getByText('View Full History')).toBeInTheDocument();
  });

  it('should show sign-in prompt for unauthenticated user', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    render(await Dashboard());

    // Check if sign-in prompt is rendered
    expect(screen.getByText('Please sign in to view your dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('should handle empty poems list', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.poem.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.mood.findMany as jest.Mock).mockResolvedValue(mockMoods);

    render(await Dashboard());

    // Check if empty state message is rendered
    expect(screen.getByText('No poems yet')).toBeInTheDocument();
    expect(screen.getByText('Write your first poem')).toBeInTheDocument();
  });

  it('should handle empty moods list', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.poem.findMany as jest.Mock).mockResolvedValue(mockPoems);
    (prisma.mood.findMany as jest.Mock).mockResolvedValue([]);

    render(await Dashboard());

    // Check if empty state message is rendered
    expect(screen.getByText('No mood data available')).toBeInTheDocument();
  });

  it('should handle database errors gracefully', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.poem.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
    (prisma.mood.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    render(await Dashboard());

    // Check if error message is rendered
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });
}); 