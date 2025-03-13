import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const commentSchema = z.object({
  content: z.string().min(1).max(500),
})

export async function POST(
  req: Request,
  { params }: { params: { poemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You must be signed in to comment" },
        { status: 401 }
      )
    }

    const json = await req.json()
    const body = commentSchema.parse(json)

    // Check if the poem exists
    const poem = await prisma.poem.findUnique({
      where: { id: params.poemId },
    })

    if (!poem) {
      return NextResponse.json(
        { message: "Poem not found" },
        { status: 404 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        authorId: session.user.id,
        poemId: params.poemId,
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

    return NextResponse.json(comment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 422 }
      )
    }

    console.error("Error creating comment:", error)
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
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { poemId: params.poemId },
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
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: { poemId: params.poemId },
      }),
    ])

    return NextResponse.json({
      comments,
      total,
      hasMore: skip + comments.length < total,
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 