"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface Workshop {
  id: string
  title: string
  description: string
  isPrivate: boolean
  maxMembers: number
  createdAt: string
  host: {
    id: string
    name: string
    image: string
  }
  _count: {
    members: number
    submissions: number
  }
}

export function WorkshopList() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (activeTab === "hosting") {
          params.set("hostId", session?.user?.id || "")
        } else if (activeTab === "joined") {
          params.set("memberId", session?.user?.id || "")
        }

        const response = await fetch(`/api/workshops?${params}`)
        const data = await response.json()
        setWorkshops(data.workshops)
      } catch (error) {
        console.error("Error fetching workshops:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshops()
  }, [activeTab, session?.user?.id])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Workshops</TabsTrigger>
          {session?.user && (
            <>
              <TabsTrigger value="hosting">Hosting</TabsTrigger>
              <TabsTrigger value="joined">Joined</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {workshops.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No workshops found</p>
            </div>
          ) : (
            workshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))
          )}
        </TabsContent>

        <TabsContent value="hosting" className="space-y-4">
          {!session?.user ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="mb-4 text-muted-foreground">
                Sign in to see workshops you're hosting
              </p>
              <Button asChild>
                <a href="/signin">Sign In</a>
              </Button>
            </div>
          ) : workshops.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                You're not hosting any workshops
              </p>
            </div>
          ) : (
            workshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))
          )}
        </TabsContent>

        <TabsContent value="joined" className="space-y-4">
          {!session?.user ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="mb-4 text-muted-foreground">
                Sign in to see workshops you've joined
              </p>
              <Button asChild>
                <a href="/signin">Sign In</a>
              </Button>
            </div>
          ) : workshops.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                You haven't joined any workshops
              </p>
            </div>
          ) : (
            workshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={workshop.host.image} alt={workshop.host.name} />
              <AvatarFallback>
                {workshop.host.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{workshop.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Hosted by {workshop.host.name}
              </p>
            </div>
          </div>
          {workshop.isPrivate && (
            <Badge variant="secondary">Private</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{workshop.description}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {workshop._count.members} / {workshop.maxMembers} members
          </span>
          <span>•</span>
          <span>{workshop._count.submissions} submissions</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={`/workshops/${workshop.id}`}>View Workshop</a>
        </Button>
      </CardFooter>
    </Card>
  )
} 