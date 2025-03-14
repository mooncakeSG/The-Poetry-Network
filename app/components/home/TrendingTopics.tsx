"use client"

import Link from "next/link"
import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { TrendingUp } from "lucide-react"

interface Topic {
  name: string
  count: number
  trend: "up" | "down" | "stable"
  color: "default" | "purple" | "blue" | "green" | "yellow" | "red"
}

const trendingTopics: Topic[] = [
  { name: "Nature", count: 1234, trend: "up", color: "green" },
  { name: "Love", count: 987, trend: "up", color: "red" },
  { name: "Life", count: 876, trend: "stable", color: "blue" },
  { name: "Dreams", count: 765, trend: "up", color: "purple" },
  { name: "Hope", count: 654, trend: "stable", color: "yellow" },
  { name: "Healing", count: 543, trend: "up", color: "default" },
  { name: "Ocean", count: 432, trend: "up", color: "blue" },
  { name: "Mindfulness", count: 321, trend: "up", color: "purple" }
]

export function TrendingTopics() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-purple-500" />
        <h2 className="font-semibold text-xl">Trending Topics</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {trendingTopics.map((topic) => (
          <Link
            key={topic.name}
            href={`/topics/${topic.name.toLowerCase()}`}
            className="group transition-transform hover:-translate-y-1"
          >
            <Badge
              variant="outline"
              className={`
                px-3 py-1 text-sm font-medium cursor-pointer
                ${topic.color === "purple" && "border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700"}
                ${topic.color === "blue" && "border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700"}
                ${topic.color === "green" && "border-green-200 bg-green-50 hover:bg-green-100 text-green-700"}
                ${topic.color === "yellow" && "border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700"}
                ${topic.color === "red" && "border-red-200 bg-red-50 hover:bg-red-100 text-red-700"}
                ${topic.color === "default" && "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"}
              `}
            >
              #{topic.name}
              <span className="ml-1 text-xs opacity-60">
                {topic.count.toLocaleString()}
              </span>
            </Badge>
          </Link>
        ))}
      </div>
    </Card>
  )
} 