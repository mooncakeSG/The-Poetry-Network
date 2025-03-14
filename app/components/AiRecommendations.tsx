"use client"

import { useState } from "react"
import { Heart, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Recommendation {
  id: string
  title: string
  excerpt: string
  author: string
  image: string
  likes: number
  isLiked: boolean
  isSaved: boolean
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "The Silent Echo",
    excerpt: "In the depths of night, where shadows dance...",
    author: "Emily Chen",
    image: "/images/poems/nature-1.jpg",
    likes: 124,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    title: "Whispers of Dawn",
    excerpt: "Morning light breaks through the mist...",
    author: "James Wilson",
    image: "/images/poems/dawn-1.jpg",
    likes: 89,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "3",
    title: "Urban Dreams",
    excerpt: "City lights flicker like stars below...",
    author: "Sarah Martinez",
    image: "/images/poems/city-1.jpg",
    likes: 156,
    isLiked: false,
    isSaved: false,
  },
]

export function AiRecommendations() {
  const [recommendations, setRecommendations] = useState(mockRecommendations)

  const handleLike = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? { ...rec, likes: rec.isLiked ? rec.likes - 1 : rec.likes + 1, isLiked: !rec.isLiked }
          : rec
      )
    )
  }

  const handleSave = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, isSaved: !rec.isSaved } : rec
      )
    )
  }

  const handleShare = (id: string) => {
    // Implement share functionality
    console.log("Sharing poem:", id)
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <Card key={rec.id} className="overflow-hidden">
          <div className="relative aspect-video">
            <img
              src={rec.image}
              alt={rec.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold">{rec.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{rec.excerpt}</p>
            <p className="mt-2 text-sm font-medium">By {rec.author}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(rec.id)}
                className={rec.isLiked ? "text-red-500" : ""}
              >
                <Heart className="mr-1 h-4 w-4" />
                {rec.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(rec.id)}
              >
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSave(rec.id)}
              className={rec.isSaved ? "text-primary" : ""}
            >
              <Bookmark className="mr-1 h-4 w-4" />
              {rec.isSaved ? "Saved" : "Save"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 