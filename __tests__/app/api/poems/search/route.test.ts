import { NextRequest } from "next/server"
import { GET } from "@/app/api/poems/search/route"
import { prisma } from "@/lib/prisma"

// Mock prisma
jest.mock("@/lib/prisma", () => ({
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
    NextRequest: jest.fn().mockImplementation((url) => ({
      url: url.toString(),
      nextUrl: url,
      cookies: new Map(),
      json: () => Promise.resolve({}),
    })),
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

describe("GET /api/poems/search", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns search results with query parameter", async () => {
    const mockPoems = [
      {
        id: "1",
        title: "Nature's Beauty",
        content: "A poem about nature",
        createdAt: new Date(),
        author: {
          id: "1",
          name: "Test Author",
          image: null,
        },
        _count: {
          likes: 5,
          comments: 3,
        },
      },
    ]

    // Mock the prisma query
    ;(prisma.poem.findMany as jest.Mock).mockResolvedValue(mockPoems)

    // Create a mock request with search query
    const url = new URL("http://localhost:3000/api/poems/search")
    url.searchParams.set("query", "nature")
    const request = new NextRequest(url)

    // Call the handler
    const response = await GET(request)
    const data = await response.json()

    // Verify the response
    expect(response.status).toBe(200)
    expect(data).toEqual(mockPoems)

    // Verify prisma was called with search parameters
    expect(prisma.poem.findMany).toHaveBeenCalledWith({
      where: {
        published: true,
        OR: [
          { title: { contains: "nature", mode: "insensitive" } },
          { content: { contains: "nature", mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    })
  })

  it("returns all poems when no query parameter", async () => {
    const mockPoems = [
      {
        id: "1",
        title: "Test Poem 1",
        content: "Test content 1",
        createdAt: new Date(),
        author: {
          id: "1",
          name: "Test Author",
          image: null,
        },
        _count: {
          likes: 5,
          comments: 3,
        },
      },
      {
        id: "2",
        title: "Test Poem 2",
        content: "Test content 2",
        createdAt: new Date(),
        author: {
          id: "2",
          name: "Another Author",
          image: null,
        },
        _count: {
          likes: 2,
          comments: 1,
        },
      },
    ]

    // Mock the prisma query
    ;(prisma.poem.findMany as jest.Mock).mockResolvedValue(mockPoems)

    // Create a mock request without search query
    const url = new URL("http://localhost:3000/api/poems/search")
    const request = new NextRequest(url)

    // Call the handler
    const response = await GET(request)
    const data = await response.json()

    // Verify the response
    expect(response.status).toBe(200)
    expect(data).toEqual(mockPoems)

    // Verify prisma was called without where clause
    expect(prisma.poem.findMany).toHaveBeenCalledWith({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    })
  })

  it("handles database errors gracefully", async () => {
    // Mock the prisma query to throw an error
    ;(prisma.poem.findMany as jest.Mock).mockRejectedValue(new Error("Database error"))

    // Create a mock request
    const url = new URL("http://localhost:3000/api/poems/search")
    url.searchParams.set("query", "test")
    const request = new NextRequest(url)

    // Call the handler
    const response = await GET(request)
    const data = await response.json()

    // Verify the response
    expect(response.status).toBe(500)
    expect(data).toEqual({ error: "Failed to search poems" })
  })
}) 