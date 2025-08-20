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
              <div className="text-sm text-muted-foreground">Welcome{user ? `, ${user.name}` : "!"}</div>
            </div>
          </div>
        </header>

        {!user && (
          <div className="container mx-auto px-4 mt-4">
            <Card className="bg-muted/30">
              <CardContent className="py-3 text-sm text-muted-foreground">
                You can fill the questionnaire without signing in. Sign in later to save your progress.
              </CardContent>
            </Card>
          </div>
        )}

        <QuestionnaireWizard />
      </div>
    </QuestionnaireProvider>
  )
}
