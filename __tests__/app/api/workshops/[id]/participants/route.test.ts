import { NextRequest } from 'next/server'
import { POST, DELETE } from '@/app/api/workshops/[id]/participants/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// Mock prisma
jest.mock('@/lib/prisma', () => ({
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

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
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

describe('Workshop Participants API', () => {
  const mockWorkshopId = '1'
  const mockUserId = '1'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/workshops/[id]/participants', () => {
    it('adds user to workshop when authenticated', async () => {
      // Mock authentication
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: mockUserId },
      })

      // Mock workshop exists and has space
      const mockWorkshop = {
        id: mockWorkshopId,
        maxParticipants: 10,
        _count: { participants: 5 },
      }
      ;(prisma.workshop.findUnique as jest.Mock).mockResolvedValue(mockWorkshop)

      // Mock workshop update
      const mockUpdatedWorkshop = {
        ...mockWorkshop,
        host: { id: '1', name: 'Test Host', image: null },
        participants: [{ id: mockUserId }],
      }
      ;(prisma.workshop.update as jest.Mock).mockResolvedValue(mockUpdatedWorkshop)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: 'POST',
        }
      )

      // Call handler
      const response = await POST(request, { params: { id: mockWorkshopId } })
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(200)
      expect(data).toEqual(mockUpdatedWorkshop)

      // Verify prisma calls
      expect(prisma.workshop.findUnique).toHaveBeenCalledWith({
        where: { id: mockWorkshopId },
        include: { _count: { select: { participants: true } } },
      })
      expect(prisma.workshop.update).toHaveBeenCalledWith({
        where: { id: mockWorkshopId },
        data: {
          participants: {
            connect: { id: mockUserId },
          },
        },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          participants: {
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
      })
    })

    it('returns 401 when not authenticated', async () => {
      // Mock no authentication
      (getServerSession as jest.Mock).mockResolvedValue(null)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: 'POST',
        }
      )

      // Call handler
      const response = await POST(request, { params: { id: mockWorkshopId } })

      // Verify response
      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ error: 'Authentication required' })
    })

    it('returns 404 when workshop not found', async () => {
      // Mock authentication
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: mockUserId },
      })

      // Mock workshop not found
      ;(prisma.workshop.findUnique as jest.Mock).mockResolvedValue(null)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: 'POST',
        }
      )

      // Call handler
      const response = await POST(request, { params: { id: mockWorkshopId } })

      // Verify response
      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ error: 'Workshop not found' })
    })

    it('returns 400 when workshop is full', async () => {
      // Mock authentication
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: mockUserId },
      })

      // Mock workshop is full
      const mockWorkshop = {
        id: mockWorkshopId,
        maxParticipants: 10,
        _count: { participants: 10 },
      }
      ;(prisma.workshop.findUnique as jest.Mock).mockResolvedValue(mockWorkshop)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: 'POST',
        }
      )

      // Call handler
      const response = await POST(request, { params: { id: mockWorkshopId } })

      // Verify response
      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Workshop is already full' })
    })
  })

  describe('DELETE /api/workshops/[id]/participants', () => {
    it('removes user from workshop when authenticated', async () => {
      // Mock authentication
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: mockUserId },
      })

      // Mock workshop exists
      const mockWorkshop = {
        id: mockWorkshopId,
        maxParticipants: 10,
        _count: { participants: 5 },
      }
      ;(prisma.workshop.findUnique as jest.Mock).mockResolvedValue(mockWorkshop)

      // Mock workshop update
      const mockUpdatedWorkshop = {
        ...mockWorkshop,
        host: { id: '1', name: 'Test Host', image: null },
        participants: [],
      }
      ;(prisma.workshop.update as jest.Mock).mockResolvedValue(mockUpdatedWorkshop)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: 'DELETE',
        }
      )

      // Call handler
      const response = await DELETE(request, { params: { id: mockWorkshopId } })
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(200)
      expect(data).toEqual(mockUpdatedWorkshop)

      // Verify prisma calls
      expect(prisma.workshop.findUnique).toHaveBeenCalledWith({
        where: { id: mockWorkshopId },
      })
      expect(prisma.workshop.update).toHaveBeenCalledWith({
        where: { id: mockWorkshopId },
        data: {
          participants: {
            disconnect: { id: mockUserId },
          },
        },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          participants: {
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
      })
    })

    it('returns 401 when not authenticated', async () => {
      // Mock no authentication
      (getServerSession as jest.Mock).mockResolvedValue(null)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: 'DELETE',
        }
      )

      // Call handler
      const response = await DELETE(request, { params: { id: mockWorkshopId } })

      // Verify response
      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ error: 'Authentication required' })
    })

    it('returns 404 when workshop not found', async () => {
      // Mock authentication
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: mockUserId },
      })

      // Mock workshop not found
      ;(prisma.workshop.findUnique as jest.Mock).mockResolvedValue(null)

      // Create request
      const request = new NextRequest(
        new URL(`http://localhost:3000/api/workshops/${mockWorkshopId}/participants`),
        {
          method: 'DELETE',
        }
      )

      // Call handler
      const response = await DELETE(request, { params: { id: mockWorkshopId } })

      // Verify response
      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ error: 'Workshop not found' })
    })
  })
}) 