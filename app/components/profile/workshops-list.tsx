'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

interface Workshop {
  id: string
  title: string
  description: string
  isPrivate: boolean
  maxMembers: number
  createdAt: string
  updatedAt: string
  _count: {
    members: number
    poems: number
  }
  role: string
}

interface WorkshopsListProps {
  userId: string
}

export function WorkshopsList({ userId }: WorkshopsListProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/workshops`)
        if (response.ok) {
          const data = await response.json()
          setWorkshops(data)
        } else {
          toast.error('Failed to load workshops')
        }
      } catch (error) {
        console.error('Error fetching workshops:', error)
        toast.error('Failed to load workshops')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshops()
  }, [userId])

  if (loading) {
    return <div className="text-center">Loading workshops...</div>
  }

  if (workshops.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-gray-600">No workshops yet</p>
        <Button asChild>
          <Link href="/workshops/create">Create a workshop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {workshops.map((workshop) => (
        <Card key={workshop.id} className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{workshop.title}</h3>
              <p className="text-sm text-gray-500">
                Created: {new Date(workshop.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="line-clamp-3">{workshop.description}</p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>👥 {workshop._count.members}/{workshop.maxMembers}</span>
                <span>📝 {workshop._count.poems}</span>
                <span className="capitalize">{workshop.role}</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/workshops/${workshop.id}`}>View workshop</Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 