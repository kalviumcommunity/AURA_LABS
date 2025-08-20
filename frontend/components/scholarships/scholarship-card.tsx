"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IndianRupee, FileText, ExternalLink, Award, Building } from "lucide-react"
import type { Scholarship } from "@/types/scholarship"

interface ScholarshipCardProps {
  scholarship: Scholarship
  onViewDetails: (scholarship: Scholarship) => void
}

export function ScholarshipCard({ scholarship, onViewDetails }: ScholarshipCardProps) {
  const getProviderIcon = () => {
    switch (scholarship.provider) {
      case "government":
        return <Building className="h-4 w-4 text-blue-600" />
      case "private":
        return <Award className="h-4 w-4 text-purple-600" />
      case "university":
        return <FileText className="h-4 w-4 text-green-600" />
    }
  }

  const getProviderColor = () => {
    switch (scholarship.provider) {
      case "government":
        return "bg-blue-100 text-blue-800"
      case "private":
        return "bg-purple-100 text-purple-800"
      case "university":
        return "bg-green-100 text-green-800"
    }
  }

  const getTypeColor = () => {
    switch (scholarship.type) {
      case "merit":
        return "bg-yellow-100 text-yellow-800"
      case "need-based":
        return "bg-orange-100 text-orange-800"
      case "category":
        return "bg-pink-100 text-pink-800"
      case "sports":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatAmount = () => {
    if (scholarship.amount.min === scholarship.amount.max) {
      return `₹${(scholarship.amount.max / 1000).toFixed(0)}K`
    }
    return `₹${(scholarship.amount.min / 1000).toFixed(0)}K - ₹${(scholarship.amount.max / 1000).toFixed(0)}K`
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{scholarship.name}</CardTitle>
            <CardDescription className="mt-1">{scholarship.description}</CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getProviderColor()}>
              <div className="flex items-center gap-1">
                {getProviderIcon()}
                <span className="capitalize">{scholarship.provider}</span>
              </div>
            </Badge>
            <Badge className={getTypeColor()}>
              <span className="capitalize">{scholarship.type.replace("-", " ")}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount and Type */}
        <div className="bg-primary/5 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">{formatAmount()}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {scholarship.amount.type.replace("-", " ")}
            </Badge>
          </div>
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Min. Percentage:</span>
            <div className="font-medium">{scholarship.eligibility.minimumPercentage}%</div>
          </div>
          <div>
            <span className="text-muted-foreground">Deadline:</span>
            <div className="font-medium">{scholarship.applicationDeadline}</div>
          </div>
        </div>

        {/* Benefits Preview */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Key Benefits</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {scholarship.benefits.slice(0, 2).map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{benefit}</span>
              </li>
            ))}
            {scholarship.benefits.length > 2 && (
              <li className="text-xs text-muted-foreground">+{scholarship.benefits.length - 2} more benefits</li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => onViewDetails(scholarship)}
          >
            View Details
          </Button>
          {scholarship.website && (
            <Button size="sm" className="flex-1" asChild>
              <a href={scholarship.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Apply
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
