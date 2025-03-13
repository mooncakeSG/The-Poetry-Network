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

    const poem = await prisma.poem.findUnique({
      where: { id: params.id },
      select: { id: true },
    })

    if (!poem) {
      return NextResponse.json(
        { error: "Poem not found" },
        { status: 404 }
      )
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_poemId: {
          userId: session.user.id,
          poemId: params.id,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_poemId: {
            userId: session.user.id,
            poemId: params.id,
          },
        },
      })
      return NextResponse.json({ liked: false })
    }

    await prisma.like.create({
      data: {
        userId: session.user.id,
        poemId: params.id,
      },
    })

    return NextResponse.json({ liked: true })
  } catch (error) {
    console.error("Like Poem API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 