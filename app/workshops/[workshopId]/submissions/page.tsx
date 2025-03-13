"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Workshop {
  id: string
  title: string
  hostId: string
}

interface Submission {
  id: string
  title: string
  content: string
  notes: string | null
  createdAt: string
  author: {
    id: string
    name: string
    image: string | null
  }
  _count: {
    comments: number
  }
}

type SortOption = "newest" | "oldest" | "most-comments" | "least-comments" | "author-asc" | "author-desc" | "title-asc" | "title-desc"

export default function SubmissionsPage({ params }: { params: { workshopId: string } }) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [workshopRes, submissionsRes] = await Promise.all([
          fetch(`/api/workshops/${params.workshopId}`),
          fetch(
            `/api/workshops/${params.workshopId}/submissions?` +
              new URLSearchParams({
                page: page.toString(),
                limit: itemsPerPage.toString(),
                sort: sortBy,
                search: searchQuery,
              })
          ),
        ])

        if (!workshopRes.ok || !submissionsRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const [workshopData, submissionsData] = await Promise.all([
          workshopRes.json(),
          submissionsRes.json(),
        ])

        setWorkshop(workshopData)
        setSubmissions((prev) =>
          page === 1 ? submissionsData.submissions : [...prev, ...submissionsData.submissions]
        )
        setHasMore(submissionsData.hasMore)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load workshop data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.workshopId, page, sortBy, searchQuery, toast])

  const filteredSubmissions = submissions.filter((submission) =>
    submission.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-24" />
          </div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to view submissions</h1>
        </div>
      </div>
    )
  }

  if (!workshop) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Workshop not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Workshop Submissions</h1>
            <p className="text-muted-foreground">
              View and discuss poems submitted to {workshop.title}
            </p>
          </div>
          <Button asChild>
            <Link href={`/workshops/${params.workshopId}/submit`}>
              <Plus className="mr-2 h-4 w-4" />
              Submit Poem
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-comments">Most Comments</SelectItem>
              <SelectItem value="least-comments">Least Comments</SelectItem>
              <SelectItem value="author-asc">Author (A-Z)</SelectItem>
              <SelectItem value="author-desc">Author (Z-A)</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <p className="mb-4 text-muted-foreground">
                {searchQuery
                  ? "No submissions match your search."
                  : "No poems have been submitted to this workshop yet."}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href={`/workshops/${params.workshopId}/submit`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Submit the First Poem
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/workshops/${params.workshopId}/submissions/${submission.id}`}
                      className="hover:underline"
                    >
                      <CardTitle>{submission.title}</CardTitle>
                    </Link>
                    <Badge variant="secondary">
                      {formatDistanceToNow(new Date(submission.createdAt), {
                        addSuffix: true,
                      })}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={submission.author.image || ""}
                        alt={submission.author.name}
                      />
                      <AvatarFallback>
                        {submission.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{submission.author.name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 whitespace-pre-line font-mono">
                    {submission.content}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{submission._count.comments}</span>
                    </div>
                    {submission.notes && (
                      <Badge variant="outline">Has Notes</Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}

            {hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 