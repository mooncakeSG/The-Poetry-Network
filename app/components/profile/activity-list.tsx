'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'

interface Activity {
  id: string
  type: 'poem' | 'draft' | 'workshop' | 'comment' | 'like' | 'follow'
  title: string
  description: string
  createdAt: string
  targetId: string
  targetType: string
}

interface ActivityListProps {
  userId: string
}

export function ActivityList({ userId }: ActivityListProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/activity`)
        if (response.ok) {
          const data = await response.json()
          setActivities(data)
        } else {
          toast.error('Failed to load activity')
        }
      } catch (error) {
        console.error('Error fetching activity:', error)
        toast.error('Failed to load activity')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId])

  if (loading) {
    return <div className="text-center">Loading activity...</div>
  }

  if (activities.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-gray-600">No activity yet</p>
      </div>
    )
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'poem':
        return '📝'
      case 'draft':
        return '📄'
      case 'workshop':
        return '👥'
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

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-6">
          <div className="flex items-start space-x-4">
            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{activity.title}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{activity.description}</p>
              <Link
                href={`/${activity.targetType}s/${activity.targetId}`}
                className="mt-4 inline-block text-sm text-blue-600 hover:underline"
              >
                View {activity.targetType}
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 