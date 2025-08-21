"use client"

import { useEffect } from "react"

interface BotpressWidgetProps {
  shareUrl: string
}

export function BotpressWidget({ shareUrl }: BotpressWidgetProps) {
  useEffect(() => {
    let configUrl = ""
    try {
      const url = new URL(shareUrl)
      configUrl = url.searchParams.get("configUrl") || shareUrl
    } catch {
      configUrl = shareUrl
    }
    const script = document.createElement("script")
    script.src = "https://cdn.botpress.cloud/webchat/v3.2/inject.js"
    script.async = true
    document.body.appendChild(script)

    const style = document.createElement("link")
    style.rel = "stylesheet"
    style.href = "https://cdn.botpress.cloud/webchat/v3.2/inject.css"
    document.head.appendChild(style)

    script.onload = () => {
      ;(window as any).botpressWebChat?.init({ configUrl })
    }

    return () => {
      document.body.removeChild(script)
      document.head.removeChild(style)
    }
  }, [shareUrl])

  return null
}


