import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") || "all"
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      )
    }

    const results = await Promise.all([
      // Search poems
      type === "all" || type === "poems"
        ? prisma.poem.findMany({
            where: {
              published: true,
              OR: [
                { title: { contains: query } },
                { content: { contains: query } },
              ],
            },
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
              ...(session?.user && {
                likes: {
                  where: { userId: session.user.id },
                  select: { userId: true },
                },
              }),
            },
          })
        : [],

      // Search users
      type === "all" || type === "users"
        ? prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: query } },
                { email: { contains: query } },
              ],
            },
            take: limit,
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
                },
              },
            },
          })
        : [],

      // Search tags
      type === "all" || type === "tags"
        ? prisma.tag.findMany({
            where: {
              name: { contains: query },
            },
            take: limit,
            include: {
              _count: {
                select: {
                  poems: true,
                },
              },
            },
          })
        : [],
    ])

    return NextResponse.json({
      poems: results[0],
      users: results[1],
      tags: results[2],
    })
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GETMockTags(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "10")

  try {
    // For now, return some mock tags until we implement tag functionality
    const mockTags = [
      { name: "Nature", count: 42 },
      { name: "Love", count: 38 },
      { name: "Life", count: 35 },
      { name: "Hope", count: 28 },
      { name: "Dreams", count: 25 },
    ].slice(0, limit)

    return NextResponse.json({
      popularTags: mockTags,
    })
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 