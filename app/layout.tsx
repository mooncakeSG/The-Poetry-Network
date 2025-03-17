import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Poetry Network",
  description: "A collaborative platform for poets to share and create together",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="min-h-full">
            <header role="banner" className="bg-white shadow">
              <nav role="navigation" aria-label="Main navigation">
                {/* Navigation content */}
              </nav>
            </header>
            <main role="main" className="py-10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <footer role="contentinfo" className="bg-white">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-500">
                  © {new Date().getFullYear()} Poetry Network. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}