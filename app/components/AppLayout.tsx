"use client"

import { useSession } from "next-auth/react"
import { SideNav } from "./SideNav"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { status } = useSession()

  return (
    <div className="min-h-screen bg-background">
      <SideNav />
      <main className={cn(
        "min-h-screen transition-all duration-200 ease-in-out",
        "lg:pl-[300px]" // Offset for side navigation on large screens
      )}>
        {children}
      </main>

      {/* Loading State */}
      {status === "loading" && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
} 