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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    
    // Validate request body
    const validatedData = poemCreateSchema.parse(body)

    // Create poem with tags
    const poem = await prisma.poem.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        published: validatedData.published,
        authorId: session.user.id,
        tags: {
          connectOrCreate: validatedData.tags?.map((tag) => ({
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
        tags: {
          select: { name: true },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    // Transform the response
    const transformedPoem = {
      ...poem,
      tags: poem.tags.map((tag) => tag.name),
      likes: poem._count.likes,
      comments: poem._count.comments,
      _count: undefined,
    }

    return NextResponse.json(transformedPoem)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating poem:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const session = await getServerSession(authOptions)
    
    const authorId = searchParams.get("authorId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const published = searchParams.get("published") !== "false"
    
    const skip = (page - 1) * limit

    // Only allow users to see their own drafts
    const where = {
      ...(authorId && { authorId }),
      ...(published && { published: true }),
      ...(!published && session?.user?.id === authorId && { published: false }),
    }

    const [poems, total] = await Promise.all([
      prisma.poem.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          tags: {
            select: { name: true },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: session?.user?.id
            ? {
                where: { userId: session.user.id },
                select: { userId: true },
              }
            : false,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.poem.count({ where }),
    ])

    // Transform the poems
    const transformedPoems = poems.map((poem) => ({
      ...poem,
      userLiked: session?.user?.id ? poem.likes.length > 0 : false,
      tags: poem.tags.map((tag) => tag.name),
      likes: poem._count.likes,
      comments: poem._count.comments,
      likes: undefined,
      _count: undefined,
    }))

    return NextResponse.json({
      poems: transformedPoems,
      total,
      hasMore: skip + poems.length < total,
    })
  } catch (error) {
    console.error("Error fetching poems:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 