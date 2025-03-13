import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { WorkshopList } from "@/components/workshop-list"

export default function WorkshopsPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Poetry Workshops</h1>
          <p className="text-muted-foreground">
            Join a workshop to share and improve your poetry.
          </p>
        </div>
        <Button asChild>
          <Link href="/workshops/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Workshop
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <WorkshopList />
      </div>
    </div>
  )
}

