import { NextRequest } from "next/server"
import { GET } from "@/app/api/poems/latest/route"
import { prisma } from "@/lib/prisma"

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    poem: {
      findMany: jest.fn(),
    },
  },
}))

describe("GET /api/poems/latest", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns latest poems successfully", async () => {
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

    // Call the handler
    const response = await GET()
    const data = await response.json()

    // Verify the response
    expect(response.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(data[0]).toHaveProperty("id", "1")
    expect(data[0]).toHaveProperty("title", "Test Poem 1")
    expect(data[0]).toHaveProperty("author")
    expect(data[0]).toHaveProperty("_count")

    // Verify prisma was called correctly
    expect(prisma.poem.findMany).toHaveBeenCalledWith({
      take: 9,
      orderBy: {
        createdAt: "desc",
      },
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

    // Call the handler
    const response = await GET()

    // Verify the response
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toHaveProperty("error", "Failed to fetch latest poems")
  })
}) 