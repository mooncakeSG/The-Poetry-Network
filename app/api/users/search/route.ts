import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface SearchResponse {
  users: Array<{
    id: string
    name: string | null
    email: string | null
    image: string | null
    bio: string | null
    _count: {
      poems: number
      followers: number
      following: number
      workshops: number
    }
  }>
  total: number
  page: number
  totalPages: number
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    if (!query) {
      return NextResponse.json<SearchResponse>({ users: [], total: 0, page: 1, totalPages: 0 })
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { bio: { contains: query } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          _count: {
            select: {
              poems: true,
              followers: true,
              following: true,
              workshops: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          followers: {
            _count: 'desc',
          },
        },
      }),
      prisma.user.count({
        where: {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { bio: { contains: query } },
          ],
        },
      }),
    ])

    return NextResponse.json<SearchResponse>({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error searching users:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 