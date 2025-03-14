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
    const request = new NextRequest(
      new URL("http://localhost:3000/api/poems/search?query=nature")
    )

    // Call the handler
    const response = await GET(request)
    const data = await response.json()

    // Verify the response
    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0]).toHaveProperty("id", "1")
    expect(data[0]).toHaveProperty("title", "Nature's Beauty")

    // Verify prisma was called with search parameters
    expect(prisma.poem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { title: expect.objectContaining({ contains: "nature" }) },
            { content: expect.objectContaining({ contains: "nature" }) },
          ],
        }),
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      })
    )
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
    const request = new NextRequest(
      new URL("http://localhost:3000/api/poems/search")
    )

    // Call the handler
    const response = await GET(request)
    const data = await response.json()

    // Verify the response
    expect(response.status).toBe(200)
    expect(data).toHaveLength(2)

    // Verify prisma was called without where clause
    expect(prisma.poem.findMany).toHaveBeenCalledWith({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })
  })

  it("handles database errors gracefully", async () => {
    // Mock the prisma query to throw an error
    ;(prisma.poem.findMany as jest.Mock).mockRejectedValue(new Error("Database error"))

    // Create a mock request
    const request = new NextRequest(
      new URL("http://localhost:3000/api/poems/search?query=test")
    )

    // Call the handler
    const response = await GET(request)

    // Verify the response
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toHaveProperty("error", "Failed to search poems")
  })
}) 