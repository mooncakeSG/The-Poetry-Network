'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

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

export function NotificationBadge() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications?limit=5')
        if (!response.ok) {
          throw new Error('Failed to fetch notifications')
        }
        const data = await response.json()
        setNotifications(data.notifications)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No notifications</div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-2 p-4 cursor-pointer"
                onClick={() => {
                  if (notification.poem) {
                    router.push(`/poems/${notification.poem.id}`)
                  } else if (notification.workshop) {
                    router.push(`/workshops/${notification.workshop.id}`)
                  } else if (notification.user) {
                    router.push(`/profile/${notification.user.id}`)
                  }
                }}
              >
                <div className="flex-1">
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
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              className="text-center p-2 cursor-pointer"
              onClick={() => router.push('/notifications')}
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 