"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Heart, MessageCircle, Share } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Comment } from "@/components/comment"
import { CommentForm } from "@/components/comment-form"
import { ShareButton } from "@/components/share-button"

interface Poem {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    image: string | null
  }
  _count: {
    likes: number
    comments: number
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

export default function PoemPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [poem, setPoem] = useState<Poem | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    async function fetchPoem() {
      try {
        const response = await fetch(`/api/poems/${params.poemId}`)
        if (!response.ok) throw new Error("Failed to fetch poem")
        const data = await response.json()
        setPoem(data)

        const likesResponse = await fetch(`/api/poems/${params.poemId}/like`)
        if (likesResponse.ok) {
          const { likesCount, userLiked } = await likesResponse.json()
          setLikesCount(likesCount)
          setIsLiked(userLiked)
        }
      } catch (error) {
        console.error("Error fetching poem:", error)
        toast({
          title: "Error",
          description: "Failed to load the poem",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPoem()
  }, [params.poemId, toast])

  useEffect(() => {
    fetchComments()
  }, [params.poemId])

  async function fetchComments(reset = false) {
    const pageToFetch = reset ? 1 : page
    setIsLoadingComments(true)

    try {
      const response = await fetch(
        `/api/poems/${params.poemId}/comments?page=${pageToFetch}&limit=10`
      )
      if (!response.ok) throw new Error("Failed to fetch comments")
      const data = await response.json()

      setComments((prev) =>
        reset ? data.comments : [...prev, ...data.comments]
      )
      setHasMore(data.hasMore)
      if (!reset) setPage((p) => p + 1)
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      })
    } finally {
      setIsLoadingComments(false)
    }
  }

  async function handleLike() {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like poems",
      })
      return
    }

    try {
      const response = await fetch(`/api/poems/${params.poemId}/like`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to like poem")

      const { liked } = await response.json()
      setIsLiked(liked)
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1))
    } catch (error) {
      console.error("Error liking poem:", error)
      toast({
        title: "Error",
        description: "Failed to like the poem",
        variant: "destructive",
      })
    }
  }

  function handleCommentAdded() {
    fetchComments(true)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-2/3 rounded bg-muted" />
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-4/6 rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (!poem) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Poem not found</h1>
        <p className="mt-2 text-muted-foreground">
          The poem you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Link>
      </Button>

      <article className="space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold md:text-4xl">{poem.title}</h1>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={poem.author.image || undefined} />
              <AvatarFallback>
                {poem.author.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/profile/${poem.author.id}`}
                className="font-medium hover:underline"
              >
                {poem.author.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {new Date(poem.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </header>

        <Separator />

        <div className="prose max-w-none dark:prose-invert">
          {poem.content.split("\n\n").map((stanza, index) => (
            <p key={index} className="whitespace-pre-line">
              {stanza}
            </p>
          ))}
        </div>

        <Separator />

        <footer className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="space-x-2"
              onClick={handleLike}
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? "fill-current text-red-500" : ""}`}
              />
              <span>{likesCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>{poem._count.comments}</span>
            </Button>
          </div>
          <ShareButton poemId={poem.id} title={poem.title} />
        </footer>
      </article>

      <div className="mt-12 space-y-8">
        <h2 className="text-2xl font-bold">Comments</h2>
        <CommentForm poemId={poem.id} onCommentAdded={handleCommentAdded} />

        <div className="space-y-6">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}

          {isLoadingComments && (
            <div className="flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!isLoadingComments && hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchComments()}
              >
                Load More Comments
              </Button>
            </div>
          )}

          {!isLoadingComments && comments.length === 0 && (
            <p className="text-center text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 