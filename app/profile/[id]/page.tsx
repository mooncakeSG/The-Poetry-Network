'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PoemsList } from '@/components/profile/poems-list'
import { DraftsList } from '@/components/profile/drafts-list'
import { WorkshopsList } from '@/components/profile/workshops-list'
import { ActivityList } from '@/components/profile/activity-list'
import { FollowButton } from '@/components/follow-button'
import { canViewProfile } from '@/lib/privacy'
import { toast } from 'sonner'

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [canView, setCanView] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchUser()
    }
  }, [session, params.id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      const data = await response.json()
      setUser(data)

      // Check if we can view the profile
      const canViewResult = await canViewProfile(params.id, session?.user?.id)
      setCanView(canViewResult)

      if (!canViewResult) {
        toast.error('This profile is private')
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user || !canView) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.bio}</p>
          <div className="flex gap-4 mt-2">
            <span>{user._count.poems} poems</span>
            <span>{user._count.followers} followers</span>
            <span>{user._count.following} following</span>
          </div>
        </div>
        {session?.user?.id !== params.id && (
          <FollowButton userId={params.id} />
        )}
      </div>

      <Tabs defaultValue="poems" className="space-y-4">
        <TabsList>
          <TabsTrigger value="poems">Poems</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="poems">
          <PoemsList userId={params.id} />
        </TabsContent>

        <TabsContent value="drafts">
          <DraftsList userId={params.id} />
        </TabsContent>

        <TabsContent value="workshops">
          <WorkshopsList userId={params.id} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityList userId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 