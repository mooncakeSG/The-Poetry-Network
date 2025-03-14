"use client"

import { useState } from "react"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"

const categories = [
  "All",
  "Nature",
  "Love",
  "Life",
  "Death",
  "Hope",
  "Sadness",
  "Joy",
]

// Mock data - replace with actual data from your backend
const poems = [
  {
    id: 1,
    title: "Whispers in the Wind",
    excerpt:
      "Through rustling leaves and gentle breeze,\nNature's secrets whisper with ease...",
    author: {
      name: "Emily Johnson",
      image: "",
    },
    likes: 45,
    comments: 12,
    category: "Nature",
    publishedAt: "2024-03-15",
  },
  {
    id: 2,
    title: "Love's Journey",
    excerpt:
      "In depths of heart where passion flows,\nA tender love forever grows...",
    author: {
      name: "Michael Rivera",
      image: "",
    },
    likes: 38,
    comments: 8,
    category: "Love",
    publishedAt: "2024-03-14",
  },
]

const poets = [
  {
    id: 1,
    name: "Emily Johnson",
    image: "",
    bio: "Nature poet exploring the beauty of the world",
    poemCount: 45,
    followers: 1200,
  },
  {
    id: 2,
    name: "Michael Rivera",
    image: "",
    bio: "Writing about love and life's journey",
    poemCount: 32,
    followers: 850,
  },
]

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPoems = poems.filter((poem) => {
    const matchesCategory = selectedCategory === "all" || poem.category.toLowerCase() === selectedCategory
    const matchesSearch = searchQuery === "" || 
      poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredPoets = poets.filter((poet) => 
    searchQuery === "" || 
    poet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poet.bio.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="search"
            placeholder="Search poems, poets, or topics..."
            className="sm:max-w-sm"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category.toLowerCase()}
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="poems" className="space-y-6">
          <TabsList>
            <TabsTrigger value="poems">Poems</TabsTrigger>
            <TabsTrigger value="poets">Poets</TabsTrigger>
          </TabsList>

          <TabsContent value="poems" className="space-y-6">
            {filteredPoems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No poems found matching your search criteria.
              </div>
            ) : (
              filteredPoems.map((poem) => (
                <Card key={poem.id} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={poem.author.image} />
                      <AvatarFallback>
                        {poem.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {poem.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {poem.author.name} · {poem.category} ·{" "}
                        {new Date(poem.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="whitespace-pre-line mb-4">{poem.excerpt}</p>
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      {poem.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {poem.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="poets" className="space-y-6">
            {filteredPoets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No poets found matching your search criteria.
              </div>
            ) : (
              filteredPoets.map((poet) => (
                <Card key={poet.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={poet.image} />
                      <AvatarFallback>{poet.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {poet.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {poet.bio}
                          </p>
                        </div>
                        <Button>Follow</Button>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{poet.poemCount} poems</span>
                        <span>{poet.followers} followers</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

