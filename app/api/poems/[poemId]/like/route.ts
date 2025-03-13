import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { poemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You must be signed in to like a poem" },
        { status: 401 }
      )
    }

    const poemId = params.poemId

    // Check if the poem exists
    const poem = await prisma.poem.findUnique({
      where: { id: poemId },
    })

    if (!poem) {
      return NextResponse.json(
        { message: "Poem not found" },
        { status: 404 }
      )
    }

    // Check if the user has already liked the poem
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_poemId: {
          userId: session.user.id,
          poemId,
        },
      },
    })

    if (existingLike) {
      // Unlike the poem
      await prisma.like.delete({
        where: {
          userId_poemId: {
            userId: session.user.id,
            poemId,
          },
        },
      })

      return NextResponse.json({ liked: false })
    }

    // Like the poem
    await prisma.like.create({
      data: {
        userId: session.user.id,
        poemId,
      },
    })

    return NextResponse.json({ liked: true })
  } catch (error) {
    console.error("Error handling poem like:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: { poemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const poemId = params.poemId

    const likesCount = await prisma.like.count({
      where: { poemId },
    })

    let userLiked = false

    if (session?.user?.id) {
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_poemId: {
            userId: session.user.id,
            poemId,
          },
        },
      })
      userLiked = !!existingLike
    }

    return NextResponse.json({
      likesCount,
      userLiked,
    })
  } catch (error) {
    console.error("Error getting poem likes:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 