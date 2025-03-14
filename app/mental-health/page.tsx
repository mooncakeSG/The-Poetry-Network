"use client"

import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Heart, MessageCircle, Share2, BookOpen, Lightbulb, Users } from "lucide-react"

// Mock data - replace with actual data from your backend
const resources = [
  {
    id: 1,
    title: "Poetry as Therapy",
    description:
      "Discover how writing and reading poetry can be a powerful tool for emotional healing and self-discovery.",
    author: {
      name: "Dr. Sarah Chen",
      image: "",
      credentials: "Poetry Therapist, MFA in Creative Writing",
    },
    readTime: "5 min read",
    likes: 45,
    comments: 12,
  },
  {
    id: 2,
    title: "Mindful Writing Exercises",
    description:
      "Practice mindfulness through poetry with these guided writing exercises designed to reduce stress and anxiety.",
    author: {
      name: "Michael Rivera",
      image: "",
      credentials: "Mindfulness Coach, Published Poet",
    },
    readTime: "8 min read",
    likes: 38,
    comments: 8,
  },
]

const prompts = [
  {
    id: 1,
    title: "Finding Peace",
    prompt:
      "Write about a place where you feel most at peace. What sensory details make this place special to you?",
    category: "Mindfulness",
    responses: 24,
  },
  {
    id: 2,
    title: "Letter to Self",
    prompt:
      "Write a compassionate letter to your younger self. What wisdom would you share?",
    category: "Self-Reflection",
    responses: 18,
  },
]

const groups = [
  {
    id: 1,
    name: "Healing Through Words",
    description:
      "A supportive community for those using poetry as a tool for mental health and healing.",
    members: 156,
    posts: 450,
    topics: ["Support", "Poetry Therapy", "Mental Health"],
  },
  {
    id: 2,
    name: "Mindful Poets",
    description:
      "Practice mindfulness and meditation through poetry writing and sharing.",
    members: 89,
    posts: 230,
    topics: ["Mindfulness", "Meditation", "Writing Practice"],
  },
]

export default function MentalHealthPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold">Mental Health & Poetry</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the healing power of poetry through resources, prompts, and
            supportive communities.
          </p>
        </div>

        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="justify-center">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="prompts">Writing Prompts</TabsTrigger>
            <TabsTrigger value="groups">Support Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={resource.author.image} />
                      <AvatarFallback>
                        {resource.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {resource.author.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {resource.author.credentials}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {resource.readTime}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      {resource.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {resource.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="prompts" className="space-y-6">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {prompt.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {prompt.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {prompt.prompt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {prompt.responses} responses
                    </span>
                    <Button>Write Response</Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            {groups.map((group) => (
              <Card key={group.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {group.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {group.description}
                    </p>

                    <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {group.members} members
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        {group.posts} posts
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.topics.map((topic) => (
                        <div
                          key={topic}
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:w-48">
                    <Button className="w-full">Join Group</Button>
                    <Button variant="outline" className="w-full">
                      Learn More
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