export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Get users that the current user follows
    const following = await prisma.follows.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
    })

    const followingIds = following.map((f) => f.followingId)

    // Get poems from followed users and the current user
    const [poems, total] = await Promise.all([
      prisma.poem.findMany({
        where: {
          authorId: {
            in: [...followingIds, session.user.id],
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
          likes: {
            where: { userId: session.user.id },
            select: { userId: true },
          },
        },
      }),
      prisma.poem.count({
        where: {
          authorId: {
            in: [...followingIds, session.user.id],
          },
          published: true,
        },
      }),
    ])

    return NextResponse.json({
      poems,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Get Feed API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 