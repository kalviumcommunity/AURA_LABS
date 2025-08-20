"use client"

import { SignupForm } from "@/components/auth/signup-form"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { useEffect } from "react"

export default function SignupPage() {
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

  const handleSwitchToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <SignupForm onSuccess={handleSuccess} onSwitchToLogin={handleSwitchToLogin} />
    </div>
  )
}

