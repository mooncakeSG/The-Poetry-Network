'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  _count: {
    members: number
    poems: number
  }
  isMember: boolean
}

export default function WorkshopsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [maxMembers, setMaxMembers] = useState(20)

  useEffect(() => {
    fetchWorkshops()
  }, [])

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops')
      if (!response.ok) throw new Error('Failed to fetch workshops')
      const data = await response.json()
      setWorkshops(data.workshops)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load workshops',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkshop = async () => {
    if (!title || !description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          isPrivate,
          maxMembers,
        }),
      })

      if (!response.ok) throw new Error('Failed to create workshop')

      const newWorkshop = await response.json()
      setWorkshops([newWorkshop, ...workshops])
      setTitle('')
      setDescription('')
      setIsPrivate(false)
      setMaxMembers(20)

      toast({
        title: 'Success',
        description: 'Workshop created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create workshop',
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  const handleJoinWorkshop = async (workshopId: string) => {
    try {
      const response = await fetch(`/api/workshops/${workshopId}/members`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to join workshop')

      const updatedWorkshop = await response.json()
      setWorkshops(workshops.map(w => 
        w.id === workshopId ? { ...w, isMember: true, _count: { ...w._count, members: w._count.members + 1 } } : w
      ))

      toast({
        title: 'Success',
        description: 'Joined workshop successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join workshop',
        variant: 'destructive',
      })
    }
  }

  const handleLeaveWorkshop = async (workshopId: string) => {
    try {
      const response = await fetch(`/api/workshops/${workshopId}/members`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to leave workshop')

      const updatedWorkshop = await response.json()
      setWorkshops(workshops.map(w => 
        w.id === workshopId ? { ...w, isMember: false, _count: { ...w._count, members: w._count.members - 1 } } : w
      ))

      toast({
        title: 'Success',
        description: 'Left workshop successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to leave workshop',
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workshops</h1>
        {session && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Workshop</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workshop</DialogTitle>
                <DialogDescription>
                  Create a new workshop to collaborate with other poets.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter workshop title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter workshop description"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Members</label>
                  <Input
                    type="number"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                    min={2}
                    max={100}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  <label htmlFor="isPrivate" className="text-sm font-medium">
                    Private Workshop
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateWorkshop} disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Workshop'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop) => (
          <Card key={workshop.id}>
            <CardHeader>
              <CardTitle>{workshop.title}</CardTitle>
              <CardDescription>
                Created by {workshop.creator.name || 'Anonymous'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{workshop.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{workshop._count.members} members</span>
                <span>{workshop._count.poems} poems</span>
              </div>
            </CardContent>
            <CardFooter>
              {session && (
                <Button
                  variant={workshop.isMember ? 'destructive' : 'default'}
                  onClick={() => workshop.isMember ? handleLeaveWorkshop(workshop.id) : handleJoinWorkshop(workshop.id)}
                >
                  {workshop.isMember ? 'Leave Workshop' : 'Join Workshop'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

