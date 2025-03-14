"use client"

import { useEffect, useState } from "react"
import { PoemCard } from "@/components/poem-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { type PoemCardData } from "@/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface ApiPoemData {
  id: string
  title: string
  content: string
  createdAt: string
  userLiked: boolean
  author: {
    id: string
    name: string
    image: string | null
  }
  _count: {
    likes: number
    comments: number
  }
}

export function LatestPoemsFeed() {
  const [poems, setPoems] = useState<PoemCardData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLatestPoems() {
      try {
        const response = await fetch("/api/poems/latest")
        if (!response.ok) {
          throw new Error("Failed to fetch latest poems")
        }
        const data: ApiPoemData[] = await response.json()
        
        // Transform API data to match PoemCardData interface
        const transformedPoems: PoemCardData[] = data.map(poem => ({
          ...poem,
          excerpt: poem.content
            .split("\n\n")
            .slice(0, 3)
            .join("\n\n")
            .slice(0, 300),
          likes: poem._count.likes,
          comments: poem._count.comments,
          tags: []
        }))

        setPoems(transformedPoems)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load latest poems. Please try again later.",
          variant: "destructive",
        })
        setError("Failed to load latest poems. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPoems()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-4" data-testid="loading-poems">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-muted h-[200px] w-full rounded-lg"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Error loading poems. Please try again later.
      </div>
    )
  }

  if (!poems?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No poems available.
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {poems.map((poem) => (
        <div
          key={poem.id}
          className="block rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-shadow hover:shadow-lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={poem.author.image || undefined} />
                  <AvatarFallback>
                    {poem.author.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span
                    className="font-medium hover:underline"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(`/profile/${poem.author.id}`)
                    }}
                  >
                    {poem.author.name}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(poem.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{poem.type}</Badge>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => router.push(`/poems/${poem.id}`)}
            >
              <h3 className="font-semibold hover:underline">{poem.title}</h3>
              <p className="mt-2 text-muted-foreground line-clamp-3">
                {poem.content}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Heart className="mr-1 h-4 w-4" />
                {poem._count.likes} likes
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                {poem._count.comments} comments
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 