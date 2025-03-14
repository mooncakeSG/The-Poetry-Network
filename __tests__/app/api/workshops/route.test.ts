import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/workshops/route"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

// Mock next-auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}))

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    workshop: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe("Workshops API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/workshops", () => {
    it("returns all workshops", async () => {
      const mockWorkshops = [
        {
          id: "1",
          title: "Poetry Writing Workshop",
          description: "Learn to write poetry",
          date: new Date(),
          startTime: "10:00",
          endTime: "11:00",
          maxParticipants: 10,
          currentParticipants: 0,
          type: "Poetry Writing",
          host: {
            id: "1",
            name: "Test Host",
            image: null,
          },
        },
      ]

      // Mock the prisma query
      ;(prisma.workshop.findMany as jest.Mock).mockResolvedValue(mockWorkshops)

      // Create request
      const request = new NextRequest(new URL("http://localhost:3000/api/workshops"))

      // Call the handler
      const response = await GET(request)
      const data = await response.json()

      // Verify the response
      expect(response.status).toBe(200)
      expect(data).toHaveLength(1)
      expect(data[0]).toHaveProperty("id", "1")
      expect(data[0]).toHaveProperty("title", "Poetry Writing Workshop")

      // Verify prisma was called correctly
      expect(prisma.workshop.findMany).toHaveBeenCalledWith({
        include: {
          host: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })
    })

    it("handles database errors gracefully", async () => {
      // Mock the prisma query to throw an error
      ;(prisma.workshop.findMany as jest.Mock).mockRejectedValue(new Error("Database error"))

      // Create request
      const request = new NextRequest(new URL("http://localhost:3000/api/workshops"))

      // Call the handler
      const response = await GET(request)

      // Verify the response
      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data).toHaveProperty("error", "Failed to fetch workshops")
    })
  })

  describe("POST /api/workshops", () => {
    it("creates a new workshop when authenticated", async () => {
      const mockSession = {
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
        },
      }

      const mockWorkshop = {
        id: "1",
        title: "New Workshop",
        description: "Workshop description",
        date: new Date().toISOString(),
        startTime: "10:00",
        endTime: "11:00",
        maxParticipants: 10,
        type: "Poetry Writing",
        host: {
          id: "1",
          name: "Test User",
          image: null,
        },
      }

      // Mock the session
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      // Mock the prisma create
      ;(prisma.workshop.create as jest.Mock).mockResolvedValue(mockWorkshop)

      // Create request with workshop data
      const request = new NextRequest(
        new URL("http://localhost:3000/api/workshops"),
        {
          method: "POST",
          body: JSON.stringify({
            title: "New Workshop",
            description: "Workshop description",
            date: new Date().toISOString(),
            startTime: "10:00",
            endTime: "11:00",
            maxParticipants: 10,
            type: "Poetry Writing",
          }),
        }
      )

      // Call the handler
      const response = await POST(request)
      const data = await response.json()

      // Verify the response
      expect(response.status).toBe(201)
      expect(data).toHaveProperty("id", "1")
      expect(data).toHaveProperty("title", "New Workshop")
      expect(data).toHaveProperty("host")

      // Verify prisma was called correctly
      expect(prisma.workshop.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: "New Workshop",
          hostId: "1",
        }),
        include: {
          host: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })
    })

    it("returns 401 when not authenticated", async () => {
      // Mock no session
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      // Create request with workshop data
      const request = new NextRequest(
        new URL("http://localhost:3000/api/workshops"),
        {
          method: "POST",
          body: JSON.stringify({
            title: "New Workshop",
          }),
        }
      )

      // Call the handler
      const response = await POST(request)

      // Verify the response
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty("error", "Not authenticated")
    })

    it("handles invalid request data", async () => {
      const mockSession = {
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
        },
      }

      // Mock the session
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      // Create request with invalid data
      const request = new NextRequest(
        new URL("http://localhost:3000/api/workshops"),
        {
          method: "POST",
          body: JSON.stringify({
            // Missing required fields
            title: "",
          }),
        }
      )

      // Call the handler
      const response = await POST(request)

      // Verify the response
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty("error")
    })

    it("handles database errors gracefully", async () => {
      const mockSession = {
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
        },
      }

      // Mock the session
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      // Mock the prisma create to throw an error
      ;(prisma.workshop.create as jest.Mock).mockRejectedValue(new Error("Database error"))

      // Create request with workshop data
      const request = new NextRequest(
        new URL("http://localhost:3000/api/workshops"),
        {
          method: "POST",
          body: JSON.stringify({
            title: "New Workshop",
            description: "Workshop description",
            date: new Date().toISOString(),
            startTime: "10:00",
            endTime: "11:00",
            maxParticipants: 10,
            type: "Poetry Writing",
          }),
        }
      )

      // Call the handler
      const response = await POST(request)

      // Verify the response
      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data).toHaveProperty("error", "Failed to create workshop")
    })
  })
}) 