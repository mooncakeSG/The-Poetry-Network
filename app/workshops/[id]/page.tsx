'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface Workshop {
  id: string
  title: string
  description: string
  isPrivate: boolean
  maxMembers: number
  createdAt: string
  creator: {
    id: string
    name: string | null
    image: string | null
  }
  members: {
    id: string
    name: string | null
    image: string | null
  }[]
  poems: {
    id: string
    title: string
    content: string
    createdAt: string
    author: {
      id: string
      name: string | null
      image: string | null
    }
    _count: {
      likes: number
      comments: number
    }
    isLiked: boolean
  }[]
  _count: {
    members: number
    poems: number
  }
  isMember: boolean
}

export default function WorkshopPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const params = useParams()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    fetchWorkshop()
  }, [params.id])

  const fetchWorkshop = async () => {
    try {
      const response = await fetch(`/api/workshops/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch workshop')
      const data = await response.json()
      setWorkshop(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load workshop',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPoem = async () => {
    if (!title || !content) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/workshops/${params.id}/poems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      })

      if (!response.ok) throw new Error('Failed to submit poem')

      const newPoem = await response.json()
      setWorkshop(prev => prev ? {
        ...prev,
        poems: [newPoem, ...prev.poems],
        _count: { ...prev._count, poems: prev._count.poems + 1 }
      } : null)
      setTitle('')
      setContent('')
      setTags('')

      toast({
        title: 'Success',
        description: 'Poem submitted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit poem',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikePoem = async (poemId: string) => {
    try {
      const response = await fetch(`/api/poems/${poemId}/like`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to like poem')

      const updatedPoem = await response.json()
      setWorkshop(prev => prev ? {
        ...prev,
        poems: prev.poems.map(p => 
          p.id === poemId ? { ...p, isLiked: !p.isLiked, _count: { ...p._count, likes: p.isLiked ? p._count.likes - 1 : p._count.likes + 1 } } : p
        )
      } : null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to like poem',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!workshop) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Workshop not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{workshop.title}</h1>
        <p className="text-gray-600 mb-4">{workshop.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Created by {workshop.creator.name || 'Anonymous'}</span>
          <span>•</span>
          <span>{workshop._count.members} members</span>
          <span>•</span>
          <span>{workshop._count.poems} poems</span>
        </div>
      </div>

      {session && workshop.isMember && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-8">Submit Poem</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit New Poem</DialogTitle>
              <DialogDescription>
                Share your poem with the workshop members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter poem title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your poem"
                  rows={10}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., nature, love, life"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmitPoem} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Poem'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="space-y-6">
        {workshop.poems.map((poem) => (
          <Card key={poem.id}>
            <CardHeader>
              <CardTitle>{poem.title}</CardTitle>
              <CardDescription>
                By {poem.author.name || 'Anonymous'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{poem.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{poem._count.likes} likes</span>
                <span>{poem._count.comments} comments</span>
              </div>
              {session && (
                <Button
                  variant={poem.isLiked ? 'destructive' : 'outline'}
                  onClick={() => handleLikePoem(poem.id)}
                >
                  {poem.isLiked ? 'Liked' : 'Like'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 