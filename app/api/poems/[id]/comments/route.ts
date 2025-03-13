import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const commentSchema = z.object({
  content: z.string().min(1).max(500),
})

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const result = commentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.errors },
        { status: 400 }
      )
    }

    const { content } = result.data
    const poemId = params.id

    // Check if poem exists
    const poem = await prisma.poem.findUnique({
      where: { id: poemId },
    })

    if (!poem) {
      return NextResponse.json({ message: "Poem not found" }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        poemId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Create comment error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const take = parseInt(searchParams.get("take") ?? "10")
    const skip = parseInt(searchParams.get("skip") ?? "0")
    const poemId = params.id

    const comments = await prisma.comment.findMany({
      where: {
        poemId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 