import { Book } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PoetImageLoader } from "./PoetImageLoader"

const poets = [
  {
    name: "Edgar Allan Poe",
    image: "/images/poets/poe.jpg",
    quote: "All that we see or seem is but a dream within a dream.",
    years: "1809-1849",
    background: "/images/poets/poe-bg.jpg"
  },
  {
    name: "Sylvia Plath",
    image: "/images/poets/plath.jpg",
    quote: "I took a deep breath and listened to the old brag of my heart: I am, I am, I am.",
    years: "1932-1963",
    background: "/images/poets/plath-bg.jpg"
  },
  {
    name: "Maya Angelou",
    image: "/images/poets/angelou.jpg",
    quote: "There is no greater agony than bearing an untold story inside you.",
    years: "1928-2014",
    background: "/images/poets/angelou-bg.jpg"
  }
]

export function FeaturedPoets() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Book className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Featured Poets</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {poets.map((poet) => (
          <Card key={poet.name} className="overflow-hidden group">
            <PoetImageLoader
              name={poet.name}
              imageUrl={poet.image}
              backgroundUrl={poet.background}
              className="h-[200px]"
            />
            <div className="p-4">
              <p className="text-sm text-muted-foreground mt-2 italic">
                "{poet.quote}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">{poet.years}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 