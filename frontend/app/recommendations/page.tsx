"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Filter } from "lucide-react"
import { RecommendationCard } from "@/components/recommendations/recommendation-card"
import type { Recommendation } from "@/types/university"
import type { QuestionnaireData } from "@/types/questionnaire"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getBackendRecommendations } from "@/lib/backend"

export default function RecommendationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      const questionnaireData: QuestionnaireData = JSON.parse(savedData)
      console.log("[Recommendations] Loaded questionnaire data:", questionnaireData)

      const apiResult = await getBackendRecommendations(questionnaireData)
      console.log("[Recommendations] Backend result:", apiResult)

      // Optional: augment with metadata so fees/placements are not blank
      let metaIndex: Record<string, any> = {}
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://aura-labs.onrender.com"
        const metaRes = await fetch(`${baseUrl}/api/metadata/universities/meta`)
        const metaJson = await metaRes.json()
        metaIndex = Array.isArray(metaJson.universities)
          ? Object.fromEntries(metaJson.universities.map((u: any) => [String(u.name).toLowerCase(), u]))
          : {}
        console.log("[Recommendations] Loaded meta for", Object.keys(metaIndex).length, "universities")
      } catch (e) {
        console.warn("[Recommendations] Could not load meta", e)
      }

      const transformed: Recommendation[] = (apiResult?.recommendations || []).map((rec: any, index: number) => {
        const match = typeof rec.overall_score === "number" ? Math.max(0, Math.min(rec.overall_score / 100, 1)) : 0.6
        const admission = String(rec.admission_probability || "Medium").toLowerCase()
        const eligibility: "eligible" | "borderline" | "not-eligible" = admission.includes("high")
          ? "eligible"
          : admission.includes("low")
          ? "not-eligible"
          : "borderline"

        const meta = rec.name ? metaIndex[String(rec.name).toLowerCase()] : undefined
        const annual = meta?.annual_fees ?? 0
        const placementRate = meta?.placement_rate ?? 0
        const avgPackage = meta?.median_package ? `₹${(meta.median_package / 100000).toFixed(1)}L` : "-"

        return {
          university: {
            id: String(rec.id || index),
            name: String(rec.name || "Unknown University"),
            location: { city: meta?.city || "", state: meta?.state || "", type: "metro" },
            type: "private",
            ranking: {},
            courses: [],
            facilities: [],
            placements: {
              averagePackage: avgPackage,
              highestPackage: "-",
              placementRate: placementRate,
              topRecruiters: [],
            },
            fees: { annual: annual, total: annual, currency: "INR" },
            eligibility: { minimumPercentage: 0, entranceExams: [], streamRequirements: [] },
            mode: ["regular"],
            established: 0,
            accreditation: [],
          },
          course: {
            id: "recommended",
            name: "Recommended Program",
            degree: "Other",
            duration: "-",
            careerPaths: [],
          },
          matchScore: match,
          reasoning: rec.why_this_college ? [rec.why_this_college] : [],
          pros: Array.isArray(rec.pros) ? rec.pros : [],
          cons: Array.isArray(rec.cons) ? rec.cons : [],
          eligibilityStatus: eligibility,
          scholarshipOpportunities: [],
        }
      })

      setRecommendations(transformed)
    } catch (err) {
      setError("Failed to generate recommendations. Please try again.")
      console.error("Recommendation error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCompare = (recommendation: Recommendation) => {
    router.push("/compare")
  }

  const handleViewDetails = (recommendation: Recommendation) => {
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
