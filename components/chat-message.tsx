import type { Message } from "@/types"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { User, Bot, Sparkles } from "lucide-react"
import { format } from "date-fns"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"
  
  // Format timestamp if available
  const formattedTime = message.timestamp 
    ? format(new Date(message.timestamp), 'HH:mm')
    : null

  return (
    <div className={cn(
      "flex items-start gap-4 text-sm", 
      isUser ? "justify-end" : "justify-start",
      isSystem && "justify-center"
    )}>
      {!isUser && !isSystem && (
        <div className="flex flex-col items-center">
          <Avatar className="h-8 w-8 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-500 to-purple-500">
            <Bot className="h-5 w-5 text-white" />
          </Avatar>
          {message.model && (
            <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 max-w-[80px] truncate">
              {message.model}
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[80%] shadow-sm", 
          isUser 
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
            : isSystem 
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50" 
              : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        )}
      >
        <div className="whitespace-pre-wrap">
          {isSystem && (
            <div className="flex items-center mb-1 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">System Message</span>
            </div>
          )}
          {message.content}
        </div>
        
        {formattedTime && (
          <div className="text-[10px] opacity-70 mt-1 text-right">
            {formattedTime}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex flex-col items-center">
          <Avatar className="h-8 w-8 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-500 to-blue-500">
            <User className="h-5 w-5 text-white" />
          </Avatar>
          {formattedTime && (
            <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              You
            </span>
          )}
        </div>
      )}
    </div>
  )
}
