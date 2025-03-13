"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { PoemsList } from '@/components/profile/poems-list'
import { DraftsList } from '@/components/profile/drafts-list'
import { WorkshopsList } from '@/components/profile/workshops-list'
import { ActivityList } from '@/components/profile/activity-list'
import { Settings } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  bio: string | null
  location: string | null
  website: string | null
  socialLinks: {
    twitter?: string
    instagram?: string
    facebook?: string
    linkedin?: string
  } | null
  preferences: {
    emailNotifications: boolean
    publicProfile: boolean
    showLocation: boolean
  } | null
  createdAt: string
  updatedAt: string
  _count: {
    poems: number
    followers: number
    following: number
    workshops: number
  }
}

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}/profile`)
          if (response.ok) {
            const data = await response.json()
            setProfile(data)
          } else {
            toast.error('Failed to load profile')
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
          toast.error('Failed to load profile')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchProfile()
  }, [session?.user?.id])

  if (status === 'loading' || loading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex items-start space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.image || undefined} />
            <AvatarFallback>
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/profile/edit')}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/profile/privacy')}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Privacy</span>
                </Button>
              </div>
            </div>

            {profile.bio && (
              <p className="mt-4 text-gray-700">{profile.bio}</p>
            )}

            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
              {profile.location && profile.preferences?.showLocation && (
                <span>📍 {profile.location}</span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  🌐 Website
                </a>
              )}
            </div>

            {profile.socialLinks && (
              <div className="mt-4 flex space-x-4">
                {profile.socialLinks.twitter && (
                  <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500"
                  >
                    Twitter
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:text-pink-500"
                  >
                    Instagram
                  </a>
                )}
                {profile.socialLinks.facebook && (
                  <a
                    href={profile.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Facebook
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-800"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-around border-t border-b py-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile._count.poems}</div>
              <div className="text-gray-600">Poems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile._count.followers}</div>
              <div className="text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile._count.following}</div>
              <div className="text-gray-600">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile._count.workshops}</div>
              <div className="text-gray-600">Workshops</div>
            </div>
          </div>

          <Tabs defaultValue="poems" className="mt-8">
            <TabsList>
              <TabsTrigger value="poems">Poems</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="workshops">Workshops</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="poems">
              <PoemsList userId={profile.id} />
            </TabsContent>

            <TabsContent value="drafts">
              <DraftsList userId={profile.id} />
            </TabsContent>

            <TabsContent value="workshops">
              <WorkshopsList userId={profile.id} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityList userId={profile.id} />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}

