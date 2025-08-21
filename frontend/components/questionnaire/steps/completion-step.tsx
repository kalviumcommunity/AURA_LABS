"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, RotateCcw } from "lucide-react"
import { useQuestionnaire } from "../questionnaire-context"
import { useRouter } from "next/navigation"

export function CompletionStep() {
  const { data, resetQuestionnaire } = useQuestionnaire()
  const router = useRouter()

  const handleGetRecommendations = () => {
    localStorage.setItem("questionnaire_data", JSON.stringify(data))
    router.push("/recommendations")
  }

  const handleRetakeAssessment = () => {
    resetQuestionnaire()
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Success Message */}
      <Card className="text-center border-primary/20 bg-primary/5">
        <CardHeader>
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl text-primary">Assessment Complete!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for completing the smart assessment. Here's a summary of your responses.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4">
        {/* Education Background */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Education Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Level:</span>
              <Badge variant="secondary">{data.educationLevel}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stream:</span>
              <Badge variant="secondary">{data.stream}</Badge>
            </div>
            <div className="flex justify-between">
              
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Score:</span>
              <span>{data.percentage}</span>
            </div>
          </CardContent>
        </Card>

        {/* Interests & Aspirations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interests & Aspirations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Interests:</span>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Career Goals:</span>
              <div className="flex flex-wrap gap-2">
                {data.careerAspirations.map((career) => (
                  <Badge key={career} variant="outline" className="text-xs">
                    {career}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Study Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Preferred Locations:</span>
              <div className="flex flex-wrap gap-2">
                {data.preferredLocation.map((location) => (
                  <Badge key={location} variant="outline" className="text-xs">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Budget:</span>
              <Badge variant="secondary">{data.budgetRange}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Study Mode:</span>
              <Badge variant="secondary">{data.studyMode}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button size="lg" className="flex-1" onClick={handleGetRecommendations}>
          Get My Recommendations
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" size="lg" onClick={handleRetakeAssessment}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Assessment
        </Button>
      </div>

      {/* Next Steps Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-2">What happens next?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Our AI will analyze your responses</li>
            <li>• You'll get personalized university recommendations</li>
            <li>• Compare universities side-by-side</li>
            <li>• Discover scholarships and career paths</li>
            <li>• Chat with our AI counsellor for guidance</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
