"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Loader2, MessageSquare, MoreVertical, Pencil, Trash } from "lucide-react"
import PusherClient from "pusher-js"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
})

const commentFormSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
})

type CommentFormValues = z.infer<typeof commentFormSchema>

interface Workshop {
  id: string
  title: string
  hostId: string
}

interface Submission {
  id: string
  title: string
  content: string
  notes: string | null
  createdAt: string
  author: {
    id: string
    name: string
    image: string | null
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    image: string | null
  }
}

export default function SubmissionPage({
  params,
}: {
  params: { workshopId: string; submissionId: string }
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: "",
    },
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [workshopRes, submissionRes, commentsRes] = await Promise.all([
          fetch(`/api/workshops/${params.workshopId}`),
          fetch(`/api/workshops/${params.workshopId}/submissions/${params.submissionId}`),
          fetch(`/api/workshops/${params.workshopId}/submissions/${params.submissionId}/comments`),
        ])

        if (!workshopRes.ok || !submissionRes.ok || !commentsRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const [workshopData, submissionData, commentsData] = await Promise.all([
          workshopRes.json(),
          submissionRes.json(),
          commentsRes.json(),
        ])

        setWorkshop(workshopData)
        setSubmission(submissionData)
        setComments(commentsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load submission data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.workshopId, params.submissionId, toast])

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = pusher.subscribe(`submission-${params.submissionId}`)

    channel.bind("new-comment", (newComment: Comment) => {
      setComments((prev) => [newComment, ...prev])
    })

    channel.bind("update-comment", (updatedComment: Comment) => {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      )
    })

    channel.bind("delete-comment", ({ id }: { id: string }) => {
      setComments((prev) => prev.filter((comment) => comment.id !== id))
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(`submission-${params.submissionId}`)
    }
  }, [params.submissionId])

  async function onSubmit(data: CommentFormValues) {
    if (!session?.user?.id || !submission) return

    setIsSubmitting(true)
    try {
      const response = await fetch(
        `/api/workshops/${params.workshopId}/submissions/${params.submissionId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to post comment")
      }

      const newComment = await response.json()
      setComments((prev) => [newComment, ...prev])
      form.reset()

      toast({
        title: "Success",
        description: "Your comment has been posted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEditComment(commentId: string, data: CommentFormValues) {
    if (!session?.user?.id) return

    try {
      const response = await fetch(
        `/api/workshops/${params.workshopId}/submissions/${params.submissionId}/comments`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: commentId, ...data }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to edit comment")
      }

      const updatedComment = await response.json()
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      )
      setEditingComment(null)

      toast({
        title: "Success",
        description: "Your comment has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to edit comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!session?.user?.id) return

    try {
      const response = await fetch(
        `/api/workshops/${params.workshopId}/submissions/${params.submissionId}/comments?id=${commentId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
      setCommentToDelete(null)
      setDeleteDialogOpen(false)

      toast({
        title: "Success",
        description: "Comment deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to view submissions</h1>
        </div>
      </div>
    )
  }

  if (!workshop || !submission) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Submission not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/workshops/${params.workshopId}/submissions`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{submission.title}</h1>
            <p className="text-muted-foreground">
              Submitted to {workshop.title}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={submission.author.image || ""}
                    alt={submission.author.name}
                  />
                  <AvatarFallback>
                    {submission.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div>{submission.author.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(submission.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </CardDescription>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  {comments.length}
                </Badge>
                {submission.notes && (
                  <Badge variant="outline">Has Notes</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-line font-mono">{submission.content}</div>
              {submission.notes && (
                <>
                  <Separator className="my-4" />
                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="mb-2 font-semibold">Author's Notes</h3>
                    <p className="text-sm text-muted-foreground">{submission.notes}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Comments</h2>
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Share your thoughts..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Post Comment
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={comment.author.image || ""}
                            alt={comment.author.name}
                          />
                          <AvatarFallback>
                            {comment.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{comment.author.name}</span>
                          <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      {(comment.author.id === session?.user?.id ||
                        workshop.hostId === session?.user?.id) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {comment.author.id === session?.user?.id && (
                              <DropdownMenuItem
                                onClick={() => setEditingComment(comment.id)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setCommentToDelete(comment.id)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingComment === comment.id ? (
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit((data) =>
                            handleEditComment(comment.id, data)
                          )}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    defaultValue={comment.content}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              size="sm"
                            >
                              {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Save
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingComment(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <p className="whitespace-pre-line">{comment.content}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => commentToDelete && handleDeleteComment(commentToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 