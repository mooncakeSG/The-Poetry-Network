import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const feedbackCreateSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Content is required." })
    .max(1000, { message: "Content must not be longer than 1000 characters." }),
})

export async function POST(
  req: Request,
  { params }: { params: { workshopId: string; submissionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is a member of the workshop
    const member = await prisma.workshopMember.findUnique({
      where: {
        userId_workshopId: {
          userId: session.user.id,
          workshopId: params.workshopId,
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        { message: "Must be a workshop member to provide feedback" },
        { status: 403 }
      )
    }

    // Check if submission exists and belongs to the workshop
    const submission = await prisma.workshopSubmission.findUnique({
      where: {
        id: params.submissionId,
        workshopId: params.workshopId,
      },
    })

    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 }
      )
    }

    // Check if submission is in SUBMITTED state
    if (submission.status !== "SUBMITTED") {
      return NextResponse.json(
        { message: "Can only provide feedback on submitted poems" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const validatedData = feedbackCreateSchema.parse(body)

    const feedback = await prisma.workshopFeedback.create({
      data: {
        content: validatedData.content,
        authorId: member.id,
        submissionId: params.submissionId,
      },
      include: {
        author: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating feedback:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: { workshopId: string; submissionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    
    const skip = (page - 1) * limit

    // Check if user can view feedback
    const workshop = await prisma.workshop.findUnique({
      where: { id: params.workshopId },
      select: {
        isPrivate: true,
        hostId: true,
        members: {
          where: session?.user?.id
            ? { userId: session.user.id }
            : undefined,
        },
      },
    })

    if (!workshop) {
      return NextResponse.json(
        { message: "Workshop not found" },
        { status: 404 }
      )
    }

    if (
      workshop.isPrivate &&
      workshop.hostId !== session?.user?.id &&
      workshop.members.length === 0
    ) {
      return NextResponse.json(
        { message: "Not authorized to view feedback" },
        { status: 403 }
      )
    }

    // Check if submission exists and belongs to the workshop
    const submission = await prisma.workshopSubmission.findUnique({
      where: {
        id: params.submissionId,
        workshopId: params.workshopId,
      },
    })

    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 }
      )
    }

    const [feedback, total] = await Promise.all([
      prisma.workshopFeedback.findMany({
        where: { submissionId: params.submissionId },
        include: {
          author: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.workshopFeedback.count({
        where: { submissionId: params.submissionId },
      }),
    ])

    return NextResponse.json({
      feedback,
      total,
      hasMore: skip + feedback.length < total,
    })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 