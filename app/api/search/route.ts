import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    
    const query = searchParams.get("q") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sort = searchParams.get("sort") || "latest"
    const filter = searchParams.get("filter") || "all"
    const tag = searchParams.get("tag")
    
    const skip = (page - 1) * limit

    // Build the where clause
    let where: any = {
      published: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    }

    // Add tag filter if specified
    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      }
    }

    // Add following filter if specified
    if (filter === "following" && session?.user?.id) {
      where.author = {
        followers: {
          some: {
            followerId: session.user.id,
          },
        },
      }
    }

    // Build the orderBy clause based on sort parameter
    let orderBy: any = { createdAt: "desc" }
    switch (sort) {
      case "trending":
        orderBy = [
          { likes: { _count: "desc" } },
          { comments: { _count: "desc" } },
          { createdAt: "desc" },
        ]
        break
      case "most_liked":
        orderBy = [
          { likes: { _count: "desc" } },
          { createdAt: "desc" },
        ]
        break
      case "most_commented":
        orderBy = [
          { comments: { _count: "desc" } },
          { createdAt: "desc" },
        ]
        break
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
          tags: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
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

    // Get popular tags
    const popularTags = await prisma.tag.findMany({
      select: {
        name: true,
        _count: {
          select: {
            poems: true,
          },
        },
      },
      orderBy: {
        poems: {
          _count: "desc",
        },
      },
      take: 10,
    })

    // Transform the poems to include userLiked and format tags
    const transformedPoems = poems.map((poem) => ({
      ...poem,
      userLiked: session?.user?.id ? poem.likes.length > 0 : false,
      tags: poem.tags.map((tag) => tag.name),
      likes: undefined, // Remove the likes array from the response
    }))

    return NextResponse.json({
      poems: transformedPoems,
      total,
      hasMore: skip + poems.length < total,
      popularTags: popularTags.map((tag) => ({
        name: tag.name,
        count: tag._count.poems,
      })),
    })
  } catch (error) {
    console.error("Error searching poems:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 