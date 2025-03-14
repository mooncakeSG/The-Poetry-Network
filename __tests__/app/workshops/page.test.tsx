import { render, screen } from "@testing-library/react"
import WorkshopsPage from "@/app/workshops/page"
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
    },
  },
}))

describe("WorkshopsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders workshop list", async () => {
    const mockWorkshops = [
      {
        id: "1",
        title: "Poetry Writing Workshop",
        description: "Learn to write poetry",
        date: new Date(),
        startTime: "10:00",
        endTime: "11:00",
        maxParticipants: 10,
        type: "Poetry Writing",
        host: {
          id: "1",
          name: "Test Host",
          image: null,
        },
        _count: {
          participants: 0,
        },
      },
      {
        id: "2",
        title: "Creative Writing Workshop",
        description: "Explore creative writing",
        date: new Date(),
        startTime: "14:00",
        endTime: "15:00",
        maxParticipants: 15,
        type: "Creative Writing",
        host: {
          id: "2",
          name: "Another Host",
          image: null,
        },
        _count: {
          participants: 5,
        },
      },
    ]

    // Mock the prisma query
    ;(prisma.workshop.findMany as jest.Mock).mockResolvedValue(mockWorkshops)

    render(await WorkshopsPage())

    // Verify workshops are displayed
    expect(screen.getByText("Poetry Writing Workshop")).toBeInTheDocument()
    expect(screen.getByText("Creative Writing Workshop")).toBeInTheDocument()
    expect(screen.getByText("Test Host")).toBeInTheDocument()
    expect(screen.getByText("Another Host")).toBeInTheDocument()
  })

  it("displays empty state when no workshops", async () => {
    // Mock empty workshop list
    ;(prisma.workshop.findMany as jest.Mock).mockResolvedValue([])

    render(await WorkshopsPage())

    // Verify empty state message
    expect(screen.getByText(/no workshops available/i)).toBeInTheDocument()
  })

  it("displays schedule button when authenticated", async () => {
    const mockSession = {
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      },
    }

    // Mock the session
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

    // Mock empty workshop list
    ;(prisma.workshop.findMany as jest.Mock).mockResolvedValue([])

    render(await WorkshopsPage())

    // Verify schedule button is present
    expect(screen.getByRole("link", { name: /schedule workshop/i })).toBeInTheDocument()
  })

  it("hides schedule button when not authenticated", async () => {
    // Mock no session
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    // Mock empty workshop list
    ;(prisma.workshop.findMany as jest.Mock).mockResolvedValue([])

    render(await WorkshopsPage())

    // Verify schedule button is not present
    expect(screen.queryByRole("link", { name: /schedule workshop/i })).not.toBeInTheDocument()
  })

  it("displays workshop details", async () => {
    const mockWorkshop = {
      id: "1",
      title: "Poetry Writing Workshop",
      description: "Learn to write poetry",
      date: new Date("2024-03-20"),
      startTime: "10:00",
      endTime: "11:00",
      maxParticipants: 10,
      type: "Poetry Writing",
      host: {
        id: "1",
        name: "Test Host",
        image: null,
      },
      _count: {
        participants: 5,
      },
    }

    // Mock the prisma query
    ;(prisma.workshop.findMany as jest.Mock).mockResolvedValue([mockWorkshop])

    render(await WorkshopsPage())

    // Verify workshop details are displayed
    expect(screen.getByText("Poetry Writing Workshop")).toBeInTheDocument()
    expect(screen.getByText("Learn to write poetry")).toBeInTheDocument()
    expect(screen.getByText("Test Host")).toBeInTheDocument()
    expect(screen.getByText("5/10")).toBeInTheDocument()
    expect(screen.getByText("10:00 - 11:00")).toBeInTheDocument()
    expect(screen.getByText("Poetry Writing")).toBeInTheDocument()
  })

  it("verifies prisma query parameters", async () => {
    // Mock empty workshop list
    ;(prisma.workshop.findMany as jest.Mock).mockResolvedValue([])

    render(await WorkshopsPage())

    // Verify prisma query was called with correct parameters
    expect(prisma.workshop.findMany).toHaveBeenCalledWith({
      orderBy: {
        date: "asc",
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
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
}) 