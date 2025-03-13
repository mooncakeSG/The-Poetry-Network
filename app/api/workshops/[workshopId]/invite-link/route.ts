import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { nanoid } from "nanoid"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

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
    })

    if (!workshop) {
      return new NextResponse("Workshop not found", { status: 404 })
    }

    if (workshop.hostId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Delete any existing invite links for this workshop
    await db.workshopInvitation.deleteMany({
      where: {
        workshopId: params.workshopId,
        email: null,
        invitedUserId: null,
      },
    })

    // Create a new invite link
    const invitation = await db.workshopInvitation.create({
      data: {
        workshopId: params.workshopId,
        invitedById: session.user.id,
        code: nanoid(),
        status: "PENDING",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/workshops/join/${invitation.code}`

    return NextResponse.json({ link })
  } catch (error) {
    console.error("[WORKSHOP_INVITE_LINK_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 