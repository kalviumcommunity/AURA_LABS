"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useChat } from "./chat-context"

export function ChatInput() {
  const [input, setInput] = useState("")
  const { sendMessage, isLoading } = useChat()

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    await sendMessage(input)
    setInput("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-2 max-w-4xl mx-auto">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about universities, courses, scholarships, or career guidance..."
          className="min-h-[60px] resize-none"
          disabled={isLoading}
        />
        <Button onClick={handleSubmit} disabled={!input.trim() || isLoading} size="lg" className="px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

