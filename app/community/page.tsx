"use client"

import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Users, MessageCircle, Calendar, Star, Search } from "lucide-react"

// Mock data - replace with actual data from your backend
const events = [
  {
    id: 1,
    title: "Poetry Reading Night",
    description:
      "Join us for an evening of poetry reading and discussion. Share your work or simply listen and enjoy.",
    date: "2024-03-25",
    time: "7:00 PM EST",
    host: {
      name: "Emily Johnson",
      image: "",
    },
    attendees: 24,
    maxAttendees: 30,
    type: "Virtual",
  },
  {
    id: 2,
    title: "Poetry Writing Workshop",
    description:
      "A collaborative workshop focused on developing your poetry writing skills through exercises and feedback.",
    date: "2024-03-28",
    time: "6:00 PM EST",
    host: {
      name: "Michael Rivera",
      image: "",
    },
    attendees: 15,
    maxAttendees: 20,
    type: "In-Person",
  },
]

const discussions = [
  {
    id: 1,
    title: "Modern Poetry Techniques",
    description:
      "Let's discuss contemporary poetry techniques and how they differ from traditional forms.",
    author: {
      name: "Sarah Chen",
      image: "",
    },
    replies: 45,
    views: 230,
    lastActivity: "2024-03-18T14:30:00Z",
  },
  {
    id: 2,
    title: "Finding Your Poetic Voice",
    description:
      "Share your journey in developing your unique poetic voice and style.",
    author: {
      name: "David Kim",
      image: "",
    },
    replies: 32,
    views: 180,
    lastActivity: "2024-03-17T18:45:00Z",
  },
]

const featuredPoets = [
  {
    id: 1,
    name: "Emily Johnson",
    image: "",
    bio: "Nature poet exploring themes of environmental consciousness",
    followers: 1200,
    poems: 45,
    featured: true,
  },
  {
    id: 2,
    name: "Michael Rivera",
    image: "",
    bio: "Writing about urban life and social justice",
    followers: 850,
    poems: 32,
    featured: true,
  },
]

export default function CommunityPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold">Poetry Community</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow poets, join events, and engage in meaningful
            discussions about poetry.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, discussions, or poets..."
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="justify-center">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="featured">Featured Poets</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {events.map((event) => (
              <Card key={event.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {event.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.attendees}/{event.maxAttendees} attending
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={event.host.image} />
                        <AvatarFallback>
                          {event.host.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        Hosted by{" "}
                        <span className="font-semibold">
                          {event.host.name}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:w-48">
                    <Button className="w-full">Join Event</Button>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {discussion.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {discussion.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        {discussion.replies} replies
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {discussion.views} views
                      </div>
                      <div>
                        Last active{" "}
                        {new Date(
                          discussion.lastActivity
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={discussion.author.image} />
                        <AvatarFallback>
                          {discussion.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        Started by{" "}
                        <span className="font-semibold">
                          {discussion.author.name}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:w-48">
                    <Button className="w-full">Join Discussion</Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            {featuredPoets.map((poet) => (
              <Card key={poet.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={poet.image} />
                      <AvatarFallback>{poet.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">
                          {poet.name}
                        </h3>
                        {poet.featured && (
                          <Star className="h-4 w-4 fill-primary text-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {poet.bio}
                      </p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{poet.poems} poems</span>
                        <span>{poet.followers} followers</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:w-48">
                    <Button className="w-full">Follow</Button>
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 