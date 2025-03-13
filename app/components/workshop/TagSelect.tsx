import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

interface Tag {
  id: string
  name: string
  _count: {
    workshops: number
  }
}

interface TagSelectProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function TagSelect({ selectedTags, onTagsChange }: TagSelectProps) {
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/workshops/tags")
        if (!response.ok) {
          throw new Error("Failed to fetch tags")
        }
        const data = await response.json()
        setTags(data)
      } catch (error) {
        console.error("Error fetching tags:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((id) => id !== tagId))
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={loading}
          >
            {loading
              ? "Loading tags..."
              : selectedTags.length === 0
              ? "Select tags"
              : `${selectedTags.length} tag(s) selected`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => toggleTag(tag.id)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedTags.includes(tag.id)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  {tag.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {tag._count.workshops} workshop(s)
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId)
          if (!tag) return null
          return (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => removeTag(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )
        })}
      </div>
    </div>
  )
} 