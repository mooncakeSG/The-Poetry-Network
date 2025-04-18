// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    poem: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    mood: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
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