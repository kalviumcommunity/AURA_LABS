"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"

export function ChatFab() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const check = () => setReady(Boolean((window as any).botpressWebChat))
    const id = setInterval(check, 500)
    check()
    return () => clearInterval(id)
  }, [])

  const [open, setOpen] = useState(false)

  const toggleChat = () => setOpen((v) => !v)

  return (
    <>
    {open && (
      <div className="fixed right-5 bottom-20 z-50 w-[360px] h-[520px] rounded-xl overflow-hidden shadow-2xl border bg-white">
        <div className="absolute right-2 top-2 z-10">
          <button
            aria-label="Close chat"
            onClick={toggleChat}
            className="rounded-full bg-black/80 text-white p-1 hover:bg-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <iframe
          title="AURA Chatbot"
          src="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/21/07/20250821073203-WFETDMD8.json"
          className="w-full h-full"
        />
      </div>
    )}
    <button
      onClick={toggleChat}
      aria-label="Open chat"
      className="fixed right-5 bottom-5 z-50 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black h-12 w-12 flex items-center justify-center"
      title="Chat with us"
    >
      <MessageCircle className="h-6 w-6" />
      {!ready && (
        <span className="sr-only">Loading chat…</span>
      )}
    </button>
    </>
  )
}


