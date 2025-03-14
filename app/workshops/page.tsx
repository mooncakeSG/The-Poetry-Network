"use client"

import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Calendar, Clock, Users, Plus } from "lucide-react"

// Mock data - replace with actual data from your backend
const workshops = [
  {
    id: 1,
    title: "Poetry for Healing",
    description:
      "A guided workshop on using poetry for emotional expression and healing. Join us in exploring the therapeutic power of words.",
    host: {
      name: "Dr. Sarah Chen",
      image: "",
      credentials: "Poetry Therapist, MFA in Creative Writing",
    },
    date: "2024-03-25",
    time: "7:00 PM EST",
    duration: "90 minutes",
    participants: 12,
    maxParticipants: 15,
    topics: ["Therapeutic Writing", "Self-Expression", "Healing"],
  },
  {
    id: 2,
    title: "Mindful Writing",
    description:
      "Combine meditation and poetry in this unique workshop. Learn to write from a place of presence and awareness.",
    host: {
      name: "Michael Rivera",
      image: "",
      credentials: "Mindfulness Coach, Published Poet",
    },
    date: "2024-04-02",
    time: "7:00 PM EST",
    duration: "60 minutes",
    participants: 8,
    maxParticipants: 12,
    topics: ["Mindfulness", "Meditation", "Creative Writing"],
  },
]

const myWorkshops = [
  {
    id: 1,
    title: "Nature Poetry",
    description:
      "Explore the beauty of nature through poetry. Learn to capture the essence of landscapes and seasons in your writing.",
    host: {
      name: "Emily Johnson",
      image: "",
      credentials: "Environmental Poet, MA in Literature",
    },
    date: "2024-03-30",
    time: "6:00 PM EST",
    duration: "120 minutes",
    participants: 10,
    maxParticipants: 15,
    topics: ["Nature", "Environmental Poetry", "Imagery"],
  },
]

export default function WorkshopsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Poetry Workshops</h1>
            <p className="text-muted-foreground">
              Join interactive workshops to improve your poetry skills
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Workshop
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="search"
            placeholder="Search workshops..."
            className="sm:max-w-sm"
          />
          <Button variant="outline">Filter</Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="my-workshops">My Workshops</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {workshops.map((workshop) => (
              <Card key={workshop.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {workshop.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {workshop.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(workshop.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {workshop.time} · {workshop.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {workshop.participants}/{workshop.maxParticipants}{" "}
                        participants
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <AvatarImage src={workshop.host.image} />
                        <AvatarFallback>
                          {workshop.host.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">
                          {workshop.host.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {workshop.host.credentials}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {workshop.topics.map((topic) => (
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
                    <Button className="w-full">Join Workshop</Button>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="my-workshops" className="space-y-6">
            {myWorkshops.map((workshop) => (
              <Card key={workshop.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {workshop.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {workshop.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(workshop.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {workshop.time} · {workshop.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {workshop.participants}/{workshop.maxParticipants}{" "}
                        participants
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {workshop.topics.map((topic) => (
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
                    <Button variant="outline" className="w-full">
                      Manage Workshop
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Participants
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

