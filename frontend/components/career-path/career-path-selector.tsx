"use client"

import { useState } from "react"
import type { CareerPath } from "@/types/career-path"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface CareerPathSelectorProps {
  careerPaths: CareerPath[]
  selectedPath: CareerPath | null
  onSelectPath: (path: CareerPath) => void
}

export function CareerPathSelector({ careerPaths, selectedPath, onSelectPath }: CareerPathSelectorProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose a Career Path to Explore</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careerPaths.map((path) => (
          <Card
            key={path.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedPath?.id === path.id && "ring-2 ring-primary",
              hoveredPath === path.id && "scale-[1.02]",
            )}
            onMouseEnter={() => setHoveredPath(path.id)}
            onMouseLeave={() => setHoveredPath(null)}
            onClick={() => onSelectPath(path)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{path.title}</h4>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {path.field}
                  </Badge>
                </div>
                <Badge
                  className={cn(
                    "text-white text-xs",
                    path.jobOutlook === "excellent" && "bg-green-500",
                    path.jobOutlook === "good" && "bg-blue-500",
                    path.jobOutlook === "average" && "bg-yellow-500",
                    path.jobOutlook === "challenging" && "bg-red-500",
                  )}
                >
                  {path.jobOutlook}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{path.description}</p>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-green-500" />
                  <span>{path.averageSalary}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-blue-500" />
                  <span>{path.growthRate}</span>
                </div>
              </div>

              {selectedPath?.id === path.id && (
                <Button size="sm" className="w-full mt-3">
                  View Career Path
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
