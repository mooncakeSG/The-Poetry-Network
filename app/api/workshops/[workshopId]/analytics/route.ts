import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

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
      return new NextResponse("Must be a workshop member to view analytics", { status: 403 })
    }

    // Get workshop details
    const workshop = await db.workshop.findUnique({
      where: { id: params.workshopId },
      include: {
        _count: {
          select: {
            members: true,
            submissions: true,
          },
        },
      },
    })

    if (!workshop) {
      return new NextResponse("Workshop not found", { status: 404 })
    }

    // Get submission stats
    const submissionStats = await db.submission.groupBy({
      by: ['authorId'],
      where: {
        workshopId: params.workshopId,
      },
      _count: true,
    })

    // Get comment stats
    const commentStats = await db.comment.groupBy({
      by: ['authorId'],
      where: {
        submission: {
          workshopId: params.workshopId,
        },
      },
      _count: true,
    })

    // Get recent activity
    const recentActivity = await db.submission.findMany({
      where: {
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
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })

    // Calculate engagement metrics
    const totalMembers = workshop._count.members
    const totalSubmissions = workshop._count.submissions
    const averageSubmissionsPerMember = totalMembers ? totalSubmissions / totalMembers : 0
    const activeMembers = submissionStats.length
    const engagementRate = totalMembers ? (activeMembers / totalMembers) * 100 : 0

    return NextResponse.json({
      overview: {
        totalMembers,
        totalSubmissions,
        averageSubmissionsPerMember,
        engagementRate,
      },
      submissionStats,
      commentStats,
      recentActivity,
    })
  } catch (error) {
    console.error("[ANALYTICS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 