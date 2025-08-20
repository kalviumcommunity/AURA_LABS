"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, FileText, ExternalLink, Globe, MapPin, Users } from "lucide-react"

export function ExamCard({ exam, onViewDetails }) {
  const getTypeColor = () => {
    switch (exam.type) {
      case "national":
        return "bg-green-100 text-green-800"
      case "state":
        return "bg-blue-100 text-blue-800"
      case "university":
        return "bg-purple-100 text-purple-800"
    }
  }

  const getModeIcon = () => {
    switch (exam.examPattern.mode) {
      case "online":
        return <Globe className="h-4 w-4" />
      case "offline":
        return <FileText className="h-4 w-4" />
      case "both":
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{exam.name}</CardTitle>
            <CardDescription className="mt-1">{exam.fullName}</CardDescription>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{exam.conductedBy}</span>
            </div>
          </div>
          <Badge className={getTypeColor()}>
            <span className="capitalize">{exam.type}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Exam Pattern */}
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              {getModeIcon()}
              <span className="capitalize">{exam.examPattern.mode}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{exam.examPattern.duration}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Marks:</span>
              <div className="font-medium">{exam.examPattern.totalMarks}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Min. %:</span>
              <div className="font-medium">{exam.eligibility.minimumPercentage}%</div>
            </div>
          </div>
        </div>

        {/* Applicable For */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Applicable For</h4>
          <div className="flex flex-wrap gap-1">
            {exam.applicableFor.courses.slice(0, 3).map((course) => (
              <Badge key={course} variant="outline" className="text-xs">
                {course}
              </Badge>
            ))}
            {exam.applicableFor.courses.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{exam.applicableFor.courses.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Important Dates */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Important Dates</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Application:</span>
              <span>{exam.importantDates.applicationEnd}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exam Date:</span>
              <span>{exam.importantDates.examDate}</span>
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="bg-primary/5 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Application Fee:</span>
            <div className="text-right">
              <div className="font-semibold">₹{exam.fees.general}</div>
              {exam.fees.reserved !== exam.fees.general && (
                <div className="text-xs text-muted-foreground">₹{exam.fees.reserved} (Reserved)</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onViewDetails(exam)}>
            View Details
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <a href={exam.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Official Site
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

