'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

interface Draft {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: { name: string }[]
  published: boolean
  publishedAt: string | null
}

interface DraftsListProps {
  userId: string
}

export function DraftsList({ userId }: DraftsListProps) {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/drafts`)
        if (response.ok) {
          const data = await response.json()
          setDrafts(data)
        } else {
          toast.error('Failed to load drafts')
        }
      } catch (error) {
        console.error('Error fetching drafts:', error)
        toast.error('Failed to load drafts')
      } finally {
        setLoading(false)
      }
    }

    fetchDrafts()
  }, [userId])

  if (loading) {
    return <div className="text-center">Loading drafts...</div>
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-gray-600">No drafts yet</p>
        <Button asChild>
          <Link href="/poems/new">Create a new draft</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {drafts.map((draft) => (
        <Card key={draft.id} className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{draft.title}</h3>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="line-clamp-4 whitespace-pre-line">{draft.content}</p>
            </div>

            {draft.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {draft.tags.map((tag) => (
                  <span
                    key={tag.name}
                    className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-gray-600">
                {draft.published ? 'Published' : 'Draft'}
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/drafts/${draft.id}`}>Continue editing</Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 