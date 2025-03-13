import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const [tag, poems, total] = await Promise.all([
      prisma.tag.findUnique({
        where: { name: params.name },
        include: {
          _count: {
            select: {
              poems: true,
            },
          },
        },
      }),
      prisma.poem.findMany({
        where: {
          tags: {
            some: {
              name: params.name,
            },
          },
          published: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          tags: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          ...(session?.user && {
            likes: {
              where: { userId: session.user.id },
              select: { userId: true },
            },
          }),
        },
      }),
      prisma.poem.count({
        where: {
          tags: {
            some: {
              name: params.name,
            },
          },
          published: true,
        },
      }),
    ])

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      tag,
      poems,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Get Tag Details API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 