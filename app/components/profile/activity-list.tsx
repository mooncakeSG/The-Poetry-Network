'use client'

import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, PenSquare, Users } from "lucide-react"

interface Activity {
  id: number
  type: "like" | "comment" | "publish" | "follow"
  content: string
  timestamp: string
}

interface ActivityListProps {
  userId: string
}

// Mock data - replace with actual data from your backend
const activities: Activity[] = [
  {
    id: 1,
    type: "publish",
    content: "Published a new poem: 'Whispers in the Wind'",
    timestamp: "2024-03-18T14:30:00Z",
  },
  {
    id: 2,
    type: "like",
    content: "Liked 'Morning Light' by Sarah Chen",
    timestamp: "2024-03-18T12:15:00Z",
  },
  {
    id: 3,
    type: "comment",
    content: "Commented on 'The Journey' by Michael Rivera",
    timestamp: "2024-03-17T18:45:00Z",
  },
  {
    id: 4,
    type: "follow",
    content: "Started following Emily Johnson",
    timestamp: "2024-03-17T10:20:00Z",
  },
]

export function ActivityList({ userId }: ActivityListProps) {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4" />
      case "comment":
        return <MessageCircle className="h-4 w-4" />
      case "publish":
        return <PenSquare className="h-4 w-4" />
      case "follow":
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No recent activity</p>
        </Card>
      ) : (
        activities.map((activity) => (
          <Card key={activity.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{activity.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
} 