"use client"

import { ExternalLink, Phone, MessageCircle, Heart, Calendar, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

interface Resource {
  name: string
  description: string
  phone?: string
  url: string
  icon: "phone" | "chat" | "heart"
  urgent?: boolean
}

const resources: Resource[] = [
  {
    name: "National Suicide Prevention Lifeline",
    description: "24/7 support for those in emotional distress",
    phone: "988",
    url: "https://988lifeline.org",
    icon: "phone",
    urgent: true
  },
  {
    name: "Crisis Text Line",
    description: "Text HOME to connect with a counselor",
    phone: "741741",
    url: "https://www.crisistextline.org",
    icon: "chat",
    urgent: true
  },
  {
    name: "NAMI HelpLine",
    description: "Mental health information and resources",
    phone: "1-800-950-6264",
    url: "https://www.nami.org/help",
    icon: "heart"
  }
]

export function MentalHealthResources() {
  const getIcon = (type: Resource["icon"]) => {
    switch (type) {
      case "phone":
        return <Phone className="h-4 w-4" />
      case "chat":
        return <MessageCircle className="h-4 w-4" />
      case "heart":
        return <Heart className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Immediate Help</h2>
      {resources.map((resource) => (
        <Card
          key={resource.name}
          className={`p-4 ${
            resource.urgent
              ? "border-red-200 bg-red-50 dark:bg-red-900/10"
              : ""
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${
                resource.urgent
                  ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-muted"
              }`}>
                {getIcon(resource.icon)}
              </div>
              <h3 className="font-medium">{resource.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {resource.description}
            </p>
            {resource.phone && (
              <Button
                variant={resource.urgent ? "destructive" : "secondary"}
                size="sm"
                className="w-full"
                asChild
              >
                <a href={`tel:${resource.phone}`} className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  {resource.urgent ? "Call Now: " : "Call: "}
                  {resource.phone}
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              asChild
            >
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </a>
            </Button>
          </div>
        </Card>
      ))}

      <div className="mt-6 p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          If you or someone you know is in immediate danger,
          please call your local emergency services immediately.
        </p>
      </div>
    </div>
  )
} 