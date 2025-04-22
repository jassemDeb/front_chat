import type { Message } from "@/types"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { User, Bot } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-4 text-sm", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <Bot className="h-5 w-5" />
        </Avatar>
      )}

      <div
        className={cn("rounded-lg px-4 py-2 max-w-[80%]", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        {message.model && <div className="text-xs opacity-70 mt-1">{message.model}</div>}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          <User className="h-5 w-5" />
        </Avatar>
      )}
    </div>
  )
}
