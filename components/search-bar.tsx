"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Tag {
  name: string
  count: number
}

interface SearchBarProps {
  onSearch: (params: {
    query: string
    sort: string
    filter: string
    tag?: string
  }) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || "latest")
  const [filter, setFilter] = useState(searchParams.get("filter") || "all")
  const [popularTags, setPopularTags] = useState<Tag[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | undefined>(
    searchParams.get("tag") || undefined
  )

  useEffect(() => {
    // Fetch popular tags on component mount
    setIsLoadingTags(true)
    fetch("/api/search?limit=5")
      .then((res) => res.json())
      .then((data) => {
        if (data.popularTags) {
          setPopularTags(data.popularTags)
        }
      })
      .catch((error) => console.error("Error fetching tags:", error))
      .finally(() => setIsLoadingTags(false))
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSearch({
      query,
      sort,
      filter,
      tag: selectedTag,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search poems..."
            className="pl-9"
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="most_liked">Most Liked</SelectItem>
            <SelectItem value="most_commented">Most Commented</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Poems</SelectItem>
            {session && (
              <SelectItem value="following">Following</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {!isLoadingTags && popularTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Badge
              key={tag.name}
              variant={selectedTag === tag.name ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() =>
                setSelectedTag(
                  selectedTag === tag.name ? undefined : tag.name
                )
              }
            >
              {tag.name}
              <span className="ml-1 text-xs">({tag.count})</span>
            </Badge>
          ))}
        </div>
      )}
    </form>
  )
} 