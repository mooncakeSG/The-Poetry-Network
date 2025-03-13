import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      select: { authorId: true },
    })

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      )
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    const updatedComment = await prisma.comment.update({
      where: { id: params.commentId },
      data: { content },
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

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error("Update Comment API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      select: { authorId: true },
    })

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      )
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id: params.commentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete Comment API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 