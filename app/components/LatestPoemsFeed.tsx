"use client"

import { useEffect, useState } from "react"
import { PoemCard } from "@/components/poem-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { type PoemCardData } from "@/types"

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
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPoems()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {poems.map((poem) => (
        <PoemCard key={poem.id} poem={poem} />
      ))}
    </div>
  )
} 