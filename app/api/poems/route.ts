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
    const { title, content, mood } = body

    const poem = await prisma.poem.create({
      data: {
        title,
        content,
        mood,
        authorId: session.user.id,
      },
    })

    return NextResponse.json(poem)
  } catch (error) {
    console.error("Error creating poem:", error)
    return NextResponse.json(
      { error: "Failed to create poem" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const poems = await prisma.poem.findMany({
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(poems)
  } catch (error) {
    console.error("Error fetching poems:", error)
    return NextResponse.json(
      { error: "Failed to fetch poems" },
      { status: 500 }
    )
  }
} 