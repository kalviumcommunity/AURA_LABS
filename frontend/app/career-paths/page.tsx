"use client"

import { useState, useEffect } from "react"
import type { CareerPath } from "@/types/career-path"
import { careerPaths, getCareerPathsByInterests } from "@/data/career-paths"
import { useQuestionnaire } from "@/components/questionnaire/questionnaire-context"
import { CareerPathSelector } from "@/components/career-path/career-path-selector"
import { CareerOverviewCard } from "@/components/career-path/career-overview-card"
import { CareerStepCard } from "@/components/career-path/career-step-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Route, Lightbulb } from "lucide-react"

export default function CareerPathsPage() {
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [recommendedPaths, setRecommendedPaths] = useState<CareerPath[]>([])
  const { responses } = useQuestionnaire()

  useEffect(() => {
    if (responses?.interests && responses.interests.length > 0) {
      const recommended = getCareerPathsByInterests(responses.interests)
      setRecommendedPaths(recommended.length > 0 ? recommended : careerPaths.slice(0, 4))
    } else {
      setRecommendedPaths(careerPaths.slice(0, 4))
    }
  }, [responses])

  const handleSelectPath = (path: CareerPath) => {
    setSelectedPath(path)
    setCurrentStep(0)
  }

  const handleStepNavigation = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  if (selectedPath) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setSelectedPath(null)} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Career Paths
            </Button>

            <CareerOverviewCard careerPath={selectedPath} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Step Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Route className="w-5 h-5" />
                    Career Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedPath.steps.map((step, index) => (
                    <Button
                      key={step.id}
                      variant={currentStep === index ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleStepNavigation(index)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs truncate">{step.title}</p>
                          <p className="text-xs text-muted-foreground">{step.duration}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Step Details */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {selectedPath.steps.map((step, index) => (
                  <CareerStepCard
                    key={step.id}
                    step={step}
                    isActive={currentStep === index}
                    isCompleted={currentStep > index}
                    stepNumber={index + 1}
                  />
                ))}
              </div>

              {/* Alternative Paths */}
              {selectedPath.alternativePaths && selectedPath.alternativePaths.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Alternative Career Paths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      With similar skills and background, you could also consider these career paths:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPath.alternativePaths.map((altPath, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          {altPath.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Career Path Visualizer</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore detailed career journeys from your current education level to your dream job. Understand the steps,
            skills, and timeline required for different career paths.
          </p>
        </div>

        {responses?.interests && responses.interests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your interests in {responses.interests.join(", ")}, here are some career paths that might suit
                you:
              </p>
              <div className="flex flex-wrap gap-2">
                {responses.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <CareerPathSelector
          careerPaths={recommendedPaths}
          selectedPath={selectedPath}
          onSelectPath={handleSelectPath}
        />

        {recommendedPaths.length < careerPaths.length && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">All Career Paths</h3>
            <CareerPathSelector careerPaths={careerPaths} selectedPath={selectedPath} onSelectPath={handleSelectPath} />
          </div>
        )}
      </div>
    </div>
  )
}
