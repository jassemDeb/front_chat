"use client"

import { useI18n } from "./i18n-provider"
import { Avatar } from "@/components/ui/avatar"
import { User, Bot } from "lucide-react"
import { useEffect, useState } from "react"

export default function ChatPreview() {
  const { t } = useI18n()
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [typing, setTyping] = useState(false)
  const [currentText, setCurrentText] = useState("")

  const conversation = [
    { role: "user", content: t("chatPreview.previewMessage1") },
    { role: "assistant", content: t("chatPreview.previewResponse1") },
    { role: "user", content: t("chatPreview.previewMessage2") },
    { role: "assistant", content: t("chatPreview.previewResponse2") },
  ]

  useEffect(() => {
    const message = conversation[currentMessageIndex]

    if (message.role === "assistant") {
      setTyping(true)
      let i = 0
      setCurrentText("")

      const typingInterval = setInterval(() => {
        if (i < message.content.length) {
          setCurrentText((prev) => prev + message.content.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
          setTyping(false)

          // Move to next message after a delay
          setTimeout(() => {
            if (currentMessageIndex < conversation.length - 1) {
              setCurrentMessageIndex(currentMessageIndex + 1)
            } else {
              // Reset to beginning after a longer delay
              setTimeout(() => {
                setCurrentMessageIndex(0)
              }, 3000)
            }
          }, 2000)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    } else {
      // For user messages, show immediately then move to next
      setTimeout(() => {
        if (currentMessageIndex < conversation.length - 1) {
          setCurrentMessageIndex(currentMessageIndex + 1)
        }
      }, 1500)
    }
  }, [currentMessageIndex])

  return (
    <div className="flex flex-col h-[400px]">
      <div className="p-3 border-b flex items-center justify-between bg-white dark:bg-gray-900 border-indigo-100 dark:border-gray-800">
        <div className="font-medium text-indigo-700 dark:text-gray-100">{t("general.appTitle")}</div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white dark:bg-gray-900">
        {conversation.slice(0, currentMessageIndex + 1).map((message, index) => {
          const isLastMessage = index === currentMessageIndex
          const isUser = message.role === "user"

          return (
            <div key={index} className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <Avatar className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <Bot className="h-5 w-5" />
                </Avatar>
              )}

              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] ${
                  isUser 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-600 dark:to-purple-600 text-white" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                }`}
              >
                {isLastMessage && !isUser ? currentText : message.content}
                {isLastMessage && !isUser && typing && <span className="ml-1 animate-pulse">▋</span>}
              </div>

              {isUser && (
                <Avatar className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <User className="h-5 w-5" />
                </Avatar>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t bg-white dark:bg-gray-900 border-indigo-100 dark:border-gray-800">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{t("placeholders.messagePlaceholder")}</div>
      </div>
    </div>
  )
}
