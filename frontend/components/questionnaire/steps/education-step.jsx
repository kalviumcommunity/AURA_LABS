"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuestionnaire } from "../questionnaire-context"

export function EducationStep() {
  const { data, updateData, setCurrentStep } = useQuestionnaire()

  const handleNext = () => {
    if (data.educationLevel && data.stream && data.completionYear && data.percentage) {
      setCurrentStep(3)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(1)
  }

  const isValid = data.educationLevel && data.stream && data.completionYear && data.percentage

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-8 mt-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Education Background</h2>
        <p className="text-gray-600">Tell us about your academic journey</p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">What is your highest completed education? *</Label>
          <RadioGroup
            value={data.educationLevel}
            onValueChange={(value) => updateData({ educationLevel: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <RadioGroupItem value="grade12" id="grade12" />
              <div>
                <Label htmlFor="grade12" className="font-medium">
                  12th Grade
                </Label>
                <p className="text-sm text-gray-600">Completed 12th standard/Class XII</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <RadioGroupItem value="diploma" id="diploma" />
              <div>
                <Label htmlFor="diploma" className="font-medium">
                  Diploma
                </Label>
                <p className="text-sm text-gray-600">Completed Diploma course</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <RadioGroupItem value="equivalent" id="equivalent" />
              <div>
                <Label htmlFor="equivalent" className="font-medium">
                  Equivalent
                </Label>
                <p className="text-sm text-gray-600">Other equivalent qualification</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">Stream/Specialization</Label>
          <RadioGroup value={data.stream} onValueChange={(value) => updateData({ stream: value })}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <RadioGroupItem value="science" id="science" />
                <Label htmlFor="science" className="font-medium">
                  Science (PCM/PCB)
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <RadioGroupItem value="commerce" id="commerce" />
                <Label htmlFor="commerce" className="font-medium">
                  Commerce
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <RadioGroupItem value="arts" id="arts" />
                <Label htmlFor="arts" className="font-medium">
                  Arts/Humanities
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="percentage" className="text-sm font-medium text-gray-700">
              Percentage/CGPA *
            </Label>
            <Input
              id="percentage"
              placeholder="Enter your percentage"
              value={data.percentage || ""}
              onChange={(e) => updateData({ percentage: e.target.value })}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Year of Completion *</Label>
            <Select value={data.completionYear} onValueChange={(value) => updateData({ completionYear: value })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
        <Button variant="ghost" onClick={handlePrevious} className="text-gray-500">
          ← Previous
        </Button>
        <Button onClick={handleNext} disabled={!isValid} className="bg-gray-800 hover:bg-gray-700 text-white px-6">
          Continue →
        </Button>
      </div>
    </div>
  )
}

