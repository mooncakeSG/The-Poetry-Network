import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const invitation = await db.workshopInvitation.findUnique({
      where: {
        code: params.code,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        workshop: {
          select: {
            id: true,
            title: true,
            description: true,
            host: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!invitation) {
      return new NextResponse("Invalid or expired invitation", { status: 404 })
    }

    return NextResponse.json({ workshop: invitation.workshop })
  } catch (error) {
    console.error("[WORKSHOP_INVITATION_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 