import { format } from "date-fns"
import { getServerSession } from "next-auth"
import Link from "next/link"

import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Workshop {
  id: string
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  maxParticipants: number
  type: string
  host: {
    id: string
    name: string | null
    image: string | null
  }
  _count: {
    participants: number
  }
}

export default async function WorkshopsPage() {
  const session = await getServerSession()
  const workshops = await prisma.workshop.findMany({
    orderBy: {
      date: "asc",
    },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          participants: true,
        },
      },
    },
  })

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Poetry Workshops</h1>
        {session?.user && (
          <Link href="/workshops/new">
            <Button>Host Workshop</Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop: Workshop) => (
          <Link key={workshop.id} href={`/workshops/${workshop.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="line-clamp-1">{workshop.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={workshop.host.image || undefined} />
                        <AvatarFallback>
                          {workshop.host.name?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {workshop.host.name}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">{workshop.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {workshop.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">
                      {format(new Date(workshop.date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-muted-foreground">
                      {workshop.startTime} - {workshop.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Participants</p>
                    <p className="text-muted-foreground">
                      {workshop._count.participants} / {workshop.maxParticipants}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-muted-foreground">
                      {workshop._count.participants >= workshop.maxParticipants
                        ? "Full"
                        : "Open"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

