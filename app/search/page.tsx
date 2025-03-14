"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { PoemCard } from "@/components/poem-card"
import { type PoemCardData } from "@/types"

const THEMES = [
  "Love",
  "Nature",
  "Life",
  "Death",
  "Hope",
  "Sadness",
  "Joy",
  "Spirituality",
  "Philosophy",
  "Social Justice",
] as const

const FORMS = [
  "Free Verse",
  "Sonnet",
  "Haiku",
  "Limerick",
  "Villanelle",
  "Tanka",
  "Ode",
  "Ballad",
  "Ghazal",
  "Prose Poetry",
] as const

const SORT_OPTIONS = [
  { label: "Most Recent", value: "recent" },
  { label: "Most Liked", value: "likes" },
  { label: "Most Commented", value: "comments" },
] as const

interface SearchFilters {
  query: string
  theme: string
  form: string
  sortBy: string
  minLength: string
  maxLength: string
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [poems, setPoems] = useState<PoemCardData[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || "",
    theme: searchParams.get("theme") || "",
    form: searchParams.get("form") || "",
    sortBy: searchParams.get("sort") || "recent",
    minLength: searchParams.get("min") || "",
    maxLength: searchParams.get("max") || "",
  })

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)

    const params = new URLSearchParams()
    if (filters.query) params.set("q", filters.query)
    if (filters.theme) params.set("theme", filters.theme)
    if (filters.form) params.set("form", filters.form)
    if (filters.sortBy) params.set("sort", filters.sortBy)
    if (filters.minLength) params.set("min", filters.minLength)
    if (filters.maxLength) params.set("max", filters.maxLength)

    try {
      const response = await fetch(`/api/poems/search?${params.toString()}`)
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()

      // Transform API data to match PoemCardData interface
      const transformedPoems: PoemCardData[] = data.map((poem: any) => ({
        ...poem,
        excerpt: poem.content
          .split("\n\n")
          .slice(0, 3)
          .join("\n\n")
          .slice(0, 300),
        likes: poem._count.likes,
        comments: poem._count.comments,
        tags: poem.tags || [],
      }))

      setPoems(transformedPoems)
      router.push(`/search?${params.toString()}`)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search poems..."
              value={filters.query}
              onChange={(e) =>
                setFilters({ ...filters, query: e.target.value })
              }
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with additional filters
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <Select
                    value={filters.theme}
                    onValueChange={(value) =>
                      setFilters({ ...filters, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map((theme) => (
                        <SelectItem key={theme} value={theme.toLowerCase()}>
                          {theme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Form</label>
                  <Select
                    value={filters.form}
                    onValueChange={(value) =>
                      setFilters({ ...filters, form: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMS.map((form) => (
                        <SelectItem key={form} value={form.toLowerCase()}>
                          {form}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilters({ ...filters, sortBy: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Length (lines)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minLength}
                      onChange={(e) =>
                        setFilters({ ...filters, minLength: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxLength}
                      onChange={(e) =>
                        setFilters({ ...filters, maxLength: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={() => handleSearch()}>Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
        </form>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      ) : poems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {poems.map((poem) => (
            <PoemCard key={poem.id} {...poem} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          No poems found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  )
} 