'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface Workshop {
  id: string
  title: string
  description: string
  isPrivate: boolean
  maxMembers: number
  creator: {
    id: string
    name: string | null
  }
  members: {
    id: string
    name: string | null
    image: string | null
    role: string
  }[]
}

export default function WorkshopSettingsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [maxMembers, setMaxMembers] = useState(20)

  useEffect(() => {
    fetchWorkshop()
  }, [params.id])

  const fetchWorkshop = async () => {
    try {
      const response = await fetch(`/api/workshops/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch workshop')
      const data = await response.json()
      setWorkshop(data)
      setTitle(data.title)
      setDescription(data.description)
      setIsPrivate(data.isPrivate)
      setMaxMembers(data.maxMembers)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load workshop settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!title || !description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/workshops/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          isPrivate,
          maxMembers,
        }),
      })

      if (!response.ok) throw new Error('Failed to update workshop')

      toast({
        title: 'Success',
        description: 'Workshop settings updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update workshop settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/workshops/${params.id}/members/${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove member')

      setWorkshop(prev => prev ? {
        ...prev,
        members: prev.members.filter(m => m.id !== memberId)
      } : null)

      toast({
        title: 'Success',
        description: 'Member removed successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove member',
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

  if (session?.user?.id !== workshop.creator.id) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-600">Only workshop creators can access settings.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Workshop Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Update your workshop's basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
              <label className="text-sm font-medium">
                Private Workshop
              </label>
            </div>
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Manage workshop members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workshop.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name || 'Member'}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{member.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  {member.id !== workshop.creator.id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 