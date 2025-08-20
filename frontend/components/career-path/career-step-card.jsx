import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Briefcase, Award, Target, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function CareerStepCard({ step, isActive, isCompleted, stepNumber }) {
  const getStepIcon = (type) => {
    switch (type) {
      case "education":
        return <GraduationCap className="w-5 h-5" />
      case "experience":
        return <Briefcase className="w-5 h-5" />
      case "certification":
        return <Award className="w-5 h-5" />
      case "milestone":
        return <Target className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  const getStepColor = (type) => {
    switch (type) {
      case "education":
        return "bg-blue-500"
      case "experience":
        return "bg-green-500"
      case "certification":
        return "bg-purple-500"
      case "milestone":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="relative">
      {/* Connection Line */}
      {stepNumber > 1 && <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-border" />}

      {/* Step Number Circle */}
      <div
        className={cn(
          "absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10",
          isCompleted
            ? "bg-green-500 text-white"
            : isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
        )}
      >
        {stepNumber}
      </div>

      <Card className={cn("mt-4 transition-all duration-200", isActive && "ring-2 ring-primary")}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg text-white flex-shrink-0", getStepColor(step.type))}>
              {getStepIcon(step.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-sm">{step.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {step.type}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{step.duration}</span>
              </div>

              {step.requirements && step.requirements.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Requirements:</h4>
                  <div className="flex flex-wrap gap-1">
                    {step.requirements.map((req, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {step.skills && step.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Skills Gained:</h4>
                  <div className="flex flex-wrap gap-1">
                    {step.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

