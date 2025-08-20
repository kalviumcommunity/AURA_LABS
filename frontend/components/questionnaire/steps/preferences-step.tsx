"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useQuestionnaire } from "../questionnaire-context"

const locationOptions = [
  "Bangalore",
  "Mumbai",
  "Chennai",
  "Pune",
  "Nellithurai",
  "Jaipur",
  "Kochi",
  "Kakinada",
  "Indore",
  "Coimbatore",
  "Bhopal",
]

const importantFactors = ["Placement", "Campus life", "Fees", "Research Opportunities"]

export function PreferencesStep() {
  const { data, updateData, setCurrentStep } = useQuestionnaire()

  const handleNext = () => {
    if (data.preferredLocation.length > 0 && data.budgetRange && data.studyMode) {
      // Navigate to results page instead of next step
      window.location.href = "/recommendations"
    }
  }

  const handleBack = () => {
    setCurrentStep(3)
  }

  const toggleLocation = (location: string) => {
    const updated = data.preferredLocation.includes(location)
      ? data.preferredLocation.filter((l) => l !== location)
      : [...data.preferredLocation, location]
    updateData({ preferredLocation: updated })
  }

  const toggleFactor = (factor: string) => {
    const updated = data.importantFactors?.includes(factor)
      ? data.importantFactors.filter((f) => f !== factor)
      : [...(data.importantFactors || []), factor]
    updateData({ importantFactors: updated })
  }

  const isValid = data.preferredLocation.length > 0 && data.budgetRange && data.studyMode

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-8 mt-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Preferences</h2>
        <p className="text-gray-600">Help us understand your future path to you</p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium text-gray-700">Preferred Location (Select atleast 1)* </Label>
            <button className="text-blue-600 text-sm">⚙️</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {locationOptions.map((location, index) => (
              <div
                key={`${location}-${index}`}
                className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  id={`${location}-${index}`}
                  checked={data.preferredLocation.includes(location)}
                  onCheckedChange={() => toggleLocation(location)}
                />
                <Label htmlFor={`${location}-${index}`} className="text-sm cursor-pointer">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">Budget Range *</Label>
          <RadioGroup value={data.budgetRange} onValueChange={(value) => updateData({ budgetRange: value as any })}>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 p-4 border-2 border-green-500 bg-green-50 rounded-lg">
                <RadioGroupItem value="under-50k" id="under-50k" />
                <Label htmlFor="under-50k" className="font-medium">
                  Under 50,000 per year
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="50k-1lakh" id="50k-1lakh" />
                <Label htmlFor="50k-1lakh" className="font-medium">
                  ₹50,000 - 1 Lakh per year
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="1-2lakh" id="1-2lakh" />
                <Label htmlFor="1-2lakh" className="font-medium">
                  ₹1 - 2 Lakhs per year
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="3-5lakh" id="3-5lakh" />
                <Label htmlFor="3-5lakh" className="font-medium">
                  ₹3 - 5 Lakhs per year
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="above-5lakh" id="above-5lakh" />
                <Label htmlFor="above-5lakh" className="font-medium">
                  Above ₹5 Lakhs per year
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">Preferred Study Mode</Label>
          <RadioGroup value={data.studyMode} onValueChange={(value) => updateData({ studyMode: value as any })}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-4 border-2 border-purple-500 bg-purple-50 rounded-lg">
                <RadioGroupItem value="regular" id="regular" />
                <div>
                  <Label htmlFor="regular" className="font-medium">
                    Regular
                  </Label>
                  <p className="text-sm text-gray-600">Full-time on campus</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="distance" id="distance" />
                <div>
                  <Label htmlFor="distance" className="font-medium">
                    Distance Learning
                  </Label>
                  <p className="text-sm text-gray-600">Study from home with periodic visits</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="online" id="online" />
                <div>
                  <Label htmlFor="online" className="font-medium">
                    Online Education
                  </Label>
                  <p className="text-sm text-gray-600">Completely online classes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <div>
                  <Label htmlFor="hybrid" className="font-medium">
                    Hybrid Mode
                  </Label>
                  <p className="text-sm text-gray-600">Mix of online and offline</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            What factors are most important to you (Select at least 1)*
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {importantFactors.map((factor, index) => (
              <div
                key={`${factor}-${index}`}
                className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  id={`${factor}-${index}`}
                  checked={data.importantFactors?.includes(factor)}
                  onCheckedChange={() => toggleFactor(factor)}
                />
                <Label htmlFor={`${factor}-${index}`} className="text-sm cursor-pointer">
                  {factor}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Any Special Requirements or Additional Information
          </Label>
          <Textarea
            placeholder="Tell us about any specific requirements, preferences, or additional information that might help us provide better recommendations..."
            className="min-h-[100px]"
            value={data.additionalInfo || ""}
            onChange={(e) => updateData({ additionalInfo: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={handleBack} className="text-gray-500">
          ← Previous
        </Button>
        <Button onClick={handleNext} disabled={!isValid} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
          View Recommendations ✓
        </Button>
      </div>
    </div>
  )
}
