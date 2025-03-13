import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const memberUpdateSchema = z.object({
  role: z.enum(["MEMBER", "MODERATOR"]),
})

export async function PATCH(
  req: Request,
  { params }: { params: { workshopId: string; memberId: string } }
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

    const member = await db.workshopMember.findUnique({
      where: { id: params.memberId },
      include: {
        user: true,
      },
    })

    if (!member) {
      return new NextResponse("Member not found", { status: 404 })
    }

    // Prevent modifying host's role
    if (member.user.id === workshop.hostId) {
      return new NextResponse("Cannot modify host's role", { status: 400 })
    }

    const json = await req.json()
    const body = memberUpdateSchema.parse(json)

    const updatedMember = await db.workshopMember.update({
      where: { id: params.memberId },
      data: {
        role: body.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(updatedMember)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[WORKSHOP_MEMBER_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { workshopId: string; memberId: string } }
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

    const member = await db.workshopMember.findUnique({
      where: { id: params.memberId },
      include: {
        user: true,
      },
    })

    if (!member) {
      return new NextResponse("Member not found", { status: 404 })
    }

    // Prevent removing the host
    if (member.user.id === workshop.hostId) {
      return new NextResponse("Cannot remove workshop host", { status: 400 })
    }

    await db.workshopMember.delete({
      where: { id: params.memberId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[WORKSHOP_MEMBER_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 