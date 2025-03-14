import { NextRequest } from 'next/server'
import { GET } from '@/app/api/poems/latest/route'
import { prisma } from '@/lib/prisma'

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    poem: {
      findMany: jest.fn(),
    },
  },
}))

// Mock NextRequest and NextResponse
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server')
  return {
    ...actual,
    NextRequest: jest.fn().mockImplementation((input, init) => {
      const url = new URL(input)
      return {
        url: url.toString(),
        nextUrl: url,
        cookies: new Map(),
        json: () => Promise.resolve({}),
      }
    }),
    NextResponse: {
      json: (data: any, init?: ResponseInit) => {
        const response = new Response(JSON.stringify(data), init)
        Object.defineProperty(response, 'json', {
          value: async () => data,
        })
        return response
      },
    },
  }
})

describe('GET /api/poems/latest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns latest poems successfully', async () => {
    const mockPoems = [
      {
        id: '1',
        title: 'Test Poem 1',
        content: 'Test content 1',
        authorId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true,
      },
    ]

    ;(prisma.poem.findMany as jest.Mock).mockResolvedValue(mockPoems)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockPoems)

    expect(prisma.poem.findMany).toHaveBeenCalledWith({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
  })

  it('handles database errors gracefully', async () => {
    ;(prisma.poem.findMany as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Failed to fetch latest poems' })
  })
}) 