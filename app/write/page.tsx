"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, Loader2, Save, X } from "lucide-react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

const poemFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title must not be longer than 100 characters." }),
  content: z
    .string()
    .min(1, { message: "Content is required." })
    .max(5000, { message: "Content must not be longer than 5000 characters." }),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

type PoemFormValues = z.infer<typeof poemFormSchema>

export default function WritePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [draftSaved, setDraftSaved] = useState(false)

  const form = useForm<PoemFormValues>({
    resolver: zodResolver(poemFormSchema),
    defaultValues: {
      title: "",
      content: "",
      published: false,
      tags: [],
    },
  })

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem("poemDraft")
    if (draft) {
      const parsedDraft = JSON.parse(draft)
      form.reset(parsedDraft)
    }
  }, [form])

  // Auto-save draft
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("poemDraft", JSON.stringify(value))
      setDraftSaved(true)
      const timeout = setTimeout(() => setDraftSaved(false), 2000)
      return () => clearTimeout(timeout)
    })
    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(data: PoemFormValues) {
    if (!session?.user?.id) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/poems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create poem")
      }

      const poem = await response.json()

      // Clear draft from localStorage
      localStorage.removeItem("poemDraft")

      toast({
        title: data.published ? "Poem published" : "Draft saved",
        description: data.published
          ? "Your poem has been published successfully."
          : "Your poem has been saved as a draft.",
      })

      router.push(`/poems/${poem.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save poem. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleAddTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      const currentTags = form.getValues("tags") || []
      if (currentTags.length >= 5) {
        toast({
          title: "Tag limit reached",
          description: "You can only add up to 5 tags.",
          variant: "destructive",
        })
        return
      }
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    const currentTags = form.getValues("tags") || []
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    )
  }

  if (status === "loading") {
    return (
      <div className="container py-8">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to write poems</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Write a Poem</h1>
            <p className="text-muted-foreground">
              Express yourself through words.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {draftSaved && (
              <span className="text-sm text-muted-foreground">Draft saved</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your poem's title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your poem here..."
                      className="min-h-[300px] resize-none font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2">
                {form.watch("tags")?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 rounded-full hover:bg-destructive/20"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag} tag</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                maxLength={30}
              />
              <FormDescription>
                Add up to 5 tags to help others find your poem.
              </FormDescription>
            </div>

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publish</FormLabel>
                    <FormDescription>
                      Make your poem visible to others.
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

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {form.watch("published") ? "Publish" : "Save Draft"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{form.watch("title") || "Untitled"}</DialogTitle>
              <DialogDescription>Preview of your poem</DialogDescription>
            </DialogHeader>
            <div className="prose dark:prose-invert mt-4">
              <div className="whitespace-pre-line">
                {form.watch("content")}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

