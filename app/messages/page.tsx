import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Send } from "lucide-react"

// Mock data - replace with actual data from your backend
const conversations = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      image: "",
      lastMessage: "Thank you for your feedback on my poem!",
      timestamp: "2024-03-18T14:30:00Z",
      unread: true,
    },
  },
  {
    id: 2,
    user: {
      name: "Michael Rivera",
      image: "",
      lastMessage: "Would you like to join our workshop next week?",
      timestamp: "2024-03-17T18:45:00Z",
      unread: false,
    },
  },
]

export default function MessagesPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="p-4 md:col-span-1">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <Input
              type="search"
              placeholder="Search conversations..."
              className="mb-4"
            />
          </div>
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`w-full text-left p-3 rounded-lg hover:bg-accent ${
                  conversation.user.unread
                    ? "bg-accent"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={conversation.user.image} />
                    <AvatarFallback>
                      {conversation.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">
                        {conversation.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(
                          conversation.user.timestamp
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.user.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="p-4 md:col-span-2 flex flex-col h-[calc(100vh-12rem)]">
          <div className="flex items-center gap-4 border-b pb-4 mb-4">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Sarah Chen</h3>
              <p className="text-sm text-muted-foreground">Active now</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {/* Messages will be rendered here */}
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[70%]">
                <p>Hi Sarah! I really enjoyed your latest poem.</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 max-w-[70%]">
                <p>Thank you for your feedback on my poem!</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Input placeholder="Type a message..." />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 