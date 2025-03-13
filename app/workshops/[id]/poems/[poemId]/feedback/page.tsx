'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface Feedback {
  id: string
  content: string
  rating: number | null
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

interface Poem {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

export default function PoemFeedbackPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const params = useParams()
  const [poem, setPoem] = useState<Poem | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [content, setContent] = useState('')
  const [rating, setRating] = useState<number | null>(null)

  useEffect(() => {
    fetchPoemAndFeedback()
  }, [params.poemId])

  const fetchPoemAndFeedback = async () => {
    try {
      const [poemResponse, feedbackResponse] = await Promise.all([
        fetch(`/api/poems/${params.poemId}`),
        fetch(`/api/workshops/${params.id}/feedback?poemId=${params.poemId}`),
      ])

      if (!poemResponse.ok || !feedbackResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const [poemData, feedbackData] = await Promise.all([
        poemResponse.json(),
        feedbackResponse.json(),
      ])

      setPoem(poemData)
      setFeedback(feedbackData.feedback)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load poem and feedback',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (!content) {
      toast({
        title: 'Error',
        description: 'Please provide feedback content',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/workshops/${params.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poemId: params.poemId,
          content,
          rating,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit feedback')

      const newFeedback = await response.json()
      setFeedback([newFeedback, ...feedback])
      setContent('')
      setRating(null)

      toast({
        title: 'Success',
        description: 'Feedback submitted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!poem) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Poem not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{poem.title}</h1>
        <p className="text-gray-600 mb-4">By {poem.author.name || 'Anonymous'}</p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="whitespace-pre-wrap">{poem.content}</p>
        </div>
      </div>

      {session && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-8">Provide Feedback</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Provide Feedback</DialogTitle>
              <DialogDescription>
                Share your thoughts and suggestions about this poem.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Feedback</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts about the poem..."
                  rows={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Rating (optional)</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      variant={rating === value ? 'default' : 'outline'}
                      onClick={() => setRating(value)}
                      className="w-10 h-10 p-0"
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmitFeedback} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Feedback</h2>
        {feedback.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {item.author.name || 'Anonymous'}
                  </CardTitle>
                  <CardDescription>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                {item.rating && (
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 