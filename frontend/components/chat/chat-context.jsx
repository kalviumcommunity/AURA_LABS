"use client"

import { createContext, useContext, useState } from "react"
import { useQuestionnaire } from "@/components/questionnaire/questionnaire-context"

const ChatContext = createContext(undefined)

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      content:
        "Hello! I'm your AI counsellor. I'm here to help you with any questions about universities, courses, scholarships, or career guidance. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const { responses } = useQuestionnaire()

  const generateResponse = async (userMessage) => {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const lowerMessage = userMessage.toLowerCase()

    // Context-aware responses based on questionnaire data
    const studentContext = responses
      ? {
          education: responses.educationLevel,
          stream: responses.stream,
          interests: responses.interests,
          budget: responses.budget,
          location: responses.preferredLocation,
        }
      : null

    // Generate contextual responses
    if (lowerMessage.includes("university") || lowerMessage.includes("college")) {
      if (studentContext?.stream === "Science") {
        return `Based on your Science background, I'd recommend looking at engineering colleges like IITs, NITs, or medical colleges if you're interested in NEET. ${studentContext.budget ? `With your budget of ${studentContext.budget}, ` : ""}I can suggest specific universities that match your criteria. Would you like me to provide some recommendations?`
      }
      return "I can help you find the right university! Could you tell me more about your preferred field of study, budget, and location preferences?"
    }

    if (lowerMessage.includes("scholarship")) {
      return `There are many scholarship opportunities available! Based on your profile, you might be eligible for merit-based scholarships, need-based aid, or specific scholarships for your field. Some popular options include NSP scholarships, INSPIRE scholarships, and university-specific grants. Would you like me to find scholarships that match your profile?`
    }

    if (lowerMessage.includes("exam") || lowerMessage.includes("entrance")) {
      if (studentContext?.stream === "Science") {
        return "For Science students, key entrance exams include JEE Main/Advanced for engineering, NEET for medical, CUET for central universities, and various state-level exams. Which field are you most interested in pursuing?"
      }
      return "Entrance exams depend on your chosen field. Could you tell me what course or career path you're considering? I can guide you on the relevant exams and preparation strategies."
    }

    if (lowerMessage.includes("career") || lowerMessage.includes("job")) {
      return `Career planning is crucial! Based on your interests${studentContext?.interests ? ` in ${studentContext.interests.join(", ")}` : ""}, there are many exciting paths to explore. I can help you understand different career options, required qualifications, job market trends, and growth prospects. What specific career areas interest you most?`
    }

    if (lowerMessage.includes("fee") || lowerMessage.includes("cost") || lowerMessage.includes("expensive")) {
      return `Education costs vary significantly. Government colleges typically have lower fees (₹50K-2L annually), while private institutions range from ₹2L-15L+ annually. ${studentContext?.budget ? `With your budget of ${studentContext.budget}, ` : ""}I can help you find affordable options and scholarship opportunities. Would you like specific recommendations?`
    }

    // Default helpful response
    return "I'm here to help with all your educational and career questions! I can assist with university selection, course guidance, scholarship information, entrance exam preparation, career planning, and more. Feel free to ask me anything specific, and I'll provide personalized advice based on your profile."
  }

  const sendMessage = async (content) => {
    if (!content.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await generateResponse(content)

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content:
          "Hello! I'm your AI counsellor. I'm here to help you with any questions about universities, courses, scholarships, or career guidance. How can I assist you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  return <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearChat }}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

