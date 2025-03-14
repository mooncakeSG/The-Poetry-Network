"use client"

import Link from "next/link"
import { Heart, ExternalLink, BookOpen, Users, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const resources = [
  {
    title: "Mental Health Support",
    description: "Find professional help and support groups in your area. Connect with licensed therapists and counselors who understand the healing power of poetry.",
    link: "https://www.mentalhealth.gov/",
    icon: Heart
  },
  {
    title: "Self-Help Resources",
    description: "Access guides, articles, and tools for managing mental health. Discover how creative writing and poetry can be powerful tools for self-expression and healing.",
    link: "https://www.nami.org/Your-Journey/Individuals",
    icon: BookOpen
  },
  {
    title: "Community Support",
    description: "Connect with others who understand what you're going through. Share your journey, read others' stories, and find strength in our supportive community.",
    link: "https://www.supportgroups.com/",
    icon: Users
  }
]

const testimonials = [
  {
    id: "1",
    text: "Poetry has been my outlet for expressing emotions I couldn't otherwise share. Through writing and connecting with others here, I've found healing and understanding I never thought possible.",
    author: "Sarah M.",
    role: "Community Member"
  },
  {
    id: "2",
    text: "The combination of mental health resources and creative expression has made a real difference in my journey. This platform provides a safe space where I can be myself and grow.",
    author: "James K.",
    role: "Workshop Participant"
  }
]

export function MentalHealthCorner() {
  return (
    <section className="relative py-20">
      {/* Background with Fallback */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/images/backgrounds/calm-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="container relative z-10">
        <div className="mb-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">Mental Health Corner</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in animation-delay-200">
            A safe space to explore the connection between poetry and mental
            well-being. Find resources, share your story, and connect with others
            who understand.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <Card 
                key={resource.title} 
                className="bg-white/10 backdrop-blur-sm border-white/20 transform transition-all duration-300 hover:scale-105 hover:bg-white/20"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-2 text-white">
                    <Icon className="h-5 w-5 text-primary animate-pulse" />
                    <CardTitle>{resource.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    {resource.description}
                  </p>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                  >
                    Learn More
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Testimonials */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="bg-white/5 backdrop-blur-sm border-white/10 transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/50 mb-4" />
                <p className="text-gray-300 italic mb-4">{testimonial.text}</p>
                <div>
                  <p className="text-white font-medium">- {testimonial.author}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in animation-delay-400">
          <Link href="/mental-awareness">
            <Button className="bg-primary hover:bg-primary/90 min-w-[200px] text-lg px-8 py-6">
              Explore Mental Health Resources
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 