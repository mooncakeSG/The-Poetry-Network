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
  currentParticipants: number
  type: string
  host: {
    id: string
    name: string
    image: string | null
  }
}

interface WorkshopCalendarProps {
  workshops: Workshop[]
  onSchedule?: (workshop: Omit<Workshop, "id" | "currentParticipants" | "host">) => Promise<void>
}

const WORKSHOP_TYPES = [
  "Poetry Writing",
  "Poetry Reading",
  "Poetry Critique",
  "Form Study",
  "Theme Exploration",
  "Collaborative Writing",
] as const

export function WorkshopCalendar({ workshops, onSchedule }: WorkshopCalendarProps) {
  const [date, setDate] = useState<Date>()
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

  const monthStart = startOfMonth(date || new Date())
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
              <DialogTitle>Schedule a Workshop</DialogTitle>
              <DialogDescription>
                Fill in the details to schedule a new workshop.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newWorkshop.title}
                  onChange={(e) =>
                    setNewWorkshop((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newWorkshop.description}
                  onChange={(e) =>
                    setNewWorkshop((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newWorkshop.startTime}
                    onChange={(e) =>
                      setNewWorkshop((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newWorkshop.endTime}
                    onChange={(e) =>
                      setNewWorkshop((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  value={newWorkshop.maxParticipants}
                  onChange={(e) =>
                    setNewWorkshop((prev) => ({
                      ...prev,
                      maxParticipants: parseInt(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Workshop Type</Label>
                <Select
                  value={newWorkshop.type}
                  onValueChange={(value) =>
                    setNewWorkshop((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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

              <Button type="submit" className="w-full">
                Schedule Workshop
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        components={{
          Day: ({ date: dayDate, ...props }) => {
            const dateStr = format(dayDate, "yyyy-MM-dd")
            const dayWorkshops = workshopsByDate[dateStr] || []

            return (
              <div
                className={cn(
                  "relative h-14 w-14 p-0",
                  dayWorkshops.length > 0 &&
                    "bg-primary/5 font-medium text-primary"
                )}
                {...props}
              >
                <time dateTime={dateStr} className="absolute right-1 top-1">
                  {format(dayDate, "d")}
                </time>
                {dayWorkshops.length > 0 && (
                  <div className="absolute bottom-1 left-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}
              </div>
            )
          },
        }}
      />

      {date && workshopsByDate[format(date, "yyyy-MM-dd")]?.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="font-medium">
            Workshops on {format(date, "MMMM d, yyyy")}
          </h3>
          <div className="space-y-2">
            {workshopsByDate[format(date, "yyyy-MM-dd")].map((workshop) => (
              <div
                key={workshop.id}
                className="rounded-lg border p-4 hover:bg-accent"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{workshop.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {workshop.startTime} - {workshop.endTime}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {workshop.description}
                </p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>
                    {workshop.currentParticipants}/{workshop.maxParticipants}{" "}
                    participants
                  </span>
                  <span className="capitalize">{workshop.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 