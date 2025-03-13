import type React from "react"
import Link from "next/link"
import { Bell, Menu, PenSquare, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Providers } from "./providers"

import "./globals.css"

export const metadata = {
  title: "Poetry Network",
  description: "Connect with poets and poetry lovers from around the world",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <nav className="flex flex-col gap-4 py-4">
                        <Link href="/" className="text-lg font-bold">
                          Poetry Network
                        </Link>
                        <Link href="/explore" className="text-sm font-medium">
                          Explore
                        </Link>
                        <Link href="/workshops" className="text-sm font-medium">
                          Workshops
                        </Link>
                        <Link href="/profile" className="text-sm font-medium">
                          Profile
                        </Link>
                        <Link href="/write" className="text-sm font-medium">
                          Write
                        </Link>
                      </nav>
                    </SheetContent>
                  </Sheet>
                  <Link href="/" className="flex items-center gap-2">
                    <span className="text-lg font-bold">Poetry Network</span>
                  </Link>
                  <nav className="hidden md:flex md:gap-4 lg:gap-6">
                    <Link href="/explore" className="text-sm font-medium">
                      Explore
                    </Link>
                    <Link href="/workshops" className="text-sm font-medium">
                      Workshops
                    </Link>
                    <Link href="/search" className="text-sm font-medium">
                      Search
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-2">
                  <form action="/search" className="hidden md:flex md:w-64 lg:w-80">
                    <div className="relative w-full">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        name="q"
                        placeholder="Search poems..." 
                        className="w-full pl-9" 
                      />
                    </div>
                  </form>
                  <Button className="hidden md:flex">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                  <Button className="md:hidden" asChild>
                    <Link href="/search">
                      <Search className="h-5 w-5" />
                      <span className="sr-only">Search</span>
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/profile">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Profile</span>
                    </Link>
                  </Button>
                  <Button asChild className="hidden md:inline-flex">
                    <Link href="/write">
                      <PenSquare className="mr-2 h-4 w-4" />
                      Write
                    </Link>
                  </Button>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  © {new Date().getFullYear()} Poetry Network. All rights reserved.
                </p>
                <div className="flex gap-4">
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms
                  </Link>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'