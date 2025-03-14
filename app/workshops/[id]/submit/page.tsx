"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Card } from '@/components/ui/card'
import { SubmissionForm } from '@/components/workshop/SubmissionForm'

interface Workshop {
  id: string
  title: string
  description: string
  isPrivate: boolean
  maxMembers: number
}

export default function SubmitPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await fetch(`/api/workshops/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch workshop')
        const data = await response.json()
        setWorkshop(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load workshop details',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchWorkshop()
  }, [params.id, toast])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!workshop) {
    return <div>Workshop not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Submit to {workshop.title}</h1>
      <Card className="p-6">
        <SubmissionForm id={params.id} />
      </Card>
    </div>
  )
} 