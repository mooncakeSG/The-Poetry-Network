import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const poemCreateSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title must not be longer than 100 characters." }),
  content: z
    .string()
    .min(1, { message: "Content is required." })
    .max(5000, { message: "Content must not be longer than 5000 characters." }),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, tags, workshopId } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const poem = await prisma.poem.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        workshopId,
        tags: {
          connectOrCreate: tags?.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: true,
      },
    })

    return NextResponse.json(poem)
  } catch (error) {
    console.error("Create Poem API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const sort = searchParams.get("sort") || "latest"
  const filter = searchParams.get("filter") || "all"
  const tag = searchParams.get("tag")
  const query = searchParams.get("q")

  try {
    const session = await getServerSession(authOptions)
    const skip = (page - 1) * limit

    let where = {
      published: true,
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      }),
      ...(tag && {
        tags: {
          some: {
            name: tag,
          },
        },
      }),
      ...(filter === "following" && session?.user && {
        author: {
          followers: {
            some: {
              followerId: session.user.id,
            },
          },
        },
      }),
    }

    let orderBy = {}
    switch (sort) {
      case "trending":
        orderBy = { likes: { _count: "desc" } }
        break
      case "most_liked":
        orderBy = { likes: { _count: "desc" } }
        break
      case "most_commented":
        orderBy = { comments: { _count: "desc" } }
        break
      default:
        orderBy = { createdAt: "desc" }
    }

    const [poems, total] = await Promise.all([
      prisma.poem.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          tags: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      prisma.poem.count({ where }),
    ])

    return NextResponse.json({
      poems,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Poems API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 