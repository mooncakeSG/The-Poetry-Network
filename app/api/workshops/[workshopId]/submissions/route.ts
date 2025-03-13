import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const submissionCreateSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(5000),
  notes: z.string().max(500).optional(),
})

export async function POST(
  req: Request,
  { params }: { params: { workshopId: string } }
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
      return new NextResponse("Must be a workshop member to submit", { status: 403 })
    }

    const json = await req.json()
    const body = submissionCreateSchema.parse(json)

    const submission = await db.submission.create({
      data: {
        title: body.title,
        content: body.content,
        notes: body.notes,
        authorId: session.user.id,
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    return NextResponse.json(submission)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[SUBMISSION_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { workshopId: string } }
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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sort = searchParams.get("sort") || "newest"
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    // Build where clause
    const where = {
      workshopId: params.workshopId,
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),
    }

    // Build orderBy based on sort option
    let orderBy: any = { createdAt: "desc" }
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      case "most-comments":
        orderBy = { comments: { _count: "desc" } }
        break
      case "least-comments":
        orderBy = { comments: { _count: "asc" } }
        break
      case "author-asc":
        orderBy = { author: { name: "asc" } }
        break
      case "author-desc":
        orderBy = { author: { name: "desc" } }
        break
      case "title-asc":
        orderBy = { title: "asc" }
        break
      case "title-desc":
        orderBy = { title: "desc" }
        break
      default:
        orderBy = { createdAt: "desc" }
    }

    const [submissions, total] = await Promise.all([
      db.submission.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.submission.count({ where }),
    ])

    return NextResponse.json({
      submissions,
      total,
      hasMore: skip + submissions.length < total,
    })
  } catch (error) {
    console.error("[SUBMISSIONS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 