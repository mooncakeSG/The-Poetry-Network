import Link from "next/link"
import { Heart, MessageSquare, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Explore Poetry</h1>
        <p className="text-muted-foreground">Discover new poems and poets from around the world.</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search poems or poets..." className="w-full pl-9" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Tabs defaultValue="trending" className="mb-8">
        <TabsList>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="trending" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {poems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {poems
              .slice()
              .reverse()
              .map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="featured" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {poems
              .filter((poem) => poem.featured)
              .map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="following" className="mt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="mb-4 text-muted-foreground">Sign in to see poems from poets you follow</p>
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}

function PoemCard({ poem }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow transition-all hover:shadow-lg">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <img
            src={poem.authorAvatar || "/placeholder.svg"}
            alt={poem.author}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium">{poem.author}</span>
        </div>
        <h3 className="text-xl font-bold">{poem.title}</h3>
        <div className="prose prose-sm max-w-none">
          <p className="line-clamp-4 whitespace-pre-line">{poem.excerpt}</p>
        </div>
        <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{poem.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{poem.comments}</span>
          </div>
        </div>
      </div>
      <Link
        href={`/poems/${poem.id}`}
        className="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`Read ${poem.title}`}
      />
    </div>
  )
}

// Sample data
const poems = [
  {
    id: "1",
    title: "Whispers of Dawn",
    author: "Elena Rivera",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    excerpt:
      "Morning light filters through leaves,\nDew-kissed petals unfold their secrets,\nAs the world awakens to possibility,\nI find myself renewed.",
    likes: 124,
    comments: 18,
    featured: true,
  },
  {
    id: "2",
    title: "Urban Symphony",
    author: "Marcus Chen",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    excerpt:
      "Concrete canyons echo with footsteps,\nA thousand lives intersecting,\nIn this moment, this breath,\nWe are all connected.",
    likes: 89,
    comments: 12,
    featured: true,
  },
  {
    id: "3",
    title: "Ocean Memories",
    author: "Sophia Williams",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    excerpt:
      "Salt-tinged air carries memories,\nWaves crash against forgotten shores,\nTime erases footprints in sand,\nBut the heart remembers.",
    likes: 156,
    comments: 24,
    featured: true,
  },
  {
    id: "4",
    title: "Midnight Thoughts",
    author: "James Peterson",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    excerpt:
      "Stars punctuate the darkness,\nSilence wraps around my shoulders,\nThoughts drift like clouds,\nIn the vast night sky of my mind.",
    likes: 72,
    comments: 8,
    featured: false,
  },
  {
    id: "5",
    title: "Autumn Dance",
    author: "Olivia Martinez",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    excerpt:
      "Crimson and gold twirl in the breeze,\nNature's last waltz before sleep,\nI watch, mesmerized by the rhythm,\nOf endings that promise new beginnings.",
    likes: 103,
    comments: 15,
    featured: false,
  },
  {
    id: "6",
    title: "Fragments",
    author: "David Kim",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    excerpt:
      "Pieces of myself scattered,\nAcross time and memory,\nI gather what I can hold,\nAnd release what I cannot.",
    likes: 67,
    comments: 9,
    featured: false,
  },
]

