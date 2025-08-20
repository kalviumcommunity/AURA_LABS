import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, MapPin, Users } from "lucide-react"

export function CareerOverviewCard({ careerPath }) {
  const getOutlookColor = (outlook) => {
    switch (outlook) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "average":
        return "bg-yellow-500"
      case "challenging":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getOutlookText = (outlook) => {
    switch (outlook) {
      case "excellent":
        return "Excellent"
      case "good":
        return "Good"
      case "average":
        return "Average"
      case "challenging":
        return "Challenging"
      default:
        return "Unknown"
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{careerPath.title}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {careerPath.field}
            </Badge>
          </div>
          <Badge className={`${getOutlookColor(careerPath.jobOutlook)} text-white`}>
            {getOutlookText(careerPath.jobOutlook)} Outlook
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{careerPath.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Average Salary</p>
              <p className="font-semibold text-sm">{careerPath.averageSalary}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Growth Rate</p>
              <p className="font-semibold text-sm">{careerPath.growthRate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Work Environment</p>
              <p className="font-semibold text-sm">{careerPath.workEnvironment}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Steps to Goal</p>
              <p className="font-semibold text-sm">{careerPath.steps.length} Steps</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Key Skills Required:</h4>
          <div className="flex flex-wrap gap-2">
            {careerPath.keySkills.map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

