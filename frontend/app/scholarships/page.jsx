"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, ArrowLeft, Loader2 } from "lucide-react"
import { scholarshipFinder } from "@/lib/scholarship-finder"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ScholarshipsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [scholarships, setScholarships] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadScholarshipsAndExams()
    }
  }, [user])

  const loadScholarshipsAndExams = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get questionnaire data from localStorage
      const savedData = localStorage.getItem("questionnaire_data")
      if (!savedData) {
        setError("No assessment data found. Please complete the questionnaire first.")
        return
      }

      const questionnaireData = JSON.parse(savedData)

      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const relevantScholarships = scholarshipFinder.findRelevantScholarships(questionnaireData)
      const relevantExams = scholarshipFinder.findRelevantExams(questionnaireData)

      setScholarships(relevantScholarships)
      setExams(relevantExams)
    } catch (err) {
      setError("Failed to load scholarships and exams. Please try again.")
      console.error("Scholarship/Exam loading error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewScholarshipDetails = (scholarship) => {
    // TODO: Implement detailed scholarship view
    console.log("View scholarship details:", scholarship)
  }

  const handleViewExamDetails = (exam) => {
    // TODO: Implement detailed exam view
    console.log("View exam details:", exam)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access scholarships and exam guidance</CardDescription>
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
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">FuturePath</span>
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Finding Your Opportunities</h2>
            <p className="text-muted-foreground">Analyzing your profile for relevant scholarships and exams...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={loadScholarshipsAndExams}>Try Again</Button>
              <Link href="/questionnaire">
                <Button variant="outline">Take Assessment</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">Scholarships & Exam Guidance</h1>
              <p className="text-muted-foreground">Personalized opportunities based on your profile</p>
            </div>

            {/* Scholarships Section */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Available Scholarships</h2>
              {scholarships.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {scholarships.map((scholarship) => (
                    <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                        <CardDescription>{scholarship.provider}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Amount</p>
                          <p className="font-semibold text-primary">{scholarship.amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Eligibility</p>
                          <ul className="text-sm space-y-1">
                            {scholarship.eligibility.slice(0, 3).map((criteria, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                          <span className="text-sm text-muted-foreground">Deadline: {scholarship.deadline}</span>
                          <Button size="sm" onClick={() => handleViewScholarshipDetails(scholarship)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      No scholarships found for your profile. Complete your assessment for better matches.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Entrance Exams Section */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Relevant Entrance Exams</h2>
              {exams.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {exams.map((exam) => (
                    <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{exam.name}</CardTitle>
                        <CardDescription>{exam.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Exam Date</p>
                          <p className="font-semibold">{exam.examDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Application Deadline</p>
                          <p className="font-semibold text-orange-600">{exam.applicationDeadline}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Eligibility</p>
                          <ul className="text-sm space-y-1">
                            {exam.eligibility.slice(0, 2).map((criteria, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                          <span className="text-sm text-muted-foreground">Fee: {exam.applicationFee}</span>
                          <Button size="sm" onClick={() => handleViewExamDetails(exam)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      No relevant exams found. Complete your assessment for personalized guidance.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

