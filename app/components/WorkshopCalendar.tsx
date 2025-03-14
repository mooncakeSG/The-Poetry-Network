"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

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

interface DayProps {
  date: Date
  selected?: boolean
  today?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

interface WorkshopCalendarProps {
  workshops: Workshop[]
  onSchedule?: (workshop: Omit<Workshop, "id" | "host" | "_count">) => Promise<void>
  currentMonth?: Date
}

const WORKSHOP_TYPES = [
  "Poetry Writing",
  "Poetry Reading",
  "Poetry Critique",
  "Form Study",
  "Theme Exploration",
  "Collaborative Writing",
] as const

export function WorkshopCalendar({ workshops, onSchedule, currentMonth = new Date() }: WorkshopCalendarProps) {
  const [date, setDate] = useState<Date>()
  const [month, setMonth] = useState<Date>(currentMonth)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [newWorkshop, setNewWorkshop] = useState({
    title: "",
    description: "",
    startTime: "10:00",
    endTime: "11:00",
    maxParticipants: 10,
    type: WORKSHOP_TYPES[0].toLowerCase(),
  })
  const { toast } = useToast()

  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(monthStart)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const workshopsByDate = workshops.reduce((acc, workshop) => {
    const dateStr = format(new Date(workshop.date), "yyyy-MM-dd")
    if (!acc[dateStr]) acc[dateStr] = []
    acc[dateStr].push(workshop)
    return acc
  }, {} as Record<string, Workshop[]>)

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault()
    if (!date) return

    try {
      await onSchedule?.({
        ...newWorkshop,
        date,
      })
      setShowScheduleDialog(false)
      toast({
        title: "Success",
        description: "Workshop scheduled successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule workshop",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workshop Calendar</h2>
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogTrigger asChild>
            <Button>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Workshop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Workshop</DialogTitle>
              <DialogDescription>
                Fill in the details to schedule a new workshop.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSchedule} data-testid="schedule-form">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newWorkshop.title}
                    onChange={(e) =>
                      setNewWorkshop({ ...newWorkshop, title: e.target.value })
                    }
                    placeholder="Workshop title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newWorkshop.description}
                    onChange={(e) =>
                      setNewWorkshop({ ...newWorkshop, description: e.target.value })
                    }
                    placeholder="Workshop description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newWorkshop.type}
                    onValueChange={(value) =>
                      setNewWorkshop({ ...newWorkshop, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select workshop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKSHOP_TYPES.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={newWorkshop.startTime}
                      onChange={(e) =>
                        setNewWorkshop({ ...newWorkshop, startTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={newWorkshop.endTime}
                      onChange={(e) =>
                        setNewWorkshop({ ...newWorkshop, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-participants">Maximum Participants</Label>
                  <Input
                    id="max-participants"
                    type="number"
                    value={newWorkshop.maxParticipants}
                    onChange={(e) =>
                      setNewWorkshop({
                        ...newWorkshop,
                        maxParticipants: parseInt(e.target.value),
                      })
                    }
                    min={2}
                    max={100}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Schedule</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rdp p-3 rounded-md border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={month}
          onMonthChange={setMonth}
          className="w-full"
          components={{
            Day: ({ date, selected, today, onClick }: DayProps) => {
              const dateStr = format(date, "yyyy-MM-dd")
              const dayWorkshops = workshopsByDate[dateStr] || []
              return (
                <div className="relative">
                  <button
                    type="button"
                    className={cn(
                      "w-full h-full p-2 text-center rounded-md",
                      selected && "bg-primary text-primary-foreground",
                      !selected && today && "bg-accent text-accent-foreground",
                      !selected && !today && "hover:bg-accent",
                      dayWorkshops.length > 0 && "font-bold"
                    )}
                    onClick={onClick}
                  >
                    {format(date, "d")}
                    {dayWorkshops.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                      </div>
                    )}
                  </button>
                </div>
              )
            },
          }}
        />
      </div>
    </div>
  )
} 