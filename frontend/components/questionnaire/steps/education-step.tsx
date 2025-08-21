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
    setCurrentStep(3)
  }

  const handlePrevious = () => {
    setCurrentStep(1)
  }

  const isValid = data.educationLevel && data.stream && data.percentage

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
            onValueChange={(value) => updateData({ educationLevel: value as any })}
            className="space-y-3"
          >
            <div
              role="button"
              onClick={() => updateData({ educationLevel: "grade12" as any })}
              className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer border transition-colors ${
                data.educationLevel === "grade12" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <RadioGroupItem value="grade12" id="grade12" />
              <div>
                <Label htmlFor="grade12" className="font-medium">
                  12th Grade
                </Label>
                <p className="text-sm text-gray-600">Completed 12th standard/Class XII</p>
              </div>
            </div>
            <div
              role="button"
              onClick={() => updateData({ educationLevel: "diploma" as any })}
              className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer border transition-colors ${
                data.educationLevel === "diploma" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <RadioGroupItem value="diploma" id="diploma" />
              <div>
                <Label htmlFor="diploma" className="font-medium">
                  Diploma
                </Label>
                <p className="text-sm text-gray-600">Completed Diploma course</p>
              </div>
            </div>
            <div
              role="button"
              onClick={() => updateData({ educationLevel: "equivalent" as any })}
              className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer border transition-colors ${
                data.educationLevel === "equivalent" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
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
          <RadioGroup value={data.stream} onValueChange={(value) => updateData({ stream: value as any })}>
            <div className="grid grid-cols-2 gap-4">
              <div
                role="button"
                onClick={() => updateData({ stream: "science" as any })}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                  data.stream === "science" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem value="science" id="science" />
                <div>
                  <Label htmlFor="science" className="font-medium">Science</Label>
                  <p className="text-sm text-gray-600">Choose PCM or PCB below</p>
                </div>
              </div>
              <div
                role="button"
                onClick={() => updateData({ stream: "commerce" as any })}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                  data.stream === "commerce" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem value="commerce" id="commerce" />
                <Label htmlFor="commerce" className="font-medium">
                  Commerce
                </Label>
              </div>
              <div
                role="button"
                onClick={() => updateData({ stream: "arts" as any })}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                  data.stream === "arts" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem value="arts" id="arts" />
                <Label htmlFor="arts" className="font-medium">
                  Arts/Humanities
                </Label>
              </div>
            </div>
          </RadioGroup>
          {data.stream === "science" && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div
                role="button"
                onClick={() => updateData({ scienceSpecialization: "pcm" as any })}
                className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer border transition-colors ${
                  data.scienceSpecialization === "pcm" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="h-3 w-3 rounded-full border border-gray-400 inline-block mr-2 bg-white" />
                <span className="text-sm">PCM (Physics, Chemistry, Math)</span>
              </div>
              <div
                role="button"
                onClick={() => updateData({ scienceSpecialization: "pcb" as any })}
                className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer border transition-colors ${
                  data.scienceSpecialization === "pcb" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="h-3 w-3 rounded-full border border-gray-400 inline-block mr-2 bg-white" />
                <span className="text-sm">PCB (Physics, Chemistry, Biology)</span>
              </div>
            </div>
          )}
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

        </div>

        {/* Conditional exam scores based on stream/specialization */}
        {data.stream === "science" && data.scienceSpecialization === "pcm" && (
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="jeeMainsScore" className="text-sm font-medium text-gray-700">
                JEE Mains Percentile
              </Label>
              <Input
                id="jeeMainsScore"
                placeholder="e.g., 92"
                value={String(data.jeeMainsScore ?? "")}
                onChange={(e) => updateData({ jeeMainsScore: Number(e.target.value) || 0 })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jeeAdvancedScore" className="text-sm font-medium text-gray-700">
                JEE Advanced Percentile (optional)
              </Label>
              <Input
                id="jeeAdvancedScore"
                placeholder="e.g., 85"
                value={String(data.jeeAdvancedScore ?? "")}
                onChange={(e) => updateData({ jeeAdvancedScore: Number(e.target.value) || 0 })}
                className="h-12"
              />
            </div>
          </div>
        )}
        {(data.stream === "science" && data.scienceSpecialization === "pcb") || data.stream === "medical" ? (
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="neetScore" className="text-sm font-medium text-gray-700">
                NEET Percentile
              </Label>
              <Input
                id="neetScore"
                placeholder="e.g., 70"
                value={String(data.neetScore ?? "")}
                onChange={(e) => updateData({ neetScore: Number(e.target.value) || 0 })}
                className="h-12"
              />
            </div>
          </div>
        ) : null}
        {data.stream === "commerce" || data.stream === "arts" ? (
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="cuetScore" className="text-sm font-medium text-gray-700">
                CUET Percentile (if applicable)
              </Label>
              <Input
                id="cuetScore"
                placeholder="e.g., 80"
                value={String(data.cuetScore ?? "")}
                onChange={(e) => updateData({ cuetScore: Number(e.target.value) || 0 })}
                className="h-12"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
        <Button variant="ghost" onClick={handlePrevious} className="text-gray-500">
          ← Previous
        </Button>
        <Button onClick={handleNext} className="bg-gray-800 hover:bg-gray-700 text-white px-6">
          Continue →
        </Button>
      </div>
    </div>
  )
}
