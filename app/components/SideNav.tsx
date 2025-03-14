"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { 
  Home,
  User,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  PenSquare,
  BookOpen,
  Heart,
  Users,
  Search
} from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { cn } from "@/lib/utils"

export function SideNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const menuItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/messages", icon: MessageCircle, label: "Messages" },
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/write", icon: PenSquare, label: "Write" },
    { href: "/explore", icon: Search, label: "Explore" },
    { href: "/workshops", icon: BookOpen, label: "Workshops" },
    { href: "/mental-awareness", icon: Heart, label: "Mental Health" },
    { href: "/community", icon: Users, label: "Community" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Side Navigation */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-[300px] bg-background border-r z-50",
        "transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          {/* User Panel */}
          <div className="flex items-center gap-4 p-4">
            {session ? (
              <>
                <Avatar>
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>
                    {session.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{session.user?.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {session.user?.email}
                  </p>
                </div>
              </>
            ) : (
              <div className="w-full">
                <Button className="w-full" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-sm rounded-md",
                  "hover:bg-muted transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          {session && (
            <Button
              variant="ghost"
              className="mt-auto flex items-center gap-3 w-full justify-start"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          )}
        </div>
      </div>
    </>
  )
} 