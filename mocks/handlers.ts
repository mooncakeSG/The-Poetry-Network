import { rest } from 'msw'
import { mockPoems } from './mockData'
import { RestHandler } from 'msw'

export const handlers: RestHandler[] = [
  // Mock workshop endpoints
  rest.get('/api/workshops', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          title: 'Test Workshop',
          description: 'Test Description',
          date: new Date().toISOString(),
          startTime: '10:00',
          endTime: '11:00',
          maxParticipants: 10,
          type: 'Poetry Writing',
          host: {
            id: '1',
            name: 'Test Host',
            image: null,
          },
          _count: {
            participants: 0,
          },
        },
      ])
    )
  }),

  rest.post('/api/workshops', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '1',
        title: 'Poetry Writing Workshop',
        description: 'Learn to write poetry',
        date: new Date('2024-03-20'),
        startTime: '10:00',
        endTime: '11:00',
        maxParticipants: 10,
        type: 'Poetry Writing',
        hostId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    )
  }),

  // Mock poem endpoints
  rest.get('/api/poems/latest', (req, res, ctx) => {
    return res(ctx.json(mockPoems))
  }),

  rest.post('/api/poems', async (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '2',
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
      })
    )
  }),

  // Mock auth endpoints
  rest.post('/api/auth/session', (req, res, ctx) => {
    return res(ctx.json({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }))
  }),
] 