"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { FollowButton } from '@/components/follow-button'

interface User {
  id: string
  name: string
  email: string
  image: string | null
  bio: string | null
  _count: {
    poems: number
    followers: number
    following: number
    workshops: number
  }
}

interface SearchResponse {
  users: User[]
  total: number
  page: number
  totalPages: number
}

export default function SearchPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)

  useEffect(() => {
    if (!session?.user) {
      router.push('/login')
      return
    }

    const fetchResults = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(query)}&page=${page}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }
        const data = await response.json()
        setSearchResults(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchResults()
    } else {
      setLoading(false)
    }
  }, [query, page, session, router])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get('q') as string
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Search Users</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <Input
            type="search"
            name="q"
            placeholder="Search by name, email, or bio..."
            defaultValue={query}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

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
      ) : searchResults ? (
        <>
          <div className="space-y-4">
            {searchResults.users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{user.name}</h2>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.bio && (
                        <p className="text-sm mt-1">{user.bio}</p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>{user._count.poems} poems</span>
                        <span>{user._count.followers} followers</span>
                        <span>{user._count.following} following</span>
                        <span>{user._count.workshops} workshops</span>
                      </div>
                    </div>
                  </div>
                  <FollowButton userId={user.id} />
                </div>
              </Card>
            ))}
          </div>

          {searchResults.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/search?q=${query}&page=${page - 1}`)
                }
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="py-2 px-4">
                Page {page} of {searchResults.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/search?q=${query}&page=${page + 1}`)
                }
                disabled={page === searchResults.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500">
          Enter a search query to find users
        </p>
      )}
    </div>
  )
} 