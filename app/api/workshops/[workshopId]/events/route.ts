import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const eventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  date: z.string().transform((str) => new Date(str)),
  type: z.enum(["meeting", "deadline", "feedback"]),
})

export async function POST(
  req: Request,
  { params }: { params: { workshopId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is workshop host
    const workshop = await db.workshop.findUnique({
      where: { id: params.workshopId },
    })

    if (!workshop) {
      return new NextResponse("Workshop not found", { status: 404 })
    }

    if (workshop.hostId !== session.user.id) {
      return new NextResponse("Only workshop host can manage events", { status: 403 })
    }

    const json = await req.json()
    const body = eventSchema.parse(json)

    const event = await db.workshopEvent.create({
      data: {
        title: body.title,
        description: body.description,
        date: body.date,
        type: body.type,
        workshopId: params.workshopId,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[EVENT_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { workshopId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is a member of the workshop
    const member = await db.workshopMember.findFirst({
      where: {
        workshopId: params.workshopId,
        userId: session.user.id,
      },
    })

    if (!member) {
      return new NextResponse("Must be a workshop member to view events", { status: 403 })
    }

    const events = await db.workshopEvent.findMany({
      where: {
        workshopId: params.workshopId,
      },
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("[EVENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { workshopId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("id")

    if (!eventId) {
      return new NextResponse("Event ID is required", { status: 400 })
    }

    // Check if user is workshop host
    const workshop = await db.workshop.findUnique({
      where: { id: params.workshopId },
    })

    if (!workshop) {
      return new NextResponse("Workshop not found", { status: 404 })
    }

    if (workshop.hostId !== session.user.id) {
      return new NextResponse("Only workshop host can delete events", { status: 403 })
    }

    await db.workshopEvent.delete({
      where: {
        id: eventId,
        workshopId: params.workshopId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[EVENT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 