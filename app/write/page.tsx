"use client"

import { useState } from "react"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Save, Send } from "lucide-react"

const categories = [
  "Nature",
  "Love",
  "Life",
  "Death",
  "Hope",
  "Sadness",
  "Joy",
  "Other",
]

export default function WritePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")

  const handleSaveDraft = () => {
    // Implement draft saving logic
    console.log("Saving draft:", { title, content, category })
  }

  const handlePublish = () => {
    // Implement publish logic
    console.log("Publishing:", { title, content, category })
  }

  return (
    <div className="container py-8 max-w-3xl">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-6">Write a Poem</h1>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="text-xl font-semibold mb-4"
            />
            <Textarea
              placeholder="Start writing your poem..."
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              className="min-h-[400px] resize-none font-serif text-lg leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2 sm:ml-auto">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handlePublish}>
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

