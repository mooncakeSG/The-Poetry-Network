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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Welcome to Poetry Network</h1>
        </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <Link
          href="/write"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Write Poetry{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
              </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Share your poetic creations with the world.
          </p>
        </Link>

        <Link
          href="/workshops"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Join Workshops{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
              </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Collaborate and learn with other poets.
              </p>
                </Link>

        <Link
          href="/search"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Discover{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore poetry from around the world.
          </p>
              </Link>
            </div>

      <div className="relative flex place-items-center">
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Latest Poems</h2>
            {/* Feed component will be added here */}
          </div>
        </div>
    </div>
    </main>
  )
}

