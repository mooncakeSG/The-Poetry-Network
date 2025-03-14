"use client"

import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Poem {
  id: number
  title: string
  excerpt: string
  likes: number
  comments: number
  publishedAt: string
}

interface PoemsListProps {
  userId: string
}

// Mock data - replace with actual data from your backend
const poems: Poem[] = [
  {
    id: 1,
    title: "Whispers in the Wind",
    excerpt: "Through rustling leaves and gentle breeze...",
    likes: 45,
    comments: 12,
    publishedAt: "2024-03-15",
  },
  {
    id: 2,
    title: "Morning Light",
    excerpt: "Dawn breaks with golden rays...",
    likes: 32,
    comments: 8,
    publishedAt: "2024-03-10",
  },
]

export function PoemsList({ userId }: PoemsListProps) {
  return (
    <div className="space-y-6">
      {poems.map((poem) => (
        <Card key={poem.id} className="p-6">
          <h3 className="text-xl font-semibold mb-2">{poem.title}</h3>
          <p className="text-muted-foreground mb-4">{poem.excerpt}</p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Heart className="h-4 w-4 mr-2" />
              {poem.likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageCircle className="h-4 w-4 mr-2" />
              {poem.comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <span className="ml-auto text-sm text-muted-foreground">
              {new Date(poem.publishedAt).toLocaleDateString()}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
} 