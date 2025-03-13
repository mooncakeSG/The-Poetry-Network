import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { poemId: string } }
) {
  try {
    const poem = await prisma.poem.findUnique({
      where: { id: params.poemId },
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
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!poem) {
      return NextResponse.json(
        { message: "Poem not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(poem)
  } catch (error) {
    console.error("Error fetching poem:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 