'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Trash2, Save } from 'lucide-react'

interface Draft {
  id: string
  title: string
  content: string
  tags: string[]
  updatedAt: string
  workshopId: string | null
  workshop: {
    title: string
  } | null
}

export default function DraftsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    fetchDrafts()
  }, [])

  const fetchDrafts = async () => {
    try {
      const response = await fetch('/api/drafts')
      if (!response.ok) throw new Error('Failed to fetch drafts')
      const data = await response.json()
      setDrafts(data.drafts)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load drafts',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDraft = async () => {
    if (!title || !content) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      })

      if (!response.ok) throw new Error('Failed to create draft')

      const newDraft = await response.json()
      setDrafts([newDraft, ...drafts])
      setTitle('')
      setContent('')
      setTags('')

      toast({
        title: 'Success',
        description: 'Draft created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create draft',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateDraft = async () => {
    if (!editingDraft || !title || !content) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/drafts/${editingDraft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      })

      if (!response.ok) throw new Error('Failed to update draft')

      const updatedDraft = await response.json()
      setDrafts(drafts.map(d => d.id === editingDraft.id ? updatedDraft : d))
      setEditingDraft(null)
      setTitle('')
      setContent('')
      setTags('')

      toast({
        title: 'Success',
        description: 'Draft updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update draft',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteDraft = async (draftId: string) => {
    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete draft')

      setDrafts(drafts.filter(d => d.id !== draftId))
      toast({
        title: 'Success',
        description: 'Draft deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete draft',
        variant: 'destructive',
      })
    }
  }

  const handleEditDraft = (draft: Draft) => {
    setEditingDraft(draft)
    setTitle(draft.title)
    setContent(draft.content)
    setTags(draft.tags.join(', '))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Drafts</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Draft</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDraft ? 'Edit Draft' : 'Create New Draft'}
              </DialogTitle>
              <DialogDescription>
                {editingDraft
                  ? 'Edit your draft poem'
                  : 'Start writing a new poem'}
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
              <Button onClick={editingDraft ? handleUpdateDraft : handleCreateDraft} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingDraft ? 'Update Draft' : 'Create Draft'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.map((draft) => (
          <Card key={draft.id}>
            <CardHeader>
              <CardTitle>{draft.title}</CardTitle>
              <CardDescription>
                Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                {draft.workshop && (
                  <span className="block mt-1">
                    Workshop: {draft.workshop.title}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">{draft.content}</p>
              {draft.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {draft.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleEditDraft(draft)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteDraft(draft.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 