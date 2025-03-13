'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface FollowButtonProps {
  userId: string
}

export function FollowButton({ userId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/follow`)
        if (!response.ok) {
          throw new Error('Failed to check follow status')
        }
        const data = await response.json()
        setIsFollowing(data.isFollowing)
      } catch (error) {
        console.error('Error checking follow status:', error)
      }
    }

    checkFollowStatus()
  }, [userId])

  const handleFollow = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to follow/unfollow user')
      }
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error('Error following/unfollowing user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      onClick={handleFollow}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        'Unfollow'
      ) : (
        'Follow'
      )}
    </Button>
  )
} 