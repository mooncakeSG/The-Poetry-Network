import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const memberCreateSchema = z.object({
  userId: z.string(),
  role: z.enum(["MEMBER", "MODERATOR"]).default("MEMBER"),
})

export async function POST(
  req: Request,
  { params }: { params: { workshopId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const workshop = await prisma.workshop.findUnique({
      where: { id: params.workshopId },
      include: {
        _count: { select: { members: true } },
        members: {
          where: { userId: session.user.id },
          select: { role: true },
        },
      },
    })

    if (!workshop) {
      return NextResponse.json(
        { message: "Workshop not found" },
        { status: 404 }
      )
    }

    // Check if user is authorized to add members
    const userRole = workshop.members[0]?.role
    if (workshop.hostId !== session.user.id && userRole !== "MODERATOR") {
      return NextResponse.json(
        { message: "Not authorized to add members" },
        { status: 403 }
      )
    }

    // Check if workshop is at capacity
    if (workshop._count.members >= workshop.maxMembers) {
      return NextResponse.json(
        { message: "Workshop is at capacity" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const validatedData = memberCreateSchema.parse(body)

    // Check if user is already a member
    const existingMember = await prisma.workshopMember.findUnique({
      where: {
        userId_workshopId: {
          userId: validatedData.userId,
          workshopId: params.workshopId,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { message: "User is already a member" },
        { status: 400 }
      )
    }

    const member = await prisma.workshopMember.create({
      data: {
        ...validatedData,
        workshopId: params.workshopId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(member)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Error adding workshop member:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: { workshopId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const workshop = await prisma.workshop.findUnique({
      where: { id: params.workshopId },
      select: {
        isPrivate: true,
        hostId: true,
        members: {
          where: session?.user?.id
            ? { userId: session.user.id }
            : undefined,
        },
      },
    })

    if (!workshop) {
      return NextResponse.json(
        { message: "Workshop not found" },
        { status: 404 }
      )
    }

    // Check if user can view members
    if (
      workshop.isPrivate &&
      workshop.hostId !== session?.user?.id &&
      workshop.members.length === 0
    ) {
      return NextResponse.json(
        { message: "Not authorized to view members" },
        { status: 403 }
      )
    }

    const members = await prisma.workshopMember.findMany({
      where: { workshopId: params.workshopId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: [
        { role: "desc" },
        { joinedAt: "asc" },
      ],
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching workshop members:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { workshopId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      )
    }

    const workshop = await prisma.workshop.findUnique({
      where: { id: params.workshopId },
      include: {
        members: {
          where: { userId: session.user.id },
          select: { role: true },
        },
      },
    })

    if (!workshop) {
      return NextResponse.json(
        { message: "Workshop not found" },
        { status: 404 }
      )
    }

    // Check if user is authorized to remove members
    const userRole = workshop.members[0]?.role
    if (
      workshop.hostId !== session.user.id &&
      userRole !== "MODERATOR" &&
      userId !== session.user.id
    ) {
      return NextResponse.json(
        { message: "Not authorized to remove members" },
        { status: 403 }
      )
    }

    // Cannot remove the host
    if (userId === workshop.hostId) {
      return NextResponse.json(
        { message: "Cannot remove workshop host" },
        { status: 400 }
      )
    }

    await prisma.workshopMember.delete({
      where: {
        userId_workshopId: {
          userId,
          workshopId: params.workshopId,
        },
      },
    })

    return NextResponse.json({ message: "Member removed successfully" })
  } catch (error) {
    console.error("Error removing workshop member:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 