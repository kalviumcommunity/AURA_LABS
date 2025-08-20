"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Filter } from "lucide-react"
import { RecommendationCard } from "@/components/recommendations/recommendation-card"
import { recommendationEngine } from "@/lib/recommendation-engine"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RecommendationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      generateRecommendations()
    }
  }, [user])

  const generateRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get questionnaire data from localStorage (in real app, this would come from a database)
      const savedData = localStorage.getItem("questionnaire_data")
      if (!savedData) {
        setError("No assessment data found. Please complete the questionnaire first.")
        return
      }

      const questionnaireData = JSON.parse(savedData)
      const results = await recommendationEngine.generateRecommendations(questionnaireData)
      setRecommendations(results)
    } catch (err) {
      setError("Failed to generate recommendations. Please try again.")
      console.error("Recommendation error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCompare = (recommendation) => {
    router.push("/compare")
  }

  const handleViewDetails = (recommendation) => {
    console.log("View details:", recommendation)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view your recommendations</CardDescription>
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
            <div className="text-sm text-muted-foreground">Welcome, {user.name}</div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Generating Your Recommendations</h2>
            <p className="text-muted-foreground">Our AI is analyzing your profile to find the perfect matches...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Link href="/questionnaire">
                  <Button>Take Assessment</Button>
                </Link>
                <Button variant="outline" onClick={generateRecommendations}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Personalized Recommendations</h1>
              <p className="text-lg text-muted-foreground">
                Based on your assessment, here are the best university and course matches for you
              </p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">Found {recommendations.length} recommendations</div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter Results
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={`${recommendation.university.id}-${recommendation.course.id}`}
                  recommendation={recommendation}
                  onCompare={handleCompare}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {recommendations.length === 0 && (
              <div className="text-center py-12">
                <Card className="w-full max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle>No Recommendations Found</CardTitle>
                    <CardDescription>
                      We couldn't find suitable matches based on your current criteria. Try adjusting your preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Link href="/questionnaire">
                      <Button>Retake Assessment</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

