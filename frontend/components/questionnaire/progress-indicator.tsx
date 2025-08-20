import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

const steps = [
  { id: 1, title: "Personal Information" },
  { id: 2, title: "Education Background" },
  { id: 3, title: "Interests & Aspirations" },
  { id: 4, title: "Preferences" },
]

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Get Your Personalized Recommendations</h1>
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep > step.id
                    ? "bg-blue-600 text-white"
                    : currentStep === step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500",
                )}
              >
                {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn("text-sm ml-3 font-medium", currentStep >= step.id ? "text-blue-600" : "text-gray-400")}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && <div className="flex-1 h-px mx-6 bg-gray-200" />}
          </div>
        ))}
      </div>
    </div>
  )
}
