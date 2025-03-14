"use client"

import { useState } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Switch } from "../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

export default function SettingsPage() {
  const [name, setName] = useState("Emily Johnson")
  const [email, setEmail] = useState("emily@example.com")
  const [bio, setBio] = useState(
    "Nature poet exploring themes of environmental consciousness"
  )
  const [notifications, setNotifications] = useState({
    email: true,
    mentions: true,
    comments: true,
    follows: true,
  })

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback>EJ</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Writing Style</Label>
                  <Select defaultValue="nature">
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nature">Nature Poetry</SelectItem>
                      <SelectItem value="modern">Modern Poetry</SelectItem>
                      <SelectItem value="traditional">
                        Traditional Forms
                      </SelectItem>
                      <SelectItem value="experimental">
                        Experimental
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Connected Accounts</Label>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Connect with Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    Connect with GitHub
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-destructive">
            <h2 className="text-xl font-semibold text-destructive mb-4">
              Danger Zone
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please
                be certain.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Notification Settings
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your activity
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mentions</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone mentions you
                  </p>
                </div>
                <Switch
                  checked={notifications.mentions}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      mentions: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone comments on your poems
                  </p>
                </div>
                <Switch
                  checked={notifications.comments}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      comments: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Follows</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone follows you
                  </p>
                </div>
                <Switch
                  checked={notifications.follows}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      follows: checked,
                    })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile
                  </p>
                </div>
                <Select defaultValue="public">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="followers">Followers Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Email Address</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your email on your public profile
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activity Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Show when you're active on the platform
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button>Save Changes</Button>
      </div>
    </div>
  )
} 