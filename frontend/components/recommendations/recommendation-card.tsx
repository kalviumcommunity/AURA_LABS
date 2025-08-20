"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, Users, TrendingUp, CheckCircle, AlertCircle, XCircle, Star, Plus, Check } from "lucide-react"
import { useComparison } from "@/components/comparison/comparison-context"
import type { Recommendation } from "@/types/university"

interface RecommendationCardProps {
  recommendation: Recommendation
  onCompare: (recommendation: Recommendation) => void
  onViewDetails: (recommendation: Recommendation) => void
}

export function RecommendationCard({ recommendation, onCompare, onViewDetails }: RecommendationCardProps) {
  const { university, course, matchScore, reasoning, pros, cons, eligibilityStatus, scholarshipOpportunities } =
    recommendation

  const { addToComparison, isInComparison, items, maxItems } = useComparison()
  const inComparison = isInComparison(university.id, course.id)
  const canAddMore = items.length < maxItems

  const handleCompareClick = () => {
    if (!inComparison && canAddMore) {
      addToComparison(university, course)
    }
    onCompare(recommendation)
  }

  const getEligibilityIcon = () => {
    switch (eligibilityStatus) {
      case "eligible":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "borderline":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "not-eligible":
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getEligibilityColor = () => {
    switch (eligibilityStatus) {
      case "eligible":
        return "text-green-600"
      case "borderline":
        return "text-yellow-600"
      case "not-eligible":
        return "text-red-600"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{university.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {university.location.city}, {university.location.state}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{Math.round(matchScore * 100)}% Match</span>
            </div>
            {university.ranking.nirf && (
              <Badge variant="secondary" className="text-xs">
                NIRF #{university.ranking.nirf}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Match Score</span>
            <span className="text-sm text-muted-foreground">{Math.round(matchScore * 100)}%</span>
          </div>
          <Progress value={matchScore * 100} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Course Information */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Recommended Course</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm">{course.name}</span>
            <Badge variant="outline">{course.degree}</Badge>
          </div>
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span>{university.placements.averagePackage}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{university.placements.placementRate}% Placement</span>
          </div>
          <div className="flex items-center gap-2">
            {getEligibilityIcon()}
            <span className={`capitalize ${getEligibilityColor()}`}>{eligibilityStatus.replace("-", " ")}</span>
          </div>
        </div>

        {/* Fees */}
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Annual Fees</span>
            <span className="font-semibold">₹{(university.fees.annual / 100000).toFixed(1)}L</span>
          </div>
        </div>

        {/* AI Reasoning */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Why this is recommended</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {reasoning.slice(0, 2).map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scholarships */}
        {scholarshipOpportunities.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Scholarship Opportunities</h4>
            <div className="flex flex-wrap gap-1">
              {scholarshipOpportunities.slice(0, 2).map((scholarship, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {scholarship}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCompareClick}
            className="flex-1 bg-transparent"
            disabled={!canAddMore && !inComparison}
          >
            {inComparison ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Compare
              </>
            )}
          </Button>
          <Button size="sm" onClick={() => onViewDetails(recommendation)} className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
