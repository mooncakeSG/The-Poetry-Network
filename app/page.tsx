"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { PoemCard } from "@/components/poem-card"

interface Poem {
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

export default function HomePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [poems, setPoems] = useState<Poem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sort, setSort] = useState("latest")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    fetchPoems(true)
  }, [sort])

  async function fetchPoems(reset = false) {
    const pageToFetch = reset ? 1 : page
    if (reset) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const response = await fetch(
        `/api/feed?page=${pageToFetch}&limit=10&sort=${sort}`
      )
      if (!response.ok) throw new Error("Failed to fetch poems")
      const data = await response.json()

      setPoems((prev) => (reset ? data.poems : [...prev, ...data.poems]))
      setHasMore(data.hasMore)
      if (!reset) setPage((p) => p + 1)
    } catch (error) {
      console.error("Error fetching poems:", error)
      toast({
        title: "Error",
        description: "Failed to load poems",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Feed</h1>
          <Select
            value={sort}
            onValueChange={(value) => setSort(value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {session && (
          <Button asChild>
            <Link href="/write">
              <Plus className="mr-2 h-4 w-4" />
              Write Poem
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[300px]" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          ))
        ) : poems.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold">No poems yet</h2>
            <p className="mt-2 text-muted-foreground">
              Be the first to share your poetry with the world!
            </p>
            {session ? (
              <Button asChild className="mt-4">
                <Link href="/write">Write a Poem</Link>
              </Button>
            ) : (
              <Button asChild className="mt-4">
                <Link href="/signin">Sign in to Write</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            {poems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}

            {isLoadingMore && (
              <div className="flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}

            {!isLoadingMore && hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => fetchPoems()}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

