"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Copy, Loader2, RefreshCw, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

const inviteFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

type InviteFormValues = z.infer<typeof inviteFormSchema>

interface Workshop {
  id: string
  title: string
  description: string
  isPrivate: boolean
  maxMembers: number
  createdAt: string
  host: {
    id: string
    name: string
    image: string
  }
  _count: {
    members: number
    submissions: number
  }
}

interface Invitation {
  id: string
  email: string | null
  code: string
  status: string
  expiresAt: string
  createdAt: string
  invitedUser: {
    id: string
    name: string
    image: string
  } | null
}

interface User {
  id: string
  name: string
  email: string
  image: string
}

export default function WorkshopInvitePage({ params }: { params: { workshopId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [inviteLink, setInviteLink] = useState("")

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
    },
  })

  useEffect(() => {
    async function fetchWorkshopData() {
      try {
        setLoading(true)
        const [workshopRes, invitationsRes] = await Promise.all([
          fetch(`/api/workshops/${params.workshopId}`),
          fetch(`/api/workshops/${params.workshopId}/invitations`),
        ])

        if (!workshopRes.ok) {
          throw new Error("Failed to fetch workshop")
        }

        const workshopData = await workshopRes.json()
        setWorkshop(workshopData)

        if (invitationsRes.ok) {
          const invitationsData = await invitationsRes.json()
          setInvitations(invitationsData)
        }
      } catch (error) {
        console.error("Error fetching workshop data:", error)
        toast({
          title: "Error",
          description: "Failed to load workshop data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshopData()
  }, [params.workshopId, toast])

  useEffect(() => {
    async function searchUsers() {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data)
        }
      } catch (error) {
        console.error("Error searching users:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchUsers, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  async function onSubmit(data: InviteFormValues) {
    if (!session?.user?.id || !workshop) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workshops/${params.workshopId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      })

      if (!response.ok) {
        throw new Error("Failed to send invitation")
      }

      const newInvitation = await response.json()
      setInvitations([newInvitation, ...invitations])
      form.reset()

      toast({
        title: "Invitation sent",
        description: "An invitation email has been sent.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleInviteUser(userId: string) {
    if (!session?.user?.id || !workshop) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workshops/${params.workshopId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to send invitation")
      }

      const newInvitation = await response.json()
      setInvitations([newInvitation, ...invitations])
      setShowUserSearch(false)

      toast({
        title: "Invitation sent",
        description: "The user has been invited to join the workshop.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCancelInvitation(invitationId: string) {
    if (!session?.user?.id || !workshop) return

    try {
      const response = await fetch(
        `/api/workshops/${params.workshopId}/invitations/${invitationId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to cancel invitation")
      }

      setInvitations(invitations.filter((inv) => inv.id !== invitationId))

      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleGenerateInviteLink() {
    if (!session?.user?.id || !workshop) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workshops/${params.workshopId}/invite-link`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate invite link")
      }

      const data = await response.json()
      setInviteLink(data.link)

      toast({
        title: "Invite link generated",
        description: "The invite link has been generated and copied to your clipboard.",
      })

      await navigator.clipboard.writeText(data.link)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invite link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to access invites</h1>
        </div>
      </div>
    )
  }

  if (!workshop || workshop.host.id !== session.user.id) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Not authorized</h1>
          <p className="text-muted-foreground">
            Only the workshop host can manage invitations.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Invite Members</h1>
          <p className="text-muted-foreground">
            Invite people to join your workshop.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invite Link</CardTitle>
            <CardDescription>
              Generate a link that anyone can use to join the workshop.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inviteLink ? (
              <div className="flex items-center gap-2">
                <Input value={inviteLink} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink)
                    toast({
                      title: "Copied",
                      description: "Invite link copied to clipboard.",
                    })
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleGenerateInviteLink}
                  disabled={isSubmitting}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGenerateInviteLink}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Invite Link
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite by Email</CardTitle>
            <CardDescription>
              Send an email invitation to join the workshop.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter email address"
                            {...field}
                          />
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Send
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
            <CardDescription>
              Find and invite existing users to your workshop.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Popover open={showUserSearch} onOpenChange={setShowUserSearch}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={showUserSearch}
                  className="w-full justify-between"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search for users...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search users..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandGroup>
                    {isSearching ? (
                      <div className="flex justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      searchResults.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.id}
                          onSelect={() => handleInviteUser(user.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user.image} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                            <span className="text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              Manage sent invitations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invitations.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No pending invitations
                </p>
              ) : (
                invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {invitation.invitedUser ? (
                        <>
                          <Avatar>
                            <AvatarImage
                              src={invitation.invitedUser.image}
                              alt={invitation.invitedUser.name}
                            />
                            <AvatarFallback>
                              {invitation.invitedUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {invitation.invitedUser.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Invited on{" "}
                              {new Date(invitation.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited on{" "}
                            {new Date(invitation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{invitation.status}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCancelInvitation(invitation.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 