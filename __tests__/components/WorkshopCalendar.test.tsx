import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { WorkshopCalendar } from "@/app/components/WorkshopCalendar"
import { server } from "@/mocks/server"
import { http, HttpResponse } from "msw"

interface Workshop {
  id: string
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  maxParticipants: number
  currentParticipants: number
  type: string
  host: {
    id: string
    name: string
    image: string | null
  }
}

const mockWorkshops: Workshop[] = [{
  id: "test-id",
  title: "Test Workshop",
  description: "Test Description",
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
}]

describe("WorkshopCalendar", () => {
  it("renders the calendar", () => {
    render(<WorkshopCalendar workshops={mockWorkshops} />)
    expect(screen.getByRole("grid")).toBeInTheDocument()
  })

  it("shows workshop dialog when clicking schedule button", () => {
    render(<WorkshopCalendar workshops={mockWorkshops} />)
    const scheduleButton = screen.getByText(/schedule workshop/i)
    fireEvent.click(scheduleButton)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("displays workshop details after scheduling", async () => {
    const testWorkshop = {
      id: "test-id",
      title: "Test Workshop",
      description: "Test Description",
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
    }

    server.use(
      http.post("/api/workshops", () => {
        return HttpResponse.json(testWorkshop, { status: 201 })
      })
    )

    render(<WorkshopCalendar workshops={mockWorkshops} />)
    
    // Open dialog
    fireEvent.click(screen.getByText(/schedule workshop/i))
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: testWorkshop.title },
    })
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: testWorkshop.description },
    })
    fireEvent.change(screen.getByLabelText(/start time/i), {
      target: { value: testWorkshop.startTime },
    })
    fireEvent.change(screen.getByLabelText(/end time/i), {
      target: { value: testWorkshop.endTime },
    })
    fireEvent.change(screen.getByLabelText(/max participants/i), {
      target: { value: testWorkshop.maxParticipants },
    })
    
    // Submit form
    fireEvent.click(screen.getByText(/create/i))

    // Verify workshop is displayed
    await waitFor(() => {
      expect(screen.getByText(testWorkshop.title)).toBeInTheDocument()
      expect(screen.getByText(testWorkshop.description)).toBeInTheDocument()
    })
  })

  it("shows error toast when workshop creation fails", async () => {
    server.use(
      http.post("/api/workshops", () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(<WorkshopCalendar workshops={mockWorkshops} />)
    
    // Open dialog
    fireEvent.click(screen.getByText(/schedule workshop/i))
    
    // Fill form with minimal data
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Workshop" },
    })
    
    // Submit form
    fireEvent.click(screen.getByText(/create/i))

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/failed to schedule workshop/i)).toBeInTheDocument()
    })
  })
}) 