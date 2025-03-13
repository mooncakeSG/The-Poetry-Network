import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

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
      return new NextResponse("Must be a workshop member to view submissions", { status: 403 })
    }

    const submission = await db.submission.findUnique({
      where: {
        id: params.submissionId,
        workshopId: params.workshopId,
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

    if (!submission) {
      return new NextResponse("Submission not found", { status: 404 })
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error("[SUBMISSION_GET]", error)
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

    const submission = await db.submission.findUnique({
      where: {
        id: params.submissionId,
        workshopId: params.workshopId,
      },
      include: {
        workshop: true,
      },
    })

    if (!submission) {
      return new NextResponse("Submission not found", { status: 404 })
    }

    // Only allow the author or workshop host to delete submissions
    if (
      submission.authorId !== session.user.id &&
      submission.workshop.hostId !== session.user.id
    ) {
      return new NextResponse("Not authorized to delete this submission", { status: 403 })
    }

    await db.submission.delete({
      where: {
        id: params.submissionId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[SUBMISSION_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 