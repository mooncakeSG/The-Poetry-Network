"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { SearchBar } from "@/components/search-bar"
import { PoemCard } from "@/components/poem-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Poem {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    image: string
  }
  likes: number
  comments: number
  isLiked: boolean
  tags: string[]
  createdAt: string
}

interface SearchResults {
  poems: Poem[]
  total: number
  page: number
  totalPages: number
  popularTags: { name: string; count: number }[]
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  async function fetchResults(params: {
    query: string
    sort: string
    filter: string
    tag?: string
    page?: number
  }) {
    setLoading(true)
    try {
      const searchUrl = new URL("/api/search", window.location.origin)
      searchUrl.searchParams.set("q", params.query)
      searchUrl.searchParams.set("sort", params.sort)
      searchUrl.searchParams.set("filter", params.filter)
      if (params.tag) searchUrl.searchParams.set("tag", params.tag)
      if (params.page) searchUrl.searchParams.set("page", params.page.toString())

      const response = await fetch(searchUrl.toString())
      const data = await response.json()
      setResults(data)
      
      // Update URL with search parameters
      const url = new URL(window.location.href)
      url.searchParams.set("q", params.query)
      url.searchParams.set("sort", params.sort)
      url.searchParams.set("filter", params.filter)
      if (params.tag) url.searchParams.set("tag", params.tag)
      if (params.page) url.searchParams.set("page", params.page.toString())
      router.push(url.pathname + url.search)
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial search based on URL parameters
    const query = searchParams.get("q") || ""
    const sort = searchParams.get("sort") || "latest"
    const filter = searchParams.get("filter") || "all"
    const tag = searchParams.get("tag") || undefined
    const page = parseInt(searchParams.get("page") || "1")
    
    setCurrentPage(page)
    fetchResults({ query, sort, filter, tag, page })
  }, [searchParams])

  function handleSearch(params: {
    query: string
    sort: string
    filter: string
    tag?: string
  }) {
    setCurrentPage(1)
    fetchResults({ ...params, page: 1 })
  }

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage)
    fetchResults({
      query: searchParams.get("q") || "",
      sort: searchParams.get("sort") || "latest",
      filter: searchParams.get("filter") || "all",
      tag: searchParams.get("tag") || undefined,
      page: newPage,
    })
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Search Poems</h1>
      <SearchBar onSearch={handleSearch} />
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : results?.poems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No poems found
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results?.poems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
          
          {results && results.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === results.totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 