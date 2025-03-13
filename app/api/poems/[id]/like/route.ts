import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const poemId = params.id
    const userId = session.user.id

    // Check if poem exists
    const poem = await prisma.poem.findUnique({
      where: { id: poemId },
    })

    if (!poem) {
      return NextResponse.json({ message: "Poem not found" }, { status: 404 })
    }

    // Check if user has already liked the poem
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_poemId: {
          userId,
          poemId,
        },
      },
    })

    if (existingLike) {
      // Unlike the poem
      await prisma.like.delete({
        where: {
          userId_poemId: {
            userId,
            poemId,
          },
        },
      })

      return NextResponse.json({ liked: false })
    }

    // Like the poem
    await prisma.like.create({
      data: {
        userId,
        poemId,
      },
    })

    return NextResponse.json({ liked: true })
  } catch (error) {
    console.error("Like poem error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 