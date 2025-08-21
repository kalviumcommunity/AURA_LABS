import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { AuthProvider } from "@/components/auth/auth-context"
import { QuestionnaireProvider } from "@/components/questionnaire/questionnaire-context"
import { ComparisonProvider } from "@/components/comparison/comparison-context"
import { ChatProvider } from "@/components/chat/chat-context"
import { BotpressWidget } from "@/components/chat/botpress-widget"
import { ChatFab } from "@/components/chat/chat-fab"
import { Header } from "@/components/layout/header"
import { ComparisonFloatingBar } from "@/components/comparison/comparison-floating-bar"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Aura - AI Counselling for Students",
  description:
    "AI-powered university and career guidance for students after 12th grade, diploma, and equivalent examinations",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${dmSans.style.fontFamily};
  --font-sans: ${dmSans.variable};
}
        `}</style>
      </head>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <AuthProvider>
          <QuestionnaireProvider>
            <ComparisonProvider>
              <ChatProvider>
                <Header />
                <BotpressWidget shareUrl="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/21/07/20250821073203-WFETDMD8.json" />
                {children}
                <ComparisonFloatingBar />
                <ChatFab />
              </ChatProvider>
            </ComparisonProvider>
          </QuestionnaireProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
