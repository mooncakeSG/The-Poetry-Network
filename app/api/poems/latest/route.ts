import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const poems = await prisma.poem.findMany({
      take: 9,
      orderBy: {
        createdAt: "desc",
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
            likes: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json(poems)
  } catch (error) {
    console.error("Error fetching latest poems:", error)
    return NextResponse.json(
      { error: "Failed to fetch latest poems" },
      { status: 500 }
    )
  }
} 