"use client"

import Image from "next/image"
import Link from "next/link"
import { Card } from "../ui/card"

interface Poet {
  id: string
  name: string
  image: string
  description: string
  bio: string
  achievements: string[]
}

const featuredPoets: Poet[] = [
  {
    id: "maya-angelou",
    name: "Maya Angelou",
    image: "/images/poets/maya-angelou.jpg",
    description: "Award-winning author, poet, and civil rights activist",
    bio: "Maya Angelou was an American poet, memoirist, and civil rights activist.",
    achievements: [
      "Presidential Medal of Freedom",
      "Over 50 honorary degrees",
      "Multiple Grammy Awards"
    ]
  },
  {
    id: "robert-frost",
    name: "Robert Frost",
    image: "/images/poets/robert-frost.jpg",
    description: "Four-time Pulitzer Prize-winning American poet",
    bio: "Robert Frost was an American poet known for his realistic depictions of rural life.",
    achievements: [
      "Four Pulitzer Prizes",
      "Congressional Gold Medal",
      "Poetry Consultant to the Library of Congress"
    ]
  },
  {
    id: "sylvia-plath",
    name: "Sylvia Plath",
    image: "/images/poets/sylvia-plath.jpg",
    description: "Pioneering confessional poet and novelist",
    bio: "Sylvia Plath was an American poet, novelist, and short story writer.",
    achievements: [
      "Pulitzer Prize for Poetry",
      "Glascock Prize",
      "Fulbright Scholar"
    ]
  }
]

export function FeaturedPoets() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Featured Poets
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Discover the masters of verse who have shaped the world of poetry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPoets.map((poet) => (
            <Link key={poet.id} href={`/poets/${poet.id}`}>
              <Card className="group relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                <div className="aspect-w-3 aspect-h-4">
                  <Image
                    src={poet.image}
                    alt={poet.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{poet.name}</h3>
                  <p className="text-gray-200 text-sm mb-4">{poet.description}</p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm mb-2">{poet.bio}</p>
                    <ul className="text-xs space-y-1">
                      {poet.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 