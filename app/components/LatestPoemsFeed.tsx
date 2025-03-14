"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Poem {
  id: string
  title: string
  content: string
  author: {
    name: string
    image: string | null
  }
  likes: number
  comments: number
  isLiked: boolean
}

interface LatestPoemsFeedProps {
  type: "trending" | "latest"
}

const mockPoems: Poem[] = [
  {
    id: "1",
    title: "Autumn Leaves",
    content: "Crimson and gold dance in the breeze,\nNature's confetti in the autumn trees.\nWhispering secrets as they fall,\nPainting memories of summer's last call.",
    author: {
      name: "Michael Brown",
      image: null
    },
    likes: 156,
    comments: 23,
    isLiked: false
  },
  {
    id: "2",
    title: "City Lights",
    content: "Neon dreams in concrete streams,\nUrban stars that never sleep.\nFootsteps echo through the night,\nStories untold in electric light.",
    author: {
      name: "Lisa Chen",
      image: null
    },
    likes: 89,
    comments: 12,
    isLiked: false
  },
  {
    id: "3",
    title: "Ocean's Song",
    content: "Waves crash upon the ancient shore,\nTelling tales of what came before.\nSalt and spray and seabird's cry,\nNature's rhythm, low and high.",
    author: {
      name: "David Miller",
      image: null
    },
    likes: 234,
    comments: 45,
    isLiked: false
  }
]

export function LatestPoemsFeed({ type }: LatestPoemsFeedProps) {
  const [poems, setPoems] = useState(mockPoems)

  const handleLike = (id: string) => {
    setPoems((prev) =>
      prev.map((poem) =>
        poem.id === id
          ? {
              ...poem,
              likes: poem.isLiked ? poem.likes - 1 : poem.likes + 1,
              isLiked: !poem.isLiked,
            }
          : poem
      )
    )
  }

  return (
    <div className="space-y-4">
      {poems.map((poem) => (
        <Card key={poem.id}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src={poem.author.image || undefined} />
                <AvatarFallback>{poem.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{poem.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {type === "trending" ? "Trending" : "New"}
                </p>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{poem.title}</h3>
            <p className="whitespace-pre-line text-muted-foreground">
              {poem.content}
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(poem.id)}
                className={poem.isLiked ? "text-red-500" : ""}
              >
                <Heart className="mr-1 h-4 w-4" />
                {poem.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="mr-1 h-4 w-4" />
                {poem.comments}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 