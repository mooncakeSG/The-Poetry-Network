"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Search, Heart, Home, TrendingUp, Sparkles, BookOpen, Menu, X } from "lucide-react"

const routes = [
  {
    name: "Home",
    path: "/",
    icon: Home
  },
  {
    name: "For You",
    path: "/?tab=recommended",
    icon: Sparkles
  },
  {
    name: "Trending",
    path: "/?tab=trending",
    icon: TrendingUp
  },
  {
    name: "Workshops",
    path: "/workshops",
    icon: BookOpen
  },
  {
    name: "Mental Awareness",
    path: "/mental-awareness",
    icon: Heart,
    isHighlighted: true
  }
]

export function MainNav() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Poetry Network
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center transition-colors hover:text-foreground/80",
                    pathname === route.path ? "text-foreground" : "text-foreground/60",
                    route.isHighlighted && "text-red-500 hover:text-red-600"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {route.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className={cn(
            "flex w-full items-center space-x-2",
            isSearchOpen ? "block" : "hidden md:flex"
          )}>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search poems, poets, or topics..."
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-b md:hidden">
          <nav className="container grid gap-y-4 py-4">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname === route.path ? "text-foreground" : "text-foreground/60",
                    route.isHighlighted && "text-red-500 hover:text-red-600"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{route.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
} 