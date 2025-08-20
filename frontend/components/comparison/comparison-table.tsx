"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Users, TrendingUp, Building, GraduationCap, IndianRupee, CheckCircle, X, Award } from "lucide-react"
import type { ComparisonItem } from "./comparison-context"
import { useComparison } from "./comparison-context"

interface ComparisonTableProps {
  items: ComparisonItem[]
}

export function ComparisonTable({ items }: ComparisonTableProps) {
  const { removeFromComparison } = useComparison()

  if (items.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Universities to Compare</h3>
          <p className="text-muted-foreground">Add universities from your recommendations to start comparing</p>
        </CardContent>
      </Card>
    )
  }

  const getComparisonValue = (items: ComparisonItem[], key: string) => {
    switch (key) {
      case "fees":
        return items.map((item) => item.university.fees.annual)
      case "placement":
        return items.map((item) => item.university.placements.placementRate)
      case "package":
        return items.map((item) => Number.parseFloat(item.university.placements.averagePackage.replace(/[^\d.]/g, "")))
      default:
        return []
    }
  }

  const getBestWorstIndicator = (values: number[], currentValue: number, higherIsBetter = true) => {
    const max = Math.max(...values)
    const min = Math.min(...values)

    if (higherIsBetter) {
      if (currentValue === max) return "best"
      if (currentValue === min) return "worst"
    } else {
      if (currentValue === min) return "best"
      if (currentValue === max) return "worst"
    }
    return "neutral"
  }

  const feesValues = getComparisonValue(items, "fees")
  const placementValues = getComparisonValue(items, "placement")
  const packageValues = getComparisonValue(items, "package")

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((item) => (
          <Card key={`${item.university.id}-${item.course.id}`} className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => removeFromComparison(item.university.id, item.course.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg leading-tight">{item.university.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {item.university.location.city}, {item.university.location.state}
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{item.course.name}</Badge>
                {item.university.ranking.nirf && (
                  <Badge variant="outline" className="text-xs">
                    NIRF #{item.university.ranking.nirf}
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Basic Information
              </h4>
              <div className="space-y-3">
                <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                  <div className="font-medium text-sm">University Type</div>
                  {items.map((item) => (
                    <div key={item.university.id} className="text-sm">
                      <Badge variant="outline" className="capitalize">
                        {item.university.type}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                  <div className="font-medium text-sm">Established</div>
                  {items.map((item) => (
                    <div key={item.university.id} className="text-sm">
                      {item.university.established}
                    </div>
                  ))}
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                  <div className="font-medium text-sm">Course Duration</div>
                  {items.map((item) => (
                    <div key={item.university.id} className="text-sm">
                      {item.course.duration}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fees Comparison */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Fees Structure
              </h4>
              <div className="space-y-3">
                <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                  <div className="font-medium text-sm">Annual Fees</div>
                  {items.map((item) => {
                    const indicator = getBestWorstIndicator(feesValues, item.university.fees.annual, false)
                    return (
                      <div key={item.university.id} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">₹{(item.university.fees.annual / 100000).toFixed(1)}L</span>
                          {indicator === "best" && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              Lowest
                            </Badge>
                          )}
                          {indicator === "worst" && (
                            <Badge variant="destructive" className="text-xs">
                              Highest
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                  <div className="font-medium text-sm">Total Course Fees</div>
                  {items.map((item) => (
                    <div key={item.university.id} className="text-sm">
                      ₹{(item.university.fees.total / 100000).toFixed(1)}L
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Placements */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Placement Statistics
              </h4>
              <div className="space-y-3">
                <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                  <div className="font-medium text-sm">Placement Rate</div>
                  {items.map((item) => {
                    const indicator = getBestWorstIndicator(placementValues, item.university.placements.placementRate)
                    return (
                      <div key={item.university.id} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.university.placements.placementRate}%</span>
                          {indicator === "best" && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              Highest
                            </Badge>
                          )}
                          {indicator === "worst" && (
                            <Badge variant="destructive" className="text-xs">
                              Lowest
                            </Badge>
                          )}
                        </div>
                        <Progress value={item.university.placements.placementRate} className="h-2 mt-1" />
                      </div>
                    )
                  })}
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                  <div className="font-medium text-sm">Average Package</div>
                  {items.map((item) => {
                    const packageValue = Number.parseFloat(
                      item.university.placements.averagePackage.replace(/[^\d.]/g, ""),
                    )
                    const indicator = getBestWorstIndicator(packageValues, packageValue)
                    return (
                      <div key={item.university.id} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.university.placements.averagePackage}</span>
                          {indicator === "best" && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              Highest
                            </Badge>
                          )}
                          {indicator === "worst" && (
                            <Badge variant="destructive" className="text-xs">
                              Lowest
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                  <div className="font-medium text-sm">Highest Package</div>
                  {items.map((item) => (
                    <div key={item.university.id} className="text-sm">
                      {item.university.placements.highestPackage}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rankings */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Rankings & Recognition
              </h4>
              <div className="space-y-3">
                <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                  <div className="font-medium text-sm">NIRF Ranking</div>
                  {items.map((item) => (
                    <div key={item.university.id} className="text-sm">
                      {item.university.ranking.nirf ? `#${item.university.ranking.nirf}` : "Not Ranked"}
                    </div>
                  ))}
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                  <div className="font-medium text-sm">Accreditation</div>
                  {items.map((item) => (
                    <div key={item.university.id} className="text-sm">
                      <div className="flex flex-wrap gap-1">
                        {item.university.accreditation.map((acc) => (
                          <Badge key={acc} variant="outline" className="text-xs">
                            {acc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Facilities & Features
              </h4>
              <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                <div className="font-medium text-sm">Key Facilities</div>
                {items.map((item) => (
                  <div key={item.university.id} className="text-sm">
                    <div className="space-y-1">
                      {item.university.facilities.map((facility) => (
                        <div key={facility} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Recruiters */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Top Recruiters
              </h4>
              <div className="grid gap-4" style={{ gridTemplateColumns: "200px " + `repeat(${items.length}, 1fr)` }}>
                <div className="font-medium text-sm">Major Companies</div>
                {items.map((item) => (
                  <div key={item.university.id} className="text-sm">
                    <div className="flex flex-wrap gap-1">
                      {item.university.placements.topRecruiters.slice(0, 4).map((recruiter) => (
                        <Badge key={recruiter} variant="secondary" className="text-xs">
                          {recruiter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
