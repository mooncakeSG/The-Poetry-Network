import { format } from "date-fns"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import WorkshopActions from "@/app/components/WorkshopActions"

export default async function WorkshopPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession()
  const workshop = await prisma.workshop.findUnique({
    where: { id: params.id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      participants: {
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

  if (!workshop) {
    notFound()
  }

  const isHost = session?.user?.id === workshop.host.id
  const isParticipant = workshop.participants.some(
    (p: { id: string }) => p.id === session?.user?.id
  )
  const isFull = workshop._count.participants >= workshop.maxParticipants

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">{workshop.title}</CardTitle>
              <p className="text-muted-foreground">
                Hosted by {workshop.host.name}
              </p>
            </div>
            <Badge variant="outline">{workshop.type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p>{workshop.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold">Date</h3>
              <p>{format(new Date(workshop.date), "MMMM d, yyyy")}</p>
            </div>
            <div>
              <h3 className="font-semibold">Time</h3>
              <p>
                {workshop.startTime} - {workshop.endTime}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Participants</h3>
              <p>
                {workshop._count.participants} / {workshop.maxParticipants}
              </p>
            </div>
          </div>

          {session?.user && !isHost && (
            <WorkshopActions
              id={workshop.id}
              isParticipant={isParticipant}
              isFull={isFull}
            />
          )}

          <div className="space-y-4">
            <h3 className="font-semibold">Participants</h3>
            <div className="flex flex-wrap gap-4">
              {workshop.participants.map((participant: { id: string; name: string | null; image: string | null }) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-2"
                >
                  <Avatar>
                    <AvatarImage src={participant.image || undefined} />
                    <AvatarFallback>
                      {participant.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{participant.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 