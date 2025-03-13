"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

const submissionFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required").max(5000, "Content is too long"),
  notes: z.string().max(500, "Notes are too long").optional(),
})

type SubmissionFormValues = z.infer<typeof submissionFormSchema>

interface Workshop {
  id: string
  title: string
  hostId: string
}

export default function SubmitPage({ params }: { params: { workshopId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      title: "",
      content: "",
      notes: "",
    },
  })

  useEffect(() => {
    async function fetchWorkshopData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/workshops/${params.workshopId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch workshop")
        }

        const workshopData = await response.json()
        setWorkshop(workshopData)
      } catch (error) {
        console.error("Error fetching workshop data:", error)
        toast({
          title: "Error",
          description: "Failed to load workshop data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshopData()
  }, [params.workshopId, toast])

  async function onSubmit(data: SubmissionFormValues) {
    if (!session?.user?.id || !workshop) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workshops/${params.workshopId}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit poem")
      }

      toast({
        title: "Success",
        description: "Your poem has been submitted to the workshop.",
      })

      router.push(`/workshops/${params.workshopId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit poem. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to submit</h1>
        </div>
      </div>
    )
  }

  if (!workshop) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Workshop not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Submit a Poem</h1>
          <p className="text-muted-foreground">
            Share your work with the workshop members.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Submission</CardTitle>
            <CardDescription>
              Submit your poem to {workshop.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[300px] font-mono"
                        />
                      </FormControl>
                      <FormDescription>
                        Write or paste your poem here. Use line breaks to format your poem.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Add any context or specific feedback requests for your poem.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit Poem
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 