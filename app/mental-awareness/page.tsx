"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, BookOpen, Users, Phone, ExternalLink, PenTool, Search, Home, Calendar, Clock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"
import { MentalHealthResources } from "../components/MentalHealthResources"

const healingPoems = [
  {
    title: "Still I Rise",
    author: "Maya Angelou",
    excerpt: "You may write me down in history\nWith your bitter, twisted lies...",
    theme: "Resilience",
    image: "/images/poets/maya-angelou.jpg"
  },
  {
    title: "The Journey",
    author: "Mary Oliver",
    excerpt: "One day you finally knew\nwhat you had to do, and began...",
    theme: "Self-Discovery",
    image: "/images/poets/mary-oliver.jpg"
  }
]

const writingPrompts = [
  {
    title: "Finding Light",
    description: "Write about a moment when you found hope in an unexpected place.",
    tags: ["Hope", "Reflection"]
  },
  {
    title: "Dear Future Self",
    description: "Compose a letter to your future self, expressing your current hopes and dreams.",
    tags: ["Growth", "Future"]
  }
]

const workshops = [
  {
    title: "Poetry for Healing",
    description: "A guided workshop on using poetry for emotional expression.",
    date: "June 25, 2024",
    time: "7:00 PM EST",
    instructor: "Dr. Sarah Chen",
    spots: 15
  },
  {
    title: "Mindful Writing",
    description: "Combine meditation and poetry in this unique workshop.",
    date: "July 2, 2024",
    time: "7:00 PM EST",
    instructor: "Michael Rivera",
    spots: 12
  }
]

export default function MentalAwarenessPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  return (
    <div>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span className="font-semibold">Home</span>
              </Link>
              <Link href="/mental-awareness" className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                <Heart className="h-5 w-5" />
                <span className="font-semibold">Mental Health</span>
              </Link>
              <Link href="/workshops" className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span className="font-semibold">Workshops</span>
              </Link>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </nav>

      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mental Health & Poetry
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A safe space to explore emotions, find support, and heal through the power of words.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-12">
          {/* Left Sidebar - Quick Resources */}
          <div className="md:col-span-3">
            <Card className="p-4">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Quick Support
              </h2>
              <MentalHealthResources />
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-6">
            <Tabs defaultValue="healing" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="healing" className="flex-1">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Healing Poetry
                </TabsTrigger>
                <TabsTrigger value="write" className="flex-1">
                  <PenTool className="mr-2 h-4 w-4" />
                  Write & Reflect
                </TabsTrigger>
                <TabsTrigger value="community" className="flex-1">
                  <Users className="mr-2 h-4 w-4" />
                  Community
                </TabsTrigger>
              </TabsList>

              <TabsContent value="healing" className="mt-4 space-y-4">
                {healingPoems.map((poem) => (
                  <Card key={poem.title} className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={poem.image}
                          alt={poem.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{poem.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">by {poem.author}</p>
                        <blockquote className="border-l-2 pl-4 italic mb-4">
                          {poem.excerpt}
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <span className="text-sm px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
                            Theme: {poem.theme}
                          </span>
                          <Button variant="ghost" size="sm">
                            Read Full Poem →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="write" className="mt-4 space-y-4">
                {writingPrompts.map((prompt) => (
                  <Card key={prompt.title} className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{prompt.title}</h3>
                    <p className="text-muted-foreground mb-4">{prompt.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {prompt.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 bg-muted rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button
                        onClick={() => setSelectedPrompt(prompt.title)}
                        variant="outline"
                        size="sm"
                      >
                        Start Writing →
                      </Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="community" className="mt-4">
                <Card className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-2xl font-semibold mb-2">Join Our Community</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Connect with others who understand. Share your story, find support,
                    and grow together through poetry.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="default" size="lg">
                      Share Your Story
                    </Button>
                    <Button variant="outline" size="lg">
                      Browse Stories
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Upcoming Workshops */}
          <div className="md:col-span-3">
            <Card className="p-4">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Upcoming Workshops
              </h2>
              <div className="space-y-4">
                {workshops.map((workshop) => (
                  <div key={workshop.title} className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">{workshop.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {workshop.description}
                    </p>
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        {workshop.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        {workshop.time}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        with {workshop.instructor}
                      </div>
                      <div className="text-sm font-medium text-purple-600">
                        {workshop.spots} spots available
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Register Now
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated to promoting mental wellness through the healing power of poetry.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated with our latest workshops and resources.
              </p>
              <Button>Subscribe</Button>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 