import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"
import PusherServer from "pusher"
import { Resend } from "resend"
import { render } from "@react-email/render"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import CommentNotificationEmail from "@/components/emails/CommentNotification"

const pusher = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

const resend = new Resend(process.env.RESEND_API_KEY)

const commentCreateSchema = z.object({
  content: z.string().min(1).max(1000),
})

export async function POST(
  req: Request,
  { params }: { params: { workshopId: string; submissionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is a member of the workshop
    const member = await db.workshopMember.findFirst({
      where: {
        workshopId: params.workshopId,
        userId: session.user.id,
      },
    })

    if (!member) {
      return new NextResponse("Must be a workshop member to comment", { status: 403 })
    }

    // Check if submission exists and belongs to the workshop
    const submission = await db.submission.findUnique({
      where: {
        id: params.submissionId,
        workshopId: params.workshopId,
      },
    })

    if (!submission) {
      return new NextResponse("Submission not found", { status: 404 })
    }

    const [submissionData, workshop] = await Promise.all([
      db.submission.findUnique({
        where: {
          id: params.submissionId,
          workshopId: params.workshopId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      db.workshop.findUnique({
        where: { id: params.workshopId },
        select: { title: true },
      }),
    ])

    if (!submissionData || !workshop) {
      return new NextResponse("Submission or workshop not found", { status: 404 })
    }

    const json = await req.json()
    const body = commentCreateSchema.parse(json)

    const comment = await db.comment.create({
      data: {
        content: body.content,
        authorId: session.user.id,
        submissionId: params.submissionId,
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

    // Send real-time update
    await pusher.trigger(
      `submission-${params.submissionId}`,
      "new-comment",
      comment
    )

    // Send email notification to submission author
    if (submissionData.author.email && submissionData.author.id !== session.user.id) {
      const emailHtml = render(
        CommentNotificationEmail({
          authorName: submissionData.author.name,
          commenterName: session.user.name || "A workshop member",
          submissionTitle: submissionData.title,
          workshopTitle: workshop.title,
          commentContent: body.content,
          submissionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/workshops/${params.workshopId}/submissions/${params.submissionId}`,
        })
      )

      await resend.emails.send({
        from: "Poetry Workshop <notifications@poetryworkshop.com>",
        to: submissionData.author.email,
        subject: `New comment on your submission in ${workshop.title}`,
        html: emailHtml,
      })
    }

    return NextResponse.json(comment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[COMMENT_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { workshopId: string; submissionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is a member of the workshop
    const member = await db.workshopMember.findFirst({
      where: {
        workshopId: params.workshopId,
        userId: session.user.id,
      },
    })

    if (!member) {
      return new NextResponse("Must be a workshop member to view comments", { status: 403 })
    }

    // Check if submission exists and belongs to the workshop
    const submission = await db.submission.findUnique({
      where: {
        id: params.submissionId,
        workshopId: params.workshopId,
      },
    })

    if (!submission) {
      return new NextResponse("Submission not found", { status: 404 })
    }

    const comments = await db.comment.findMany({
      where: {
        submissionId: params.submissionId,
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
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("[COMMENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { workshopId: string; submissionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { id, content } = commentCreateSchema.parse(json)

    const comment = await db.comment.findUnique({
      where: { id },
      include: { submission: true },
    })

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 })
    }

    if (comment.authorId !== session.user.id) {
      return new NextResponse("Not authorized to edit this comment", { status: 403 })
    }

    if (comment.submission.workshopId !== params.workshopId) {
      return new NextResponse("Comment does not belong to this workshop", { status: 403 })
    }

    const updatedComment = await db.comment.update({
      where: { id },
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

    // Trigger real-time update
    await pusher.trigger(
      `submission-${params.submissionId}`,
      "update-comment",
      updatedComment
    )

    return NextResponse.json(updatedComment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[COMMENT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { workshopId: string; submissionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const commentId = searchParams.get("id")

    if (!commentId) {
      return new NextResponse("Comment ID is required", { status: 400 })
    }

    const comment = await db.comment.findUnique({
      where: { id: commentId },
      include: { submission: true },
    })

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 })
    }

    // Allow comment author or workshop host to delete comments
    const workshop = await db.workshop.findUnique({
      where: { id: params.workshopId },
    })

    if (
      comment.authorId !== session.user.id &&
      workshop?.hostId !== session.user.id
    ) {
      return new NextResponse("Not authorized to delete this comment", { status: 403 })
    }

    if (comment.submission.workshopId !== params.workshopId) {
      return new NextResponse("Comment does not belong to this workshop", { status: 403 })
    }

    await db.comment.delete({
      where: { id: commentId },
    })

    // Trigger real-time update
    await pusher.trigger(
      `submission-${params.submissionId}`,
      "delete-comment",
      { id: commentId }
    )

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[COMMENT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 