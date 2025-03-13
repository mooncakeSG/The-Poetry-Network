"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ShareButton } from "@/components/share-button"

interface PoemCardProps {
  poem: {
    id: string
    title: string
    content: string
    createdAt: string
    userLiked: boolean
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
}

export function PoemCard({ poem }: PoemCardProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(poem.userLiked)
  const [likesCount, setLikesCount] = useState(poem._count.likes)

  // Get first 3 stanzas or 300 characters, whichever comes first
  const preview = poem.content
    .split("\n\n")
    .slice(0, 3)
    .join("\n\n")
    .slice(0, 300)
  const hasMore = poem.content.length > preview.length

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault() // Prevent navigation to poem page
    
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like poems",
      })
      return
    }

    try {
      const response = await fetch(`/api/poems/${poem.id}/like`, {
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

  return (
    <Link
      href={`/poems/${poem.id}`}
      className="block rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
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
                onClick={(e) => e.stopPropagation()}
              >
                {poem.author.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(poem.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold">{poem.title}</h2>
          <div className="mt-2 whitespace-pre-line">
            {preview}
            {hasMore && (
              <span className="text-muted-foreground">... Read more</span>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="space-x-2"
              onClick={handleLike}
            >
              <Heart
                className={`h-5 w-5 ${
                  isLiked ? "fill-current text-red-500" : ""
                }`}
              />
              <span>{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="space-x-2"
              asChild
            >
              <Link
                href={`/poems/${poem.id}#comments`}
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="h-5 w-5" />
                <span>{poem._count.comments}</span>
              </Link>
            </Button>
          </div>
          <ShareButton poemId={poem.id} title={poem.title} />
        </div>
      </div>
    </Link>
  )
} 