import Link from "next/link"
import { Heart, MessageSquare, Search } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type PoemCardData } from "@/types"

interface PoemCardProps {
  poem: PoemCardData
}

const poems: PoemCardData[] = [
  {
    id: "1",
    title: "The Road Not Taken",
    author: {
      id: "1",
      name: "Robert Frost",
      image: null
    },
    content: "Two roads diverged in a yellow wood...",
    excerpt: "Two roads diverged in a yellow wood...",
    createdAt: new Date().toISOString(),
    likes: 150,
    comments: 23,
    featured: true
  },
  {
    id: "2",
    title: "Still I Rise",
    author: {
      id: "2",
      name: "Maya Angelou",
      image: null
    },
    content: "You may write me down in history...",
    excerpt: "You may write me down in history...",
    createdAt: new Date().toISOString(),
    likes: 200,
    comments: 45,
    featured: true
  },
  {
    id: "3",
    title: "Sonnet 18",
    author: {
      id: "3",
      name: "William Shakespeare",
      image: null
    },
    content: "Shall I compare thee to a summer's day?",
    excerpt: "Shall I compare thee to a summer's day?",
    createdAt: new Date().toISOString(),
    likes: 180,
    comments: 34,
    featured: false
  }
]

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
        <Button className={buttonVariants({ variant: "outline" })} type="button">Filter</Button>
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
            <Button className={buttonVariants()} asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 flex justify-center">
        <Button className={buttonVariants({ variant: "outline" })} type="button">Load More</Button>
      </div>
    </div>
  )
}

function PoemCard({ poem }: PoemCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow transition-all hover:shadow-lg">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <img
            src={poem.author.image || "/placeholder.svg"}
            alt={poem.author.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium">{poem.author.name}</span>
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

