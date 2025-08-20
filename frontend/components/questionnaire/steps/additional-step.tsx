"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useQuestionnaire } from "../questionnaire-context"

const extracurricularOptions = [
  "Sports",
  "Music",
  "Dance",
  "Drama/Theatre",
  "Debate/Public Speaking",
  "Volunteering/Social Work",
  "Leadership Roles",
  "Technical Projects",
  "Art/Painting",
  "Writing/Blogging",
  "Photography",
  "None",
]

const languageOptions = ["English", "Hindi", "Regional Language", "No Preference"]

export function AdditionalStep() {
  const { data, updateData, setCurrentStep } = useQuestionnaire()

  const handleComplete = () => {
    setCurrentStep(5) // Move to completion/results
  }

  const handleBack = () => {
    setCurrentStep(3)
  }

  const toggleExtracurricular = (activity: string) => {
    const updated = data.extracurriculars.includes(activity)
      ? data.extracurriculars.filter((e) => e !== activity)
      : [...data.extracurriculars, activity]
    updateData({ extracurriculars: updated })
  }

  const toggleLanguage = (language: string) => {
    const updated = data.languagePreferences.includes(language)
      ? data.languagePreferences.filter((l) => l !== language)
      : [...data.languagePreferences, language]
    updateData({ languagePreferences: updated })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
        <CardDescription>Help us provide even better recommendations with these optional details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">Extracurricular activities (Optional)</Label>
          <div className="grid grid-cols-2 gap-3">
            {extracurricularOptions.map((activity) => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={activity}
                  checked={data.extracurriculars.includes(activity)}
                  onCheckedChange={() => toggleExtracurricular(activity)}
                />
                <Label htmlFor={activity} className="text-sm">
                  {activity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Language preferences for instruction</Label>
          <div className="space-y-2">
            {languageOptions.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={language}
                  checked={data.languagePreferences.includes(language)}
                  onCheckedChange={() => toggleLanguage(language)}
                />
                <Label htmlFor={language} className="text-sm">
                  {language}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="special-requirements" className="text-base font-medium">
            Any special requirements or additional information? (Optional)
          </Label>
          <Textarea
            id="special-requirements"
            placeholder="e.g., accessibility needs, specific course requirements, family considerations..."
            value={data.specialRequirements}
            onChange={(e) => updateData({ specialRequirements: e.target.value })}
            rows={4}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            Previous
          </Button>
          <Button onClick={handleComplete}>Complete Assessment</Button>
        </div>
      </CardContent>
    </Card>
  )
}
