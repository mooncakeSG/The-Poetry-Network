import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface TagResponse {
  name: string
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const drafts = await prisma.draft.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        workshop: {
          select: {
            title: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(
      drafts.map((draft) => ({
        ...draft,
        tags: draft.tags.map((tag: TagResponse) => tag.name),
      }))
    )
  } catch (error) {
    console.error('Error fetching drafts:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { title, content, tags, workshopId } = await request.json()

    if (!title || !content) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const draft = await prisma.draft.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: session.user.id,
          },
        },
        ...(workshopId && {
          workshop: {
            connect: {
              id: workshopId,
            },
          },
        }),
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        workshop: {
          select: {
            title: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      ...draft,
      tags: draft.tags.map((tag: TagResponse) => tag.name),
    })
  } catch (error) {
    console.error('Error creating draft:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 