import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  bio: z
    .string()
    .max(160, { message: "Bio must not be longer than 160 characters." })
    .optional(),
  image: z.string().url({ message: "Please enter a valid URL." }).optional(),
})

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = params.userId

    // Fetch user profile with related data
    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        poems: {
          where: { published: true },
          orderBy: { createdAt: "desc" },
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
            likes: session.user.id
              ? {
                  where: { userId: session.user.id },
                  select: { userId: true },
                }
              : false,
          },
        },
        savedPoems: {
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
            likes: session.user.id
              ? {
                  where: { userId: session.user.id },
                  select: { userId: true },
                }
              : false,
          },
        },
        _count: {
          select: {
            poems: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      )
    }

    // Transform the poems to include userLiked and format tags
    const transformedProfile = {
      ...profile,
      poems: profile.poems.map((poem) => ({
        ...poem,
        userLiked: session.user.id ? poem.likes.length > 0 : false,
        tags: poem.tags.map((tag) => tag.name),
        likes: poem._count.likes,
        comments: poem._count.comments,
        likes: undefined, // Remove the likes array from the response
        _count: undefined, // Remove the _count object from the response
      })),
      savedPoems: profile.savedPoems.map((poem) => ({
        ...poem,
        userLiked: session.user.id ? poem.likes.length > 0 : false,
        tags: poem.tags.map((tag) => tag.name),
        likes: poem._count.likes,
        comments: poem._count.comments,
        likes: undefined, // Remove the likes array from the response
        _count: undefined, // Remove the _count object from the response
      })),
    }

    return NextResponse.json(transformedProfile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = params.userId

    // Only allow users to update their own profile
    if (session.user.id !== userId) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await req.json()
    
    // Validate request body
    const validatedData = profileUpdateSchema.parse(body)

    // Update user profile
    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        bio: validatedData.bio,
        image: validatedData.image,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        image: true,
      },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating profile:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 