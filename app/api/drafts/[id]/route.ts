import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface TagResponse {
  name: string
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const draft = await prisma.draft.findUnique({
      where: {
        id: params.id,
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
    })

    if (!draft) {
      return new NextResponse('Draft not found', { status: 404 })
    }

    return NextResponse.json({
      ...draft,
      tags: draft.tags.map((tag: TagResponse) => tag.name),
    })
  } catch (error) {
    console.error('Error fetching draft:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { title, content, tags } = await request.json()

    if (!title || !content) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const draft = await prisma.draft.update({
      where: {
        id: params.id,
        authorId: session.user.id,
      },
      data: {
        title,
        content,
        tags: {
          set: [],
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
    console.error('Error updating draft:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    await prisma.draft.delete({
      where: {
        id: params.id,
        authorId: session.user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting draft:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}