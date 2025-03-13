import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const invitation = await db.workshopInvitation.findUnique({
      where: {
        code: params.code,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        workshop: true,
      },
    })

    if (!invitation) {
      return new NextResponse("Invalid or expired invitation", { status: 404 })
    }

    // Check if user is already a member
    const existingMember = await db.workshopMember.findFirst({
      where: {
        workshopId: invitation.workshopId,
        userId: session.user.id,
      },
    })

    if (existingMember) {
      return new NextResponse("Already a member", { status: 400 })
    }

    // Check if workshop is full
    const memberCount = await db.workshopMember.count({
      where: { workshopId: invitation.workshopId },
    })

    if (memberCount >= invitation.workshop.maxMembers) {
      return new NextResponse("Workshop is full", { status: 400 })
    }

    // Start a transaction to update invitation and create member
    await db.$transaction([
      // Update invitation status
      db.workshopInvitation.update({
        where: { id: invitation.id },
        data: {
          status: "ACCEPTED",
          invitedUserId: session.user.id,
        },
      }),
      // Create workshop member
      db.workshopMember.create({
        data: {
          workshopId: invitation.workshopId,
          userId: session.user.id,
          role: "MEMBER",
        },
      }),
    ])

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("[WORKSHOP_JOIN_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 