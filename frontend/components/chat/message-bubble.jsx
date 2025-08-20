import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MessageBubble({ message }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 max-w-4xl", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback
          className={cn("text-xs", isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground")}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%] break-words",
          isUser ? "bg-primary text-primary-foreground ml-2" : "bg-muted text-muted-foreground mr-2",
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  )
}

