"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface WorkshopActionsProps {
  workshopId: string
  isParticipant: boolean
  isFull: boolean
}

export default function WorkshopActions({
  workshopId,
  isParticipant,
  isFull,
}: WorkshopActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleJoinWorkshop = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/workshops/${workshopId}/participants`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to join workshop")
      }

      toast({
        title: "Success",
        description: "You have joined the workshop",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join workshop",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveWorkshop = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/workshops/${workshopId}/participants`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to leave workshop")
      }

      toast({
        title: "Success",
        description: "You have left the workshop",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave workshop",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isParticipant) {
    return (
      <Button
        variant="destructive"
        onClick={handleLeaveWorkshop}
        disabled={loading}
      >
        {loading ? "Leaving..." : "Leave Workshop"}
      </Button>
    )
  }

  return (
    <Button onClick={handleJoinWorkshop} disabled={loading || isFull}>
      {loading ? "Joining..." : isFull ? "Workshop Full" : "Join Workshop"}
    </Button>
  )
} 