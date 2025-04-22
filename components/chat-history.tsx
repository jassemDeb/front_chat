"use client"

import type { Chat } from "@/types"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "@/lib/utils"

interface ChatHistoryProps {
  chats: Chat[]
  onSelectChat: (chat: Chat) => void
  noChatsMessage: string
}

export default function ChatHistory({ chats, onSelectChat, noChatsMessage }: ChatHistoryProps) {
  if (chats.length === 0) {
    return <div className="text-center text-muted-foreground py-4">{noChatsMessage}</div>
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <Button
          key={chat.id}
          variant="ghost"
          className="w-full justify-start text-left h-auto py-3"
          onClick={() => onSelectChat(chat)}
        >
          <div className="truncate flex-1">
            <div className="font-medium truncate">{chat.name}</div>
            <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(chat.createdAt))}</div>
          </div>
        </Button>
      ))}
    </div>
  )
}
