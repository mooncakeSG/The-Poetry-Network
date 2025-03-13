import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const [user, poems, totalPoems, followers, following] = await Promise.all([
      prisma.user.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          createdAt: true,
          _count: {
            select: {
              poems: true,
              followers: true,
              following: true,
            },
          },
        },
      }),
      prisma.poem.findMany({
        where: {
          authorId: params.id,
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
          authorId: params.id,
          published: true,
        },
      }),
      prisma.follows.findMany({
        where: { followingId: params.id },
        select: {
          follower: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.follows.findMany({
        where: { followerId: params.id },
        select: {
          following: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
    ])

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const isFollowing = session?.user
      ? await prisma.follows.findUnique({
          where: {
            followerId_followingId: {
              followerId: session.user.id,
              followingId: params.id,
            },
          },
        })
      : null

    return NextResponse.json({
      user,
      poems,
      totalPoems,
      pages: Math.ceil(totalPoems / limit),
      currentPage: page,
      followers: followers.map((f) => f.follower),
      following: following.map((f) => f.following),
      isFollowing: !!isFollowing,
    })
  } catch (error) {
    console.error("Get User Profile API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user.id !== params.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, bio } = body

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            poems: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Update User Profile API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 