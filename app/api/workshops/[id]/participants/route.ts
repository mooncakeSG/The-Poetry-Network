import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

// Join a workshop
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const workshop = await prisma.workshop.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    })

    if (!workshop) {
      return NextResponse.json({ error: "Workshop not found" }, { status: 404 })
    }

    if (workshop._count.participants >= workshop.maxParticipants) {
      return NextResponse.json(
        { error: "Workshop is already full" },
        { status: 400 }
      )
    }

    const updatedWorkshop = await prisma.workshop.update({
      where: { id: params.id },
      data: {
        participants: {
          connect: { id: session.user.id },
        },
      },
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
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    })

    return NextResponse.json(updatedWorkshop)
  } catch (error) {
    console.error("Error joining workshop:", error)
    return NextResponse.json(
      { error: "Failed to join workshop" },
      { status: 500 }
    )
  }
}

// Leave a workshop
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const workshop = await prisma.workshop.findUnique({
      where: { id: params.id },
    })

    if (!workshop) {
      return NextResponse.json({ error: "Workshop not found" }, { status: 404 })
    }

    const updatedWorkshop = await prisma.workshop.update({
      where: { id: params.id },
      data: {
        participants: {
          disconnect: { id: session.user.id },
        },
      },
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
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    })

    return NextResponse.json(updatedWorkshop)
  } catch (error) {
    console.error("Error leaving workshop:", error)
    return NextResponse.json(
      { error: "Failed to leave workshop" },
      { status: 500 }
    )
  }
} 