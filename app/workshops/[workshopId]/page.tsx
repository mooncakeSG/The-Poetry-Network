"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Plus, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

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

interface Member {
  id: string
  role: string
  joinedAt: string
  user: {
    id: string
    name: string
    image: string
  }
}

interface Submission {
  id: string
  title: string
  content: string
  status: string
  createdAt: string
  author: {
    id: string
    name: string
    image: string
  }
  _count: {
    feedback: number
  }
}

export default function WorkshopPage({ params }: { params: { workshopId: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWorkshopData() {
      try {
        setLoading(true)
        const [workshopRes, membersRes, submissionsRes] = await Promise.all([
          fetch(`/api/workshops/${params.workshopId}`),
          fetch(`/api/workshops/${params.workshopId}/members`),
          fetch(`/api/workshops/${params.workshopId}/submissions`),
        ])

        if (!workshopRes.ok) {
          throw new Error("Failed to fetch workshop")
        }

        const workshopData = await workshopRes.json()
        setWorkshop(workshopData)

        if (membersRes.ok) {
          const membersData = await membersRes.json()
          setMembers(membersData)
          // Find user's role if they're a member
          const userMember = membersData.find(
            (m: Member) => m.user.id === session?.user?.id
          )
          setUserRole(userMember?.role || null)
        }

        if (submissionsRes.ok) {
          const submissionsData = await submissionsRes.json()
          setSubmissions(submissionsData.submissions)
        }
      } catch (error) {
        console.error("Error fetching workshop data:", error)
        toast({
          title: "Error",
          description: "Failed to load workshop data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshopData()
  }, [params.workshopId, session?.user?.id, toast])

  async function handleJoinWorkshop() {
    if (!session?.user?.id) {
      router.push("/signin")
      return
    }

    try {
      const response = await fetch(`/api/workshops/${params.workshopId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to join workshop")
      }

      const member = await response.json()
      setMembers([...members, member])
      setUserRole("MEMBER")

      toast({
        title: "Joined workshop",
        description: "You have successfully joined the workshop.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join workshop. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!workshop) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Workshop not found</h1>
        </div>
      </div>
    )
  }

  const isHost = session?.user?.id === workshop.host.id
  const isMember = userRole !== null
  const canSubmit = isMember || isHost

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{workshop.title}</h1>
              {workshop.isPrivate && (
                <Badge variant="secondary">Private</Badge>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src={workshop.host.image} alt={workshop.host.name} />
                <AvatarFallback>
                  {workshop.host.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span>Hosted by {workshop.host.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isHost && (
              <Button variant="outline" size="sm" asChild>
                <a href={`/workshops/${workshop.id}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </a>
              </Button>
            )}
            {!isMember && !isHost && (
              <Button onClick={handleJoinWorkshop}>Join Workshop</Button>
            )}
          </div>
        </div>

        <p className="text-muted-foreground">{workshop.description}</p>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Members
                  <Badge variant="secondary" className="ml-2">
                    {workshop._count.members} / {workshop.maxMembers}
                  </Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={member.user.image}
                          alt={member.user.name}
                        />
                        <AvatarFallback>
                          {member.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submissions</CardTitle>
                {canSubmit && (
                  <Button asChild>
                    <a href={`/workshops/${workshop.id}/submit`}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Submission
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No submissions yet
                  </p>
                ) : (
                  submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={submission.author.image}
                            alt={submission.author.name}
                          />
                          <AvatarFallback>
                            {submission.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <a
                            href={`/workshops/${workshop.id}/submissions/${submission.id}`}
                            className="font-medium hover:underline"
                          >
                            {submission.title}
                          </a>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{submission.author.name}</span>
                            <span>•</span>
                            <span>{submission._count.feedback} feedback</span>
                          </div>
                        </div>
                      </div>
                      <Badge>{submission.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 