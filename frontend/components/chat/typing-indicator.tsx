import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-4xl mr-auto">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className="bg-accent text-accent-foreground text-xs">
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>

      <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2 mr-2">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
          </div>
          <span className="text-xs ml-2">AI Counsellor is typing...</span>
        </div>
      </div>
    </div>
  )
}
