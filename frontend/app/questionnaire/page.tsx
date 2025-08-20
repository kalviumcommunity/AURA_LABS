"use client"

import { useAuth } from "@/components/auth/auth-context"
import { QuestionnaireProvider } from "@/components/questionnaire/questionnaire-context"
import { QuestionnaireWizard } from "@/components/questionnaire/questionnaire-wizard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function QuestionnairePage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access the smart assessment questionnaire</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/signup">
              <Button>Sign Up to Get Started</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <QuestionnaireProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold text-foreground">FuturePath</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Welcome, {user.name}</div>
            </div>
          </div>
        </header>

        <QuestionnaireWizard />
      </div>
    </QuestionnaireProvider>
  )
}
