"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Edit, Settings } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PoemCard } from "@/components/poem-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Poem {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    image: string
  }
  likes: number
  comments: number
  isLiked: boolean
  tags: string[]
  createdAt: string
}

interface Profile {
  id: string
  name: string
  image: string
  bio: string | null
  poems: Poem[]
  savedPoems: Poem[]
  _count: {
    poems: number
    followers: number
    following: number
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch(`/api/users/${session.user.id}/profile`)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching profile:", error)
          setLoading(false)
        })
    }
  }, [session, status])

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.image} alt={profile.name} />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.bio || "No bio yet"}</p>
              <div className="mt-2 flex gap-4">
                <div>
                  <span className="font-bold">{profile._count.poems}</span>{" "}
                  <span className="text-muted-foreground">poems</span>
                </div>
                <div>
                  <span className="font-bold">{profile._count.followers}</span>{" "}
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div>
                  <span className="font-bold">{profile._count.following}</span>{" "}
                  <span className="text-muted-foreground">following</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="poems">
          <TabsList>
            <TabsTrigger value="poems">Poems</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="poems" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profile.poems.map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="saved" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profile.savedPoems.map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="about" className="mt-6">
            <div className="prose dark:prose-invert">
              <h2>About {profile.name}</h2>
              <p>{profile.bio || "No bio available."}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function PoemCard({ poem }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow transition-all hover:shadow-lg">
      <div className="space-y-2">
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
        href={`/poems/${poem.poemId}`}
        className="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`Read ${poem.title}`}
      />
    </div>
  )
}

// Sample data
const userPoems = [
  {
    id: "1",
    title: "Whispers of Dawn",
    excerpt:
      "Morning light filters through leaves,\nDew-kissed petals unfold their secrets,\nAs the world awakens to possibility,\nI find myself renewed.",
    likes: 124,
    comments: 18,
  },
  {
    id: "2",
    title: "Urban Symphony",
    excerpt:
      "Concrete canyons echo with footsteps,\nA thousand lives intersecting,\nIn this moment, this breath,\nWe are all connected.",
    likes: 89,
    comments: 12,
  },
  {
    id: "3",
    title: "Ocean Memories",
    excerpt:
      "Salt-tinged air carries memories,\nWaves crash against forgotten shores,\nTime erases footprints in sand,\nBut the heart remembers.",
    likes: 156,
    comments: 24,
  },
]

const savedPoems = [
  {
    id: "4",
    title: "Midnight Thoughts",
    author: "James Peterson",
    excerpt:
      "Stars punctuate the darkness,\nSilence wraps around my shoulders,\nThoughts drift like clouds,\nIn the vast night sky of my mind.",
    likes: 72,
    comments: 8,
  },
  {
    id: "5",
    title: "Autumn Dance",
    author: "Olivia Martinez",
    excerpt:
      "Crimson and gold twirl in the breeze,\nNature's last waltz before sleep,\nI watch, mesmerized by the rhythm,\nOf endings that promise new beginnings.",
    likes: 103,
    comments: 15,
  },
]

