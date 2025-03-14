"use client"

import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "./theme-provider"
import { AuthProvider } from "./auth/AuthProvider"
import { MainNav } from "./navigation/MainNav"
import { Footer } from "./Footer"

export function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AuthProvider>
      {mounted ? (
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <MainNav />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      ) : (
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            {children}
          </div>
        </div>
      )}
    </AuthProvider>
  )
} 