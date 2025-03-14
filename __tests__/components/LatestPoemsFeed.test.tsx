import { render, screen, waitFor } from "@testing-library/react"
import { LatestPoemsFeed } from "@/app/components/LatestPoemsFeed"
import { server } from "@/mocks/server"
import { http, HttpResponse } from "msw"

const mockPoems = [
  {
    id: "1",
    title: "Test Poem",
    content: "Test content\nWith multiple lines\nOf poetry",
    createdAt: new Date().toISOString(),
    author: {
      id: "1",
      name: "Test Author",
      image: null,
    },
    likes: 5,
    comments: 3,
    tags: ["nature", "love"],
    excerpt: "Test content...",
  },
]

describe("LatestPoemsFeed", () => {
  it("renders loading state initially", () => {
    render(<LatestPoemsFeed />)
    expect(screen.getByTestId("poems-loading")).toBeInTheDocument()
  })

  it("renders poems after successful fetch", async () => {
    server.use(
      http.get("/api/poems/latest", () => {
        return HttpResponse.json(mockPoems)
      })
    )

    render(<LatestPoemsFeed />)

    await waitFor(() => {
      expect(screen.getByText("Test Poem")).toBeInTheDocument()
      expect(screen.getByText("Test Author")).toBeInTheDocument()
      expect(screen.getByText("Test content...")).toBeInTheDocument()
    })
  })

  it("renders error message when fetch fails", async () => {
    server.use(
      http.get("/api/poems/latest", () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(<LatestPoemsFeed />)

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch poems/i)).toBeInTheDocument()
    })
  })

  it("renders empty state when no poems are available", async () => {
    server.use(
      http.get("/api/poems/latest", () => {
        return HttpResponse.json([])
      })
    )

    render(<LatestPoemsFeed />)

    await waitFor(() => {
      expect(screen.getByText(/no poems available/i)).toBeInTheDocument()
    })
  })
}) 