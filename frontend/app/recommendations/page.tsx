"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Filter, Download } from "lucide-react"
import { RecommendationCard } from "@/components/recommendations/recommendation-card"
import { NoRecommendations } from "@/components/recommendations/no-recommendations"
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
  const [noRecommendationsData, setNoRecommendationsData] = useState<{ message: string; suggestions: string[] } | null>(null)
  const pdfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      generateRecommendations()
    }
  }, [user])

  const generateRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)
      setNoRecommendationsData(null)

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

      // Check if the backend returned an error response
      if (apiResult?.message && apiResult?.suggestions) {
        setNoRecommendationsData({
          message: apiResult.message,
          suggestions: apiResult.suggestions
        })
        setRecommendations([])
        return
      }

      // Optional: augment with metadata so fees/placements are not blank
      let metaList: any[] = []
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://aura-labs.onrender.com"
        const metaRes = await fetch(`${baseUrl}/api/metadata/universities/meta`)
        const metaJson = await metaRes.json()
        metaList = Array.isArray(metaJson.universities) ? metaJson.universities : []
        console.log("[Recommendations] Loaded meta for", metaList.length, "universities")
      } catch (e) {
        console.warn("[Recommendations] Could not load meta", e)
      }

      const normalize = (name: string) =>
        String(name || "")
          .toLowerCase()
          .replace(/\([^\)]*\)/g, "") // remove parentheses content
          .replace(/[^a-z0-9\s]/g, " ") // non-word -> space
          .replace(/\s+/g, " ")
          .trim()

      const tokenize = (name: string) => {
        const stop = new Set(["institute", "of", "technology", "university", "college", "and", "science", "in", "the"])
        return normalize(name)
          .split(" ")
          .filter((t) => t && !stop.has(t))
      }

      const alias: Record<string, string> = {
        "vit": "Vellore Institute of Technology",
        "vellore institute of technology vit": "Vellore Institute of Technology",
        "srm": "SRM Institute of Science and Technology",
        "srm institute of science and technology srmist": "SRM Institute of Science and Technology",
      }

      const findMeta = (name: string) => {
        const aliasKey = normalize(name)
        if (alias[aliasKey]) {
          const exact = metaList.find((m: any) => normalize(m.name) === normalize(alias[aliasKey]))
          if (exact) return exact
        }

        const targetTokens = tokenize(name)
        let best: any | undefined
        let bestScore = 0
        for (const m of metaList) {
          const candidateTokens = tokenize(m.name)
          const inter = new Set(targetTokens.filter((t) => candidateTokens.includes(t)))
          const union = new Set([...targetTokens, ...candidateTokens])
          const jaccard = union.size ? inter.size / union.size : 0
          if (jaccard > bestScore) {
            bestScore = jaccard
            best = m
          }
        }
        // require a reasonable similarity
        return bestScore >= 0.35 ? best : undefined
      }

      const transformed: Recommendation[] = (apiResult?.recommendations || []).map((rec: any, index: number) => {
        const match = typeof rec.overall_score === "number" ? Math.max(0, Math.min(rec.overall_score / 100, 1)) : 0.6
        const admission = String(rec.admission_probability || "Medium").toLowerCase()
        const eligibility: "eligible" | "borderline" | "not-eligible" = admission.includes("high")
          ? "eligible"
          : admission.includes("low")
          ? "not-eligible"
          : "borderline"

        const meta = rec.name ? findMeta(String(rec.name)) : undefined
        // fallback to values hinted by the AI if metadata didn't match
        const annual = typeof meta?.annual_fees === "number"
          ? meta.annual_fees
          : (() => {
              const fee = String(rec.annual_fees || rec.fees || "").match(/[\d.,]+/)
              return fee ? parseInt(fee[0].replace(/,/g, "")) : 0
            })()
        const placementRate = typeof meta?.placement_rate === "number"
          ? meta.placement_rate
          : (typeof rec.placement_rate === "number"
              ? rec.placement_rate
              : (() => {
                  const m = String(rec.placement_rate || "").match(/\d+/)
                  return m ? parseInt(m[0]) : 0
                })())
        const avgPackage = typeof meta?.median_package === "number"
          ? `₹${(meta.median_package / 100000).toFixed(1)}L`
          : (rec.median_package ? String(rec.median_package) : "-")

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
            degree:
              (questionnaireData?.stream === "science" && questionnaireData?.scienceSpecialization === "pcm") ||
              Number(questionnaireData?.jeeMainsScore || 0) > 0 ||
              Number(questionnaireData?.jeeAdvancedScore || 0) > 0
                ? "BTech"
                : "Other",
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

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import("jspdf")
    const pdf = new jsPDF({ unit: "pt", format: "a4" })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 36
    let y = margin

    const addHeading = (text: string) => {
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(16)
      pdf.text(text, margin, y)
      y += 18
    }

    const addSub = (text: string) => {
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
      const lines = pdf.splitTextToSize(text, pageWidth - margin * 2)
      pdf.text(lines, margin, y)
      y += lines.length * 14
    }

    const addDivider = () => {
      pdf.setDrawColor(220)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 12
    }

    const ensureSpace = (extra: number) => {
      if (y + extra > pageHeight - margin) {
        pdf.addPage()
        y = margin
      }
    }

    addHeading("AURA - Personalized Recommendations")
    pdf.setFontSize(10)
    pdf.text(`Generated on ${new Date().toLocaleString()}`, margin, y)
    y += 18
    addDivider()

    for (const rec of recommendations) {
      ensureSpace(120)
      addHeading(`${rec.university.name}`)
      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Location: ${rec.university.location.city || "-"}, ${rec.university.location.state || "-"}`, margin, y)
      y += 14
      pdf.text(`Match: ${Math.round(rec.matchScore * 100)}%  •  Eligibility: ${rec.eligibilityStatus}` , margin, y)
      y += 14

      const annual = rec.university.fees?.annual || 0
      const placement = rec.university.placements?.placementRate || 0
      const avgPkg = rec.university.placements?.averagePackage || "-"
      pdf.text(`Annual Fees: ${annual > 0 ? `₹${(annual/100000).toFixed(1)}L` : '-'}` , margin, y)
      y += 14
      pdf.text(`Placement Rate: ${placement}%  •  Avg Package: ${avgPkg}`, margin, y)
      y += 16

      if (rec.reasoning && rec.reasoning.length > 0) {
        pdf.setFont("helvetica", "bold")
        pdf.text("Why this is recommended:", margin, y)
        y += 14
        pdf.setFont("helvetica", "normal")
        for (const reason of rec.reasoning.slice(0, 4)) {
          ensureSpace(18)
          addSub(`• ${reason}`)
        }
      }
      addDivider()
    }

    pdf.save("aura-recommendations.pdf")
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Results
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            <div ref={pdfRef} className="space-y-6 pdf-safe">
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

              {recommendations.length === 0 && noRecommendationsData ? (
                <NoRecommendations
                  message={noRecommendationsData.message}
                  suggestions={noRecommendationsData.suggestions}
                />
              ) : recommendations.length === 0 ? (
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
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
