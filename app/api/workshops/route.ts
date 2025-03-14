import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"
import { NextRequest } from "next/server"

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, date, startTime, endTime, maxParticipants, type } =
      body

    const workshop = await prisma.workshop.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        maxParticipants,
        type,
        hostId: session.user.id,
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

    return NextResponse.json(workshop)
  } catch (error) {
    console.error("Error creating workshop:", error)
    return NextResponse.json(
      { error: "Failed to create workshop" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("start")
    const endDate = searchParams.get("end")
    const type = searchParams.get("type")

    const where = {
      ...(startDate && endDate
        ? {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {}),
      ...(type ? { type: { equals: type, mode: "insensitive" } } : {}),
    }

    const workshops = await prisma.workshop.findMany({
      where,
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
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json(workshops)
  } catch (error) {
    console.error("Error fetching workshops:", error)
    return NextResponse.json(
      { error: "Failed to fetch workshops" },
      { status: 500 }
    )
  }
} 
} 




