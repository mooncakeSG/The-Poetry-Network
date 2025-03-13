'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2 } from 'lucide-react'

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: string
  user: {
    id: string
    name: string
    image: string | null
  }
  poem?: {
    id: string
    title: string
  }
  workshop?: {
    id: string
    name: string
  }
}

interface NotificationsResponse {
  notifications: Notification[]
  total: number
  page: number
  totalPages: number
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<NotificationsResponse | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!session?.user) {
      router.push('/login')
      return
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/notifications?page=${page}`)
        if (!response.ok) {
          throw new Error('Failed to fetch notifications')
        }
        const data = await response.json()
        setNotifications(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [session, router, page])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete notification')
      }
      setNotifications((prev) => {
        if (!prev) return null
        return {
          ...prev,
          notifications: prev.notifications.filter((n) => n.id !== id),
          total: prev.total - 1,
        }
      })
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : notifications?.notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <>
          <div className="space-y-4">
            {notifications?.notifications.map((notification) => (
              <Card key={notification.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={notification.user.image || undefined} />
                      <AvatarFallback>
                        {notification.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">{notification.user.name}</span>{' '}
                        {notification.message}
                        {notification.poem && (
                          <span className="font-medium text-primary">
                            {' '}
                            "{notification.poem.title}"
                          </span>
                        )}
                        {notification.workshop && (
                          <span className="font-medium text-primary">
                            {' '}
                            "{notification.workshop.name}"
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {notifications && notifications.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="py-2 px-4">
                Page {page} of {notifications.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setPage((p) => Math.min(notifications.totalPages, p + 1))
                }
                disabled={page === notifications.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
} 