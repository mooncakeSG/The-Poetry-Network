import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"
import { nanoid } from "nanoid"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendInvitationEmail } from "@/lib/email"

const invitationSchema = z.object({
  email: z.string().email().optional(),
  userId: z.string().optional(),
}).refine(data => data.email || data.userId, {
  message: "Either email or userId must be provided",
})

export async function GET(
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
      include: { host: true },
    })

    if (!workshop) {
      return new NextResponse("Workshop not found", { status: 404 })
    }

    if (workshop.hostId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const invitations = await db.workshopInvitation.findMany({
      where: { workshopId: params.workshopId },
      include: {
        invitedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(invitations)
  } catch (error) {
    console.error("[WORKSHOP_INVITATIONS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(
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
      include: { host: true },
    })

    if (!workshop) {
      return new NextResponse("Workshop not found", { status: 404 })
    }

    if (workshop.hostId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = invitationSchema.parse(json)

    let invitedUser = null
    if (body.userId) {
      invitedUser = await db.user.findUnique({
        where: { id: body.userId },
      })
      if (!invitedUser) {
        return new NextResponse("User not found", { status: 404 })
      }
    }

    // Check if user is already a member
    const existingMember = await db.workshopMember.findFirst({
      where: {
        workshopId: params.workshopId,
        OR: [
          { userId: body.userId },
          { user: { email: body.email } },
        ],
      },
    })

    if (existingMember) {
      return new NextResponse("User is already a member", { status: 400 })
    }

    // Check if there's already a pending invitation
    const existingInvitation = await db.workshopInvitation.findFirst({
      where: {
        workshopId: params.workshopId,
        OR: [
          { invitedUserId: body.userId },
          { email: body.email },
        ],
        status: "PENDING",
      },
    })

    if (existingInvitation) {
      return new NextResponse("Invitation already sent", { status: 400 })
    }

    const invitation = await db.workshopInvitation.create({
      data: {
        workshopId: params.workshopId,
        invitedById: session.user.id,
        invitedUserId: body.userId,
        email: body.email,
        code: nanoid(),
        status: "PENDING",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        invitedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // Send invitation email
    if (body.email || invitedUser?.email) {
      await sendInvitationEmail({
        to: body.email || invitedUser!.email,
        workshop: {
          title: workshop.title,
          host: workshop.host.name,
        },
        inviteCode: invitation.code,
      })
    }

    return NextResponse.json(invitation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[WORKSHOP_INVITATIONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { workshopId: string; invitationId: string } }
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

    await db.workshopInvitation.delete({
      where: {
        id: params.invitationId,
        workshopId: params.workshopId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[WORKSHOP_INVITATIONS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 