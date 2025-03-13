'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Activity {
  id: string
  type: 'poem' | 'draft' | 'comment' | 'like' | 'follow'
  title: string
  description: string
  createdAt: string
  metadata: {
    poemId?: string
    draftId?: string
    userId?: string
    userName?: string
  }
}

interface ActivityListProps {
  userId: string
}

export function ActivityList({ userId }: ActivityListProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [userId, page])

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        `/api/users/${userId}/activity?page=${page}&limit=10`
      )
      if (!response.ok) throw new Error('Failed to fetch activity')
      const data = await response.json()
      setActivities((prev) => [...prev, ...data.activities])
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching activity:', error)
      toast.error('Failed to load activity')
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'poem':
        return '📝'
      case 'draft':
        return '📄'
      case 'comment':
        return '💬'
      case 'like':
        return '❤️'
      case 'follow':
        return '👤'
      default:
        return '📌'
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'poem':
        return 'bg-blue-500'
      case 'draft':
        return 'bg-yellow-500'
      case 'comment':
        return 'bg-green-500'
      case 'like':
        return 'bg-red-500'
      case 'follow':
        return 'bg-purple-500'
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

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No activity found
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getActivityIcon(activity.type)}</span>
              <CardTitle>{activity.title}</CardTitle>
            </div>
            <Badge className={getActivityColor(activity.type)}>
              {activity.type}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{activity.description}</p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span>
                {new Date(activity.createdAt).toLocaleDateString()}
              </span>
              {activity.metadata.userName && (
                <span>by {activity.metadata.userName}</span>
              )}
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