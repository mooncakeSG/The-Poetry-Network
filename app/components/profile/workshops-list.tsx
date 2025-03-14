'use client'

import { Card } from "@/components/ui/card"
import { Calendar, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Workshop {
  id: number
  title: string
  description: string
  date: string
  time: string
  participants: number
  maxParticipants: number
}

interface WorkshopsListProps {
  userId: string
}

// Mock data - replace with actual data from your backend
const workshops: Workshop[] = [
  {
    id: 1,
    title: "Poetry for Healing",
    description: "A guided workshop on using poetry for emotional expression.",
    date: "2024-03-25",
    time: "7:00 PM EST",
    participants: 12,
    maxParticipants: 15,
  },
  {
    id: 2,
    title: "Mindful Writing",
    description: "Combine meditation and poetry in this unique workshop.",
    date: "2024-04-02",
    time: "7:00 PM EST",
    participants: 8,
    maxParticipants: 12,
  },
]

export function WorkshopsList({ userId }: WorkshopsListProps) {
  return (
    <div className="space-y-6">
      {workshops.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No workshops yet</p>
        </Card>
      ) : (
        workshops.map((workshop) => (
          <Card key={workshop.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {workshop.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(workshop.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {workshop.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {workshop.participants}/{workshop.maxParticipants} participants
                  </div>
                </div>
              </div>
              <Button className="md:self-start">View Details</Button>
            </div>
          </Card>
        ))
      )}
    </div>
  )
} 