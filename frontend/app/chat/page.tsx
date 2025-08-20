"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "@/components/chat/message-bubble"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { ChatInput } from "@/components/chat/chat-input"
import { useChat } from "@/components/chat/chat-context"
import { Button } from "@/components/ui/button"
import { RotateCcw, MessageCircle } from "lucide-react"

export default function ChatPage() {
  const { messages, isLoading, clearChat } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">AI Counsellor</h1>
                <p className="text-sm text-muted-foreground">Get personalized guidance for your educational journey</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={clearChat}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  )
}
