import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const workshopCreateSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title must not be longer than 100 characters." }),
  description: z
    .string()
    .min(1, { message: "Description is required." })
    .max(500, { message: "Description must not be longer than 500 characters." }),
  isPrivate: z.boolean().default(false),
  maxMembers: z.number().min(2).max(100).default(20),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = workshopCreateSchema.parse(body)

    const workshop = await prisma.workshop.create({
      data: {
        ...validatedData,
        hostId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "MODERATOR",
          },
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
        _count: {
          select: {
            members: true,
            submissions: true,
          },
        },
      },
    })

    return NextResponse.json(workshop)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating workshop:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const session = await getServerSession(authOptions)
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const hostId = searchParams.get("hostId")
    const memberId = searchParams.get("memberId")
    
    const skip = (page - 1) * limit

    // Build where clause
    const where = {
      OR: [
        { isPrivate: false },
        ...(session?.user?.id ? [
          { hostId: session.user.id },
          { members: { some: { userId: session.user.id } } },
        ] : []),
      ],
      ...(hostId && { hostId }),
      ...(memberId && { members: { some: { userId: memberId } } }),
    }

    const [workshops, total] = await Promise.all([
      prisma.workshop.findMany({
        where,
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
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.workshop.count({ where }),
    ])

    return NextResponse.json({
      workshops,
      total,
      hasMore: skip + workshops.length < total,
    })
  } catch (error) {
    console.error("Error fetching workshops:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 