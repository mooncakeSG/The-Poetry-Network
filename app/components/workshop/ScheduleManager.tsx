import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

interface Event {
  id: string
  title: string
  description: string
  date: Date
  type: "meeting" | "deadline" | "feedback"
}

interface ScheduleManagerProps {
  workshopId: string
  events: Event[]
  onEventAdd: (event: Omit<Event, "id">) => void
  onEventDelete: (eventId: string) => void
}

export function ScheduleManager({
  workshopId,
  events,
  onEventAdd,
  onEventDelete,
}: ScheduleManagerProps) {
  const [date, setDate] = useState<Date>()
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "meeting" as const,
  })

  const handleAddEvent = () => {
    if (!date) return

    onEventAdd({
      title: newEvent.title,
      description: newEvent.description,
      date,
      type: newEvent.type,
    })

    setNewEvent({
      title: "",
      description: "",
      type: "meeting",
    })
    setShowAddEvent(false)
  }

  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-8">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Events</h3>
            <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
              <DialogTrigger asChild>
                <Button>Add Event</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event for the workshop schedule.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, description: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value: "meeting" | "deadline" | "feedback") =>
                        setNewEvent({ ...newEvent, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddEvent}
                    disabled={!date || !newEvent.title}
                  >
                    Add Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(event.date, "PPP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        event.type === "meeting"
                          ? "default"
                          : event.type === "deadline"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {event.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEventDelete(event.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {sortedEvents.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  No events scheduled
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
} 