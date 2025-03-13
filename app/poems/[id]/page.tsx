import Link from "next/link"
import { ArrowLeft, BookmarkPlus, Heart, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default function PoemPage({ params }) {
  // In a real app, you would fetch the poem data based on the ID
  const poem = poems.find((p) => p.id === params.id) || poems[0]

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/explore">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {/* Poem Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{poem.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={poem.authorAvatar || "/placeholder.svg"}
                alt={poem.author}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{poem.author}</p>
                <p className="text-sm text-muted-foreground">{poem.date}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Follow
            </Button>
          </div>
        </div>

        {/* Poem Content */}
        <div className="prose prose-lg max-w-none">
          {poem.content.split("\n\n").map((stanza, index) => (
            <p key={index} className="whitespace-pre-line">
              {stanza}
            </p>
          ))}
        </div>

        {/* Poem Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="sm">
            <Heart className="mr-2 h-4 w-4" />
            Like ({poem.likes})
          </Button>
          <Button variant="outline" size="sm">
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <Separator />

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Comments ({poem.comments.length})</h2>

          {/* Comment Form */}
          <div className="space-y-4">
            <Textarea placeholder="Share your thoughts on this poem..." />
            <Button>Post Comment</Button>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-6">
            {poem.comments.map((comment, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src={comment.avatar || "/placeholder.svg"}
                    alt={comment.author}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">{comment.date}</p>
                  </div>
                </div>
                <p className="text-sm">{comment.text}</p>
                <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    <Heart className="h-3.5 w-3.5" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="hover:text-foreground">Reply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data
const poems = [
  {
    id: "1",
    title: "Whispers of Dawn",
    author: "Elena Rivera",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "March 12, 2025",
    content:
      "Morning light filters through leaves,\nDew-kissed petals unfold their secrets,\nAs the world awakens to possibility,\nI find myself renewed.\n\nBirds call to one another,\nTheir songs a reminder of connection,\nIn this quiet moment before the day begins,\nI breathe in peace.\n\nThe sky shifts from lavender to gold,\nA canvas painted anew each morning,\nPromising that even after darkness,\nLight always returns.\n\nI carry this dawn within me,\nA small flame to guide my way,\nThrough whatever shadows may come,\nI remember the light.",
    likes: 124,
    comments: [
      {
        author: "Michael Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        date: "March 12, 2025",
        text: "The imagery in this poem is absolutely stunning. I can almost feel the morning dew and hear the birdsong.",
        likes: 8,
      },
      {
        author: "Aisha Patel",
        avatar: "/placeholder.svg?height=32&width=32",
        date: "March 12, 2025",
        text: "I love how you've captured that fleeting moment when the world is just waking up. Beautiful work!",
        likes: 5,
      },
      {
        author: "Thomas Wright",
        avatar: "/placeholder.svg?height=32&width=32",
        date: "March 11, 2025",
        text: "The last stanza really resonates with me. Carrying that dawn within us as a guiding light - what a powerful metaphor.",
        likes: 12,
      },
    ],
  },
]

