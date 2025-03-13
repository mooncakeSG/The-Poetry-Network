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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    const workshop = await prisma.workshop.create({
      data: {
        title,
        description,
        creatorId: session.user.id,
        members: {
          connect: { id: session.user.id },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            members: true,
            poems: true,
          },
        },
      },
    })

    return NextResponse.json(workshop)
  } catch (error) {
    console.error("Create Workshop API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit
    const query = searchParams.get("q") || ""

    const [workshops, total] = await Promise.all([
      prisma.workshop.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          members: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              members: true,
              poems: true,
            },
          },
          ...(session?.user && {
            members: {
              where: { id: session.user.id },
              select: { id: true },
            },
          }),
        },
      }),
      prisma.workshop.count({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
      }),
    ])

    return NextResponse.json({
      workshops: workshops.map((workshop) => ({
        ...workshop,
        isMember: workshop.members.length > 0,
      })),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Get Workshops API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 
} 




