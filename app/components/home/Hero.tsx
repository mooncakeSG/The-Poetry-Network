"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { PenLine, BookOpen } from "lucide-react"

export function Hero() {
  return (
    <div className="relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          filter: "brightness(0.4)"
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Where Words Come to Life
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
            Join our community of poets, share your creativity, and explore the power of words.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              asChild
            >
              <Link href="/write">
                <PenLine className="mr-2 h-5 w-5" />
                Start Writing
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10 px-8"
              asChild
            >
              <Link href="/explore">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Poems
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 md:h-16 fill-current text-gray-50 dark:text-gray-900"
          viewBox="0 0 1440 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"/>
        </svg>
      </div>
    </div>
  )
} 