'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface Poem {
  id: string
  title: string
  content: string
  createdAt: string
  _count: {
    likes: number
    comments: number
  }
}

interface PoemsListProps {
  userId: string
}

export function PoemsList({ userId }: PoemsListProps) {
  const [poems, setPoems] = useState<Poem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchPoems()
  }, [userId, page])

  const fetchPoems = async () => {
    try {
      const response = await fetch(
        `/api/users/${userId}/poems?page=${page}&limit=10`
      )
      if (!response.ok) throw new Error('Failed to fetch poems')
      const data = await response.json()
      setPoems((prev) => [...prev, ...data.poems])
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching poems:', error)
      toast.error('Failed to load poems')
    } finally {
      setLoading(false)
    }
  }

  if (loading && page === 1) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (poems.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No poems found
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {poems.map((poem) => (
        <Card key={poem.id}>
          <CardHeader>
            <CardTitle>{poem.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{poem.content}</p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span>{poem._count.likes} likes</span>
              <span>{poem._count.comments} comments</span>
            </div>
          </CardContent>
        </Card>
      ))}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
} 