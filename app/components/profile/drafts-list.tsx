'use client'

import { Card } from "@/components/ui/card"
import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Draft {
  id: number
  title: string
  excerpt: string
  lastModified: string
}

interface DraftsListProps {
  userId: string
}

// Mock data - replace with actual data from your backend
const drafts: Draft[] = [
  {
    id: 1,
    title: "Untitled Poem #1",
    excerpt: "First draft of a new piece about...",
    lastModified: "2024-03-18",
  },
  {
    id: 2,
    title: "Memories of Summer",
    excerpt: "A reflection on childhood summers...",
    lastModified: "2024-03-16",
  },
]

export function DraftsList({ userId }: DraftsListProps) {
  return (
    <div className="space-y-6">
      {drafts.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No drafts yet</p>
        </Card>
      ) : (
        drafts.map((draft) => (
          <Card key={draft.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{draft.title}</h3>
                <p className="text-muted-foreground">{draft.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Last modified: {new Date(draft.lastModified).toLocaleDateString()}
            </div>
          </Card>
        ))
      )}
    </div>
  )
} 