import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider } from "./components/auth-provider"
import { AppLayout } from "./components/AppLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Poetry Network - Mental Health & Poetry Community",
  description: "A safe space to explore emotions, find support, and heal through the power of words.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}