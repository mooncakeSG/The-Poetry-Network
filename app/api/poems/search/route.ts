import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const theme = searchParams.get("theme")
    const form = searchParams.get("form")
    const sortBy = searchParams.get("sort") || "recent"
    const minLength = parseInt(searchParams.get("min") || "0")
    const maxLength = parseInt(searchParams.get("max") || "999999")

    // Build the where clause based on filters
    const where = {
      AND: [
        // Full-text search on title and content
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        // Theme filter
        ...(theme
          ? [
              {
                tags: {
                  some: {
                    name: { equals: theme, mode: "insensitive" },
                  },
                },
              },
            ]
          : []),
        // Form filter
        ...(form
          ? [
              {
                form: { equals: form, mode: "insensitive" },
              },
            ]
          : []),
        // Length filter (count lines in content)
        {
          content: {
            raw: `length(regexp_split_to_array(content, E'\\n')) BETWEEN ${minLength} AND ${maxLength}`,
          },
        },
      ],
    }

    // Build the orderBy clause based on sort option
    const orderBy = {
      ...(sortBy === "likes"
        ? { likes: { _count: "desc" } }
        : sortBy === "comments"
        ? { comments: { _count: "desc" } }
        : { createdAt: "desc" }),
    }

    const poems = await prisma.poem.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      take: 20,
    })

    return NextResponse.json(poems)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to search poems" },
      { status: 500 }
    )
  }
} 