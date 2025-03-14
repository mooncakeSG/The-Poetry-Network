import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { LatestPoemsFeed } from '@/app/components/LatestPoemsFeed'

const mockPoems = [
  {
    id: '1',
    title: 'Test Poem',
    content: 'Test Content',
    createdAt: new Date().toISOString(),
    author: {
      id: '1',
      name: 'Test Author',
      image: null,
    },
    _count: {
      likes: 0,
      comments: 0,
    },
    userLiked: false,
  },
]

describe('LatestPoemsFeed', () => {
  it('renders loading state initially', () => {
    render(<LatestPoemsFeed />)
    expect(screen.getByTestId('loading-poems')).toBeInTheDocument()
  })

  it('renders poems after successful fetch', async () => {
    server.use(
      rest.get('/api/poems/latest', (req, res, ctx) => {
        return res(ctx.json(mockPoems))
      })
    )

    render(<LatestPoemsFeed />)
    expect(await screen.findByText('Test Poem')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })

  it('renders error message when fetch fails', async () => {
    server.use(
      rest.get('/api/poems/latest', (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )

    render(<LatestPoemsFeed />)
    expect(await screen.findByText(/error loading poems/i)).toBeInTheDocument()
  })

  it('renders empty state when no poems are available', async () => {
    server.use(
      rest.get('/api/poems/latest', (req, res, ctx) => {
        return res(ctx.json([]))
      })
    )

    render(<LatestPoemsFeed />)
    expect(await screen.findByText(/no poems available/i)).toBeInTheDocument()
  })
}) 