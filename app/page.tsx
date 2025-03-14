"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { PoemCard } from "@/components/poem-card"
import { LatestPoemsFeed } from "./components/LatestPoemsFeed"

interface Poem {
  id: string
  title: string
  content: string
  createdAt: string
  userLiked: boolean
  author: {
    id: string
    name: string
    image: string | null
  }
  _count: {
    likes: number
    comments: number
  }
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-24">
      <div className="z-10 w-full max-w-5xl space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold">Welcome to Poetry Network</h1>
        </div>

        <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/write"
            className="group rounded-lg border border-transparent p-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            <h2 className="mb-2 text-xl md:text-2xl font-semibold">
              Write Poetry{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="text-sm opacity-70">
              Share your poetic creations with the world.
            </p>
          </Link>

          <Link
            href="/workshops"
            className="group rounded-lg border border-transparent p-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            <h2 className="mb-2 text-xl md:text-2xl font-semibold">
              Join Workshops{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="text-sm opacity-70">
              Collaborate and learn with other poets.
            </p>
          </Link>

          <Link
            href="/search"
            className="group rounded-lg border border-transparent p-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            <h2 className="mb-2 text-xl md:text-2xl font-semibold">
              Discover{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="text-sm opacity-70">
              Explore poetry from around the world.
            </p>
          </Link>
        </div>

        <div className="w-full">
          <h2 className="mb-4 text-2xl font-semibold">Latest Poems</h2>
          <LatestPoemsFeed />
        </div>
      </div>
    </main>
  )
}

