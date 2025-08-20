"use client"

import { LoginForm } from "@/components/auth/login-form"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { useEffect } from "react"

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/questionnaire")
    }
  }, [user, router])

  const handleSuccess = () => {
    router.push("/questionnaire")
  }

  const handleSwitchToSignup = () => {
    router.push("/signup")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <LoginForm onSuccess={handleSuccess} onSwitchToSignup={handleSwitchToSignup} />
    </div>
  )
}
