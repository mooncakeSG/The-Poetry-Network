'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { NotificationBadge } from '@/components/notification-badge'

export function Nav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Poetry Network
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/poems"
              className={`text-sm ${
                pathname === '/poems' ? 'text-primary' : 'text-gray-500'
              }`}
            >
              Poems
            </Link>
            <Link
              href="/workshops"
              className={`text-sm ${
                pathname === '/workshops' ? 'text-primary' : 'text-gray-500'
              }`}
            >
              Workshops
            </Link>
            <Link
              href="/search"
              className={`text-sm ${
                pathname === '/search' ? 'text-primary' : 'text-gray-500'
              }`}
            >
              Search
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBadge />
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
} 