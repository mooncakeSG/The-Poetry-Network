import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
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

    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: params.id,
        },
      },
    })

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: params.id,
          },
        },
      })
      return NextResponse.json({ following: false })
    }

    await prisma.follows.create({
      data: {
        followerId: session.user.id,
        followingId: params.id,
      },
    })

    return NextResponse.json({ following: true })
  } catch (error) {
    console.error("Follow User API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 