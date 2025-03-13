import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sort = searchParams.get("sort") || "latest"
    
    const skip = (page - 1) * limit

    // Build the where clause
    const where = {
      published: true,
    }

    // Build the orderBy clause based on sort parameter
    let orderBy: any = { createdAt: "desc" }
    if (sort === "trending") {
      orderBy = [
        { likes: { _count: "desc" } },
        { comments: { _count: "desc" } },
        { createdAt: "desc" },
      ]
    }

    const [poems, total] = await Promise.all([
      prisma.poem.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          // If user is logged in, check if they liked each poem
          likes: session?.user?.id ? {
            where: {
              userId: session.user.id,
            },
            select: {
              userId: true,
            },
          } : false,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.poem.count({ where }),
    ])

    // Transform the poems to include userLiked
    const transformedPoems = poems.map((poem) => ({
      ...poem,
      userLiked: session?.user?.id ? poem.likes.length > 0 : false,
      likes: undefined, // Remove the likes array from the response
    }))

    return NextResponse.json({
      poems: transformedPoems,
      total,
      hasMore: skip + poems.length < total,
    })
  } catch (error) {
    console.error("Error fetching feed:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 