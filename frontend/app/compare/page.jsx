"use client"

import { useAuth } from "@/components/auth/auth-context"
import { useComparison } from "@/components/comparison/comparison-context"
import { ComparisonTable } from "@/components/comparison/comparison-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ComparePage() {
  const { user } = useAuth()
  const { items, clearComparison } = useComparison()
  const router = useRouter()

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access the comparison tool</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button>Go to Home Page</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
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
                <img src="/aura-logo.png" alt="AURA" className="h-8 w-8" />
                <span className="text-lg font-semibold text-foreground">AURA</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
              {items.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearComparison}>
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">University Comparison</h1>
          <p className="text-lg text-muted-foreground">
            Compare universities side-by-side to make an informed decision
          </p>
        </div>

        <ComparisonTable items={items} />

        {items.length === 0 && (
          <div className="text-center mt-8">
            <Link href="/recommendations">
              <Button size="lg">Browse Recommendations</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

