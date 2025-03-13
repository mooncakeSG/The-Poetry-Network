"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommentProps {
  comment: {
    id: string
    content: string
    createdAt: string
    author: {
      id: string
      name: string
      image: string | null
    }
  }
}

export function Comment({ comment }: CommentProps) {
  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage src={comment.author.image || undefined} />
        <AvatarFallback>
          {comment.author.name?.charAt(0) || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${comment.author.id}`}
            className="font-medium hover:underline"
          >
            {comment.author.name}
          </Link>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  )
} 