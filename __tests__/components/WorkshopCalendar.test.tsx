import { render, screen, fireEvent } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { WorkshopCalendar } from '@/app/components/WorkshopCalendar'

interface Workshop {
  id: string
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  maxParticipants: number
  type: string
  host: {
    id: string
    name: string
    image: string | null
  }
  _count: {
    participants: number
  }
}

const mockWorkshops: Workshop[] = [
  {
    id: '1',
    title: 'Poetry Workshop',
    description: 'A workshop about poetry',
    date: new Date('2024-03-15'),
    startTime: '10:00',
    endTime: '11:00',
    maxParticipants: 10,
    type: 'poetry writing',
    host: {
      id: 'host1',
      name: 'Host Name',
      image: null,
    },
    _count: {
      participants: 5,
    },
  },
]

const testWorkshop = {
  id: '2',
  title: 'New Workshop',
  description: 'Test workshop',
  date: new Date('2024-03-21').toISOString(),
  startTime: '14:00',
  endTime: '15:00',
  maxParticipants: 15,
  type: 'Poetry Writing',
  host: {
    id: '1',
    name: 'Test Host',
    image: null,
  },
  _count: {
    participants: 0,
  },
}

describe('WorkshopCalendar', () => {
  it('renders the calendar', () => {
    render(<WorkshopCalendar workshops={mockWorkshops} currentMonth={new Date('2024-03-01')} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('displays workshop details after scheduling', async () => {
    const onScheduleMock = jest.fn()
    render(<WorkshopCalendar workshops={mockWorkshops} onSchedule={onScheduleMock} />)

    // Open schedule dialog
    fireEvent.click(screen.getByText('Schedule Workshop'))

    // Fill in workshop details
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Workshop' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Workshop description' },
    })
    fireEvent.change(screen.getByLabelText('Start Time'), {
      target: { value: '14:00' },
    })
    fireEvent.change(screen.getByLabelText('End Time'), {
      target: { value: '15:00' },
    })
    fireEvent.change(screen.getByLabelText('Maximum Participants'), {
      target: { value: '15' },
    })

    // Submit form
    fireEvent.submit(screen.getByTestId('schedule-form'))

    expect(onScheduleMock).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Workshop',
      description: 'Workshop description',
      startTime: '14:00',
      endTime: '15:00',
      maxParticipants: 15,
      type: 'poetry writing'
    }))
  })

  it('shows error toast when workshop creation fails', async () => {
    const onScheduleMock = jest.fn().mockRejectedValue(new Error('Failed to schedule'))
    render(<WorkshopCalendar workshops={mockWorkshops} onSchedule={onScheduleMock} />)

    // Open schedule dialog
    fireEvent.click(screen.getByText('Schedule Workshop'))

    // Fill in workshop details
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Workshop' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Workshop description' },
    })
    fireEvent.change(screen.getByLabelText('Start Time'), {
      target: { value: '14:00' },
    })
    fireEvent.change(screen.getByLabelText('End Time'), {
      target: { value: '15:00' },
    })
    fireEvent.change(screen.getByLabelText('Maximum Participants'), {
      target: { value: '15' },
    })

    // Submit form
    fireEvent.submit(screen.getByTestId('schedule-form'))

    // Verify error message is displayed
    expect(await screen.findByText(/failed to schedule workshop/i)).toBeInTheDocument()
  })

  it('allows scheduling a new workshop', async () => {
    const onScheduleMock = jest.fn()
    render(<WorkshopCalendar workshops={mockWorkshops} onSchedule={onScheduleMock} />)

    // Open schedule dialog
    fireEvent.click(screen.getByText('Schedule Workshop'))

    // Fill in workshop details
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Workshop' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Workshop description' },
    })
    fireEvent.change(screen.getByLabelText('Start Time'), {
      target: { value: '14:00' },
    })
    fireEvent.change(screen.getByLabelText('End Time'), {
      target: { value: '15:00' },
    })
    fireEvent.change(screen.getByLabelText('Maximum Participants'), {
      target: { value: '15' },
    })

    // Submit the form
    fireEvent.submit(screen.getByTestId('schedule-form'))

    expect(onScheduleMock).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Workshop',
      description: 'Workshop description',
      startTime: '14:00',
      endTime: '15:00',
      maxParticipants: 15,
      type: 'poetry writing'
    }))
  })
}) 