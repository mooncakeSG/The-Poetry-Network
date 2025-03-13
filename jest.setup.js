// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn().mockResolvedValue({
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
      }),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  },
}))

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn().mockResolvedValue({
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
    },
  }),
}))

// Mock fetch
global.fetch = jest.fn().mockImplementation((url, options) => {
  const method = options?.method || 'GET'
  const body = options?.body ? JSON.parse(options.body) : null

  if (method === 'DELETE') {
    return Promise.resolve({ status: 204 })
  }

  if (url.includes('/drafts')) {
    if (method === 'GET') {
      if (url.includes('/drafts/')) {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({
            id: url.split('/').pop(),
            title: body?.title || 'Test Draft',
            content: body?.content || 'Test content',
          }),
        })
      }
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve([]),
      })
    }
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({
        id: 'test-draft-id',
        ...body,
      }),
    })
  }

  if (url.includes('/poems')) {
    if (method === 'GET') {
      if (url.includes('/poems/')) {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({
            id: url.split('/').pop(),
            title: body?.title || 'Test Poem',
            content: body?.content || 'Test content',
          }),
        })
      }
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve([]),
      })
    }
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({
        id: 'test-poem-id',
        ...body,
      }),
    })
  }

  if (url.includes('/workshops')) {
    if (method === 'GET') {
      if (url.includes('/workshops/')) {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({
            id: url.split('/').pop(),
            title: body?.title || 'Test Workshop',
            description: body?.description || 'Test description',
          }),
        })
      }
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve([]),
      })
    }
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({
        id: 'test-workshop-id',
        ...body,
      }),
    })
  }

  return Promise.resolve({
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' }),
  })
}) 