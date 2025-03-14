"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Plus, Sparkles, TrendingUp, Clock, BarChart2 } from "lucide-react"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card } from "../ui/card"
import { AiRecommendations } from "../AiRecommendations"
import { LatestPoemsFeed } from "../LatestPoemsFeed"
import { MentalHealthCorner } from "../MentalHealthCorner"
import { FeaturedPoets } from "./FeaturedPoets"
import { Hero } from "./Hero"
import { TrendingTopics } from "./TrendingTopics"

export default function HomeClient() {
  const { data: session, status } = useSession()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero />
      <FeaturedPoets />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Quick Actions & Stats */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/write">
                  <Button className="w-full justify-start h-10">
                    <Plus className="mr-2 h-4 w-4" />
                    Write Poetry
                  </Button>
                </Link>
                <Link href="/workshops">
                  <Button className="w-full justify-start h-10">
                    <Plus className="mr-2 h-4 w-4" />
                    Join Workshop
                  </Button>
                </Link>
              </div>
            </Card>

            {status === "loading" ? (
              <Card className="p-4">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </Card>
            ) : session ? (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="h-5 w-5 text-purple-500" />
                  <h2 className="font-semibold">Your Stats</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Poems Written</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Likes</span>
                    <span className="font-medium">48</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Workshops Joined</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
              </Card>
            ) : null}

            <TrendingTopics />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6">
            <Tabs defaultValue="recommended" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="recommended" className="flex-1">
                  <Sparkles className="mr-2 h-4 w-4" />
                  For You
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex-1">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="latest" className="flex-1">
                  <Clock className="mr-2 h-4 w-4" />
                  Latest
                </TabsTrigger>
              </TabsList>
              <TabsContent value="recommended" className="mt-4">
                <AiRecommendations />
              </TabsContent>
              <TabsContent value="trending" className="mt-4">
                <LatestPoemsFeed type="trending" />
              </TabsContent>
              <TabsContent value="latest" className="mt-4">
                <LatestPoemsFeed type="latest" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Featured Poets & Topics */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Community Highlights</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-lg font-semibold">24</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Poems Today</p>
                    <p className="text-xs text-muted-foreground">Join the conversation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-lg font-semibold">5</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Workshops</p>
                    <p className="text-xs text-muted-foreground">Collaborate and learn</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-lg font-semibold">128</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Poets Online</p>
                    <p className="text-xs text-muted-foreground">Connect with others</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Mental Health Corner */}
      <MentalHealthCorner />
    </main>
  )
} 