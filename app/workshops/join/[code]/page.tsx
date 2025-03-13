"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface Workshop {
  id: string
  title: string
  description: string
  host: {
    name: string
  }
}

export default function JoinWorkshopPage({ params }: { params: { code: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    async function validateInvitation() {
      try {
        const response = await fetch(`/api/workshops/invitations/${params.code}`)
        if (!response.ok) {
          throw new Error("Invalid or expired invitation")
        }

        const data = await response.json()
        setWorkshop(data.workshop)
      } catch (error) {
        console.error("Error validating invitation:", error)
        toast({
          title: "Error",
          description: "This invitation is invalid or has expired.",
          variant: "destructive",
        })
        router.push("/workshops")
      } finally {
        setLoading(false)
      }
    }

    validateInvitation()
  }, [params.code, router, toast])

  async function handleJoin() {
    if (!session?.user?.id || !workshop) return

    setJoining(true)
    try {
      const response = await fetch(`/api/workshops/join/${params.code}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to join workshop")
      }

      toast({
        title: "Success",
        description: "You have joined the workshop.",
      })

      router.push(`/workshops/${workshop.id}`)
    } catch (error) {
      console.error("Error joining workshop:", error)
      toast({
        title: "Error",
        description: "Failed to join workshop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setJoining(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                Please sign in to join this workshop.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => router.push("/sign-in")}
              >
                Sign in
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!workshop) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Join Workshop</CardTitle>
            <CardDescription>
              You have been invited to join this workshop.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">{workshop.title}</h3>
              <p className="text-sm text-muted-foreground">
                Hosted by {workshop.host.name}
              </p>
            </div>
            <p className="text-sm">{workshop.description}</p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleJoin}
              disabled={joining}
            >
              {joining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Join Workshop
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 