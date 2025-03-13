'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Draft {
  id: string
  title: string
  content: string
  status: 'draft' | 'review' | 'published'
  createdAt: string
  updatedAt: string
  tags: string[]
}

interface DraftsListProps {
  userId: string
}

export function DraftsList({ userId }: DraftsListProps) {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchDrafts()
  }, [userId, page])

  const fetchDrafts = async () => {
    try {
      const response = await fetch(
        `/api/users/${userId}/drafts?page=${page}&limit=10`
      )
      if (!response.ok) throw new Error('Failed to fetch drafts')
      const data = await response.json()
      setDrafts((prev) => [...prev, ...data.drafts])
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching drafts:', error)
      toast.error('Failed to load drafts')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Draft['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500'
      case 'review':
        return 'bg-yellow-500'
      case 'published':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
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

  if (drafts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No drafts found
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {drafts.map((draft) => (
        <Card key={draft.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{draft.title}</CardTitle>
            <Badge className={getStatusColor(draft.status)}>
              {draft.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{draft.content}</p>
            {draft.tags.length > 0 && (
              <div className="flex gap-2 mt-4">
                {draft.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span>Created: {new Date(draft.createdAt).toLocaleDateString()}</span>
              <span>
                Updated: {new Date(draft.updatedAt).toLocaleDateString()}
              </span>
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