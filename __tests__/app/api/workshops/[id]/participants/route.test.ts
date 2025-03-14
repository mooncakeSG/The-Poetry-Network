import { NextRequest } from "next/server"
import { POST, DELETE } from "@/app/api/workshops/[id]/participants/route"
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
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    workshopParticipant: {
      create: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}))

describe("Workshop Participants API", () => {
  const mockWorkshopId = "workshop-123"
  const mockUserId = "user-123"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/workshops/[id]/participants", () => {
    it("adds user to workshop when authenticated", async () => {
      const mockSession = {
        user: {
          id: mockUserId,
          name: "Test User",
          email: "test@example.com",
        },
      }

      // Mock the session
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      // Mock workshop exists and has space
      ;(prisma.workshop.findUnique as jest.Mock).mockResolvedValue({
        id: mockWorkshopId,
        maxParticipants: 10,
        _count: {
          participants: 5,
        },
      })

      // Mock participant creation
      ;(prisma.workshopParticipant.create as jest.Mock).mockResolvedValue({
        id: "1",
        userId: mockUserId,
        workshopId: mockWorkshopId,
        joinedAt: new Date(),
      })

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: "POST",
        }
      )

      // Call the handler with params
      const response = await POST(request, { params: { id: mockWorkshopId } })

      // Verify the response
      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data).toHaveProperty("id", "1")

      // Verify prisma was called correctly
      expect(prisma.workshopParticipant.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          workshopId: mockWorkshopId,
        },
      })
    })

    it("returns 401 when not authenticated", async () => {
      // Mock no session
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: "POST",
        }
      )

      // Call the handler with params
      const response = await POST(request, { params: { id: mockWorkshopId } })

      // Verify the response
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty("error", "Authentication required")
    })

    it("returns 404 when workshop not found", async () => {
      const mockSession = {
        user: {
          id: mockUserId,
          name: "Test User",
          email: "test@example.com",
        },
      }

      // Mock the session
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      // Mock workshop not found
      ;(prisma.workshop.findUnique as jest.Mock).mockResolvedValue(null)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: "POST",
        }
      )

      // Call the handler with params
      const response = await POST(request, { params: { id: mockWorkshopId } })

      // Verify the response
      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data).toHaveProperty("error", "Workshop not found")
    })

    it("returns 400 when workshop is full", async () => {
      const mockSession = {
        user: {
          id: mockUserId,
          name: "Test User",
          email: "test@example.com",
        },
      }

      // Mock the session
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      // Mock workshop is full
      ;(prisma.workshop.findUnique as jest.Mock).mockResolvedValue({
        id: mockWorkshopId,
        maxParticipants: 10,
        _count: {
          participants: 10,
        },
      })

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: "POST",
        }
      )

      // Call the handler with params
      const response = await POST(request, { params: { id: mockWorkshopId } })

      // Verify the response
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty("error", "Workshop is full")
    })
  })

  describe("DELETE /api/workshops/[id]/participants", () => {
    it("removes user from workshop when authenticated", async () => {
      const mockSession = {
        user: {
          id: mockUserId,
          name: "Test User",
          email: "test@example.com",
        },
      }

      // Mock the session
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      // Mock participant exists
      ;(prisma.workshopParticipant.findFirst as jest.Mock).mockResolvedValue({
        id: "1",
        userId: mockUserId,
        workshopId: mockWorkshopId,
      })

      // Mock participant deletion
      ;(prisma.workshopParticipant.delete as jest.Mock).mockResolvedValue({
        id: "1",
        userId: mockUserId,
        workshopId: mockWorkshopId,
      })

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: "DELETE",
        }
      )

      // Call the handler with params
      const response = await DELETE(request, { params: { id: mockWorkshopId } })

      // Verify the response
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty("id", "1")

      // Verify prisma was called correctly
      expect(prisma.workshopParticipant.delete).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
      })
    })

    it("returns 401 when not authenticated", async () => {
      // Mock no session
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: "DELETE",
        }
      )

      // Call the handler with params
      const response = await DELETE(request, { params: { id: mockWorkshopId } })

      // Verify the response
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty("error", "Authentication required")
    })

    it("returns 404 when participant not found", async () => {
      const mockSession = {
        user: {
          id: mockUserId,
          name: "Test User",
          email: "test@example.com",
        },
      }

      // Mock the session
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      // Mock participant not found
      ;(prisma.workshopParticipant.findFirst as jest.Mock).mockResolvedValue(null)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: "DELETE",
        }
      )

      // Call the handler with params
      const response = await DELETE(request, { params: { id: mockWorkshopId } })

      // Verify the response
      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data).toHaveProperty("error", "Not a participant of this workshop")
    })
  })
}) 