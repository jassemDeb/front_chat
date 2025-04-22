"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useI18n } from "./i18n-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Settings, Send, Plus, Save, Trash2, MessageSquare, User, Moon, Sun, Languages } from "lucide-react"
import { useTheme } from "next-themes"
import ChatMessage from "./chat-message"
import ModelSelector from "./model-selector"
import ChatHistory from "./chat-history"
import type { Message, Chat, AIModel } from "@/types"
import { nanoid } from "@/lib/utils"

export default function ChatInterface() {
  const { t, changeLocale, locale, dir } = useI18n()
  const { theme, setTheme } = useTheme()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentChat, setCurrentChat] = useState<Chat>({
    id: nanoid(),
    name: "",
    messages: [],
    createdAt: new Date().toISOString(),
  })
  const [savedChats, setSavedChats] = useState<Chat[]>([])
  const [selectedModel, setSelectedModel] = useState<AIModel>({
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load saved chats from localStorage
  useEffect(() => {
    const savedChatsData = localStorage.getItem("savedChats")
    if (savedChatsData) {
      setSavedChats(JSON.parse(savedChatsData))
    }
  }, [])

  // Save chats to localStorage when they change
  useEffect(() => {
    if (savedChats.length > 0) {
      localStorage.setItem("savedChats", JSON.stringify(savedChats))
    }
  }, [savedChats])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      content: input,
      role: "user",
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setCurrentChat((prev) => ({
      ...prev,
      messages: updatedMessages,
    }))
    setInput("")
    setIsLoading(true)

    try {
      // This would be replaced with your actual API call
      // For now, we'll simulate a response
      setTimeout(() => {
        const aiResponse: Message = {
          id: nanoid(),
          content: `This is a simulated response from ${selectedModel.name}. In a real implementation, this would come from your backend API.`,
          role: "assistant",
          timestamp: new Date().toISOString(),
          model: selectedModel.id,
        }

        const newMessages = [...updatedMessages, aiResponse]
        setMessages(newMessages)
        setCurrentChat((prev) => ({
          ...prev,
          messages: newMessages,
        }))
        setIsLoading(false)
      }, 1500)

      // In a real implementation, you would call your API like this:
      /*
      const response = await fetch('your-backend-api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      const aiResponse: Message = {
        id: nanoid(),
        content: data.message,
        role: "assistant",
        timestamp: new Date().toISOString(),
        model: selectedModel.id,
      };
      
      const newMessages = [...updatedMessages, aiResponse];
      setMessages(newMessages);
      setCurrentChat(prev => ({
        ...prev,
        messages: newMessages,
      }));
      */
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      const errorMessage: Message = {
        id: nanoid(),
        content: t("errors.errorMessage"),
        role: "system",
        timestamp: new Date().toISOString(),
      }

      setMessages([...updatedMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentChat({
      id: nanoid(),
      name: "",
      messages: [],
      createdAt: new Date().toISOString(),
    })
  }

  const handleSaveChat = () => {
    if (messages.length === 0) return

    const chatToSave: Chat = {
      ...currentChat,
      name: currentChat.name || `Chat ${savedChats.length + 1}`,
      messages,
    }

    setSavedChats((prev) => [...prev, chatToSave])
  }

  const handleLoadChat = (chat: Chat) => {
    setMessages(chat.messages)
    setCurrentChat(chat)
  }

  const handleClearChat = () => {
    setMessages([])
  }

  const toggleLanguage = () => {
    changeLocale(locale === "en" ? "ar" : "en")
  }

  return (
    <div className="flex h-screen flex-col md:flex-row" dir={dir}>
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-background border-r">
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">{t("general.appTitle")}</h1>
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Languages className="h-5 w-5" />
            </Button>
          </div>

          <Button className="mb-4" onClick={handleNewChat}>
            <Plus className="mr-2 h-4 w-4" />
            {t("chatInterface.newChat")}
          </Button>

          <Tabs defaultValue="chats" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="chats">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("chatInterface.chatHistory")}
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                {t("settings.settings")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chats" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <ChatHistory chats={savedChats} onSelectChat={handleLoadChat} noChatsMessage={t("errors.noChats")} />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings" className="flex-1">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">{t("settings.theme")}</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      {t("settings.light")}
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      {t("settings.dark")}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">{t("settings.language")}</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant={locale === "en" ? "default" : "outline"}
                      size="sm"
                      onClick={() => changeLocale("en")}
                    >
                      English
                    </Button>
                    <Button
                      variant={locale === "ar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => changeLocale("ar")}
                    >
                      العربية
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">{t("models.selectModel")}</h3>
                  <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">{t("user.userProfile")}</h3>
                  <Button variant="outline" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    {t("user.userSummary")}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <Input
            value={currentChat.name}
            onChange={(e) => setCurrentChat((prev) => ({ ...prev, name: e.target.value }))}
            placeholder={t("placeholders.chatNamePlaceholder")}
            className="max-w-xs"
          />
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleSaveChat} disabled={messages.length === 0}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleClearChat} disabled={messages.length === 0}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="animate-pulse">{t("general.typing")}</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholders.messagePlaceholder")}
              className="flex-1 min-h-[60px] max-h-[200px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
