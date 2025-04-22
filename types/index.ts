export interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: string
  model?: string
}

export interface Chat {
  id: string
  name: string
  messages: Message[]
  createdAt: string
}

export interface AIModel {
  id: string
  name: string
  provider: string
}

export interface UserSummary {
  id: string
  interests: string[]
  preferences: Record<string, any>
  recentTopics: string[]
  generatedAt: string
}
