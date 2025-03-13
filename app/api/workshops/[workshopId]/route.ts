import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const workshopUpdateSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  isPrivate: z.boolean(),
  maxMembers: z.number().min(2).max(100),
})

export async function GET(
  req: Request,
  { params }: { params: { workshopId: string } }
) {
  try {
    const workshop = await db.workshop.findUnique({
      where: { id: params.workshopId },
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
            members: true,
            submissions: true,
          },
        },
      },
    })

    if (!workshop) {
      return new NextResponse("Workshop not found", { status: 404 })
    }

    return NextResponse.json(workshop)
  } catch (error) {
    console.error("[WORKSHOP_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { workshopId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const workshop = await db.workshop.findUnique({
      where: { id: params.workshopId },
    })

    if (!workshop) {
      return new NextResponse("Workshop not found", { status: 404 })
    }

    if (workshop.hostId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = workshopUpdateSchema.parse(json)

    // Check if reducing max members would exceed current member count
    if (body.maxMembers < workshop.maxMembers) {
      const memberCount = await db.workshopMember.count({
        where: { workshopId: params.workshopId },
      })

      if (memberCount > body.maxMembers) {
        return new NextResponse(
          "Cannot reduce maximum members below current member count",
          { status: 400 }
        )
      }
    }

    const updatedWorkshop = await db.workshop.update({
      where: { id: params.workshopId },
      data: {
        title: body.title,
        description: body.description,
        isPrivate: body.isPrivate,
        maxMembers: body.maxMembers,
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
            members: true,
            submissions: true,
          },
        },
      },
    })

    return NextResponse.json(updatedWorkshop)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[WORKSHOP_PATCH]", error)
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

    const workshop = await db.workshop.findUnique({
      where: { id: params.workshopId },
    })

    if (!workshop) {
      return new NextResponse("Workshop not found", { status: 404 })
    }

    if (workshop.hostId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await db.workshop.delete({
      where: { id: params.workshopId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[WORKSHOP_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 