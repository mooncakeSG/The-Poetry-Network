"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Edit2, Settings, Share2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { PoemsList } from "../components/profile/poems-list"
import { DraftsList } from "../components/profile/drafts-list"
import { WorkshopsList } from "../components/profile/workshops-list"
import { ActivityList } from "../components/profile/activity-list"

// Mock data - replace with actual data from your backend
const userStats = {
  poems: 24,
  followers: 156,
  following: 89,
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  if (status === "loading") {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>
              {session?.user?.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {session?.user?.name}
                </h1>
                <p className="text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
              <div className="flex gap-2 md:ml-auto">
                <Button variant="outline" size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="font-semibold">{userStats.poems}</div>
                <div className="text-sm text-muted-foreground">Poems</div>
              </div>
              <div>
                <div className="font-semibold">{userStats.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="font-semibold">{userStats.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="poems">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="poems">Poems</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="poems">
          <PoemsList userId={session?.user?.id || ""} />
        </TabsContent>

        <TabsContent value="drafts">
          <DraftsList userId={session?.user?.id || ""} />
        </TabsContent>

        <TabsContent value="workshops">
          <WorkshopsList userId={session?.user?.id || ""} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityList userId={session?.user?.id || ""} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

