"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import ChatInterface from "@/components/chat-interface"
import { isAuthenticated } from "@/utils/auth"

export default function ChatPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      router.push("/signin")
    }
  }, [router])
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar showChatButton={false} />
      <main className="flex-1">
        <ChatInterface />
      </main>
    </div>
  )
}
