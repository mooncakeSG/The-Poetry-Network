"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Shield, Trash, UserMinus, UserPlus } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

const workshopFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(500, "Description is too long"),
  isPrivate: z.boolean(),
  maxMembers: z.number().min(2, "Minimum 2 members").max(100, "Maximum 100 members"),
})

type WorkshopFormValues = z.infer<typeof workshopFormSchema>

interface Workshop {
  id: string
  title: string
  description: string
  isPrivate: boolean
  maxMembers: number
  hostId: string
  _count: {
    members: number
  }
}

interface Member {
  id: string
  userId: string
  role: string
  user: {
    id: string
    name: string
    email: string
    image: string
  }
}

export default function WorkshopSettingsPage({ params }: { params: { workshopId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const form = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopFormSchema),
    defaultValues: {
      title: "",
      description: "",
      isPrivate: false,
      maxMembers: 20,
    },
  })

  useEffect(() => {
    async function fetchWorkshopData() {
      try {
        setLoading(true)
        const [workshopRes, membersRes] = await Promise.all([
          fetch(`/api/workshops/${params.workshopId}`),
          fetch(`/api/workshops/${params.workshopId}/members`),
        ])

        if (!workshopRes.ok) {
          throw new Error("Failed to fetch workshop")
        }

        const workshopData = await workshopRes.json()
        setWorkshop(workshopData)
        form.reset({
          title: workshopData.title,
          description: workshopData.description,
          isPrivate: workshopData.isPrivate,
          maxMembers: workshopData.maxMembers,
        })

        if (membersRes.ok) {
          const membersData = await membersRes.json()
          setMembers(membersData)
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
  }, [params.workshopId, form, toast])

  async function onSubmit(data: WorkshopFormValues) {
    if (!session?.user?.id || !workshop) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workshops/${params.workshopId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update workshop")
      }

      const updatedWorkshop = await response.json()
      setWorkshop(updatedWorkshop)

      toast({
        title: "Success",
        description: "Workshop settings updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workshop settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUpdateMemberRole(memberId: string, newRole: string) {
    if (!session?.user?.id || !workshop) return

    try {
      const response = await fetch(
        `/api/workshops/${params.workshopId}/members/${memberId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update member role")
      }

      const updatedMember = await response.json()
      setMembers(members.map((m) => (m.id === memberId ? updatedMember : m)))

      toast({
        title: "Success",
        description: "Member role updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member role. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (!session?.user?.id || !workshop) return

    try {
      const response = await fetch(
        `/api/workshops/${params.workshopId}/members/${memberId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to remove member")
      }

      setMembers(members.filter((m) => m.id !== memberId))

      toast({
        title: "Success",
        description: "Member removed from workshop.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteWorkshop() {
    if (!session?.user?.id || !workshop) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workshops/${params.workshopId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete workshop")
      }

      toast({
        title: "Success",
        description: "Workshop deleted.",
      })

      router.push("/workshops")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workshop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setShowDeleteDialog(false)
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
          <h1 className="text-2xl font-bold">Please sign in to access settings</h1>
        </div>
      </div>
    )
  }

  if (!workshop || workshop.hostId !== session.user.id) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Not authorized</h1>
          <p className="text-muted-foreground">
            Only the workshop host can manage settings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Workshop Settings</h1>
          <p className="text-muted-foreground">
            Manage your workshop settings and members.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workshop Details</CardTitle>
            <CardDescription>
              Update your workshop information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Private Workshop</FormLabel>
                        <FormDescription>
                          Only invited members can join this workshop.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Members</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Current members: {workshop._count.members}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Manage workshop members and their roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={member.user.image} alt={member.user.name} />
                      <AvatarFallback>
                        {member.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{member.role}</Badge>
                    {member.user.id !== workshop.hostId && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleUpdateMemberRole(
                              member.id,
                              member.role === "MEMBER" ? "MODERATOR" : "MEMBER"
                            )
                          }
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Workshop
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Workshop</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this workshop? This action
                    cannot be undone. All members, submissions, and feedback will
                    be permanently deleted.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteWorkshop}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete Workshop
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 