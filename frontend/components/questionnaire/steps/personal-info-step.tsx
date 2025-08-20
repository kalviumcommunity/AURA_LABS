"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQuestionnaire } from "../questionnaire-context"

export function PersonalInfoStep() {
  const { data, updateData, setCurrentStep } = useQuestionnaire()

  const handleNext = () => {
    setCurrentStep(2)
  }

  const isValid = data.fullName && data.phoneNumber && data.emailAddress

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-8 mt-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Let's Get to Know You</h2>
        <p className="text-gray-600">We'll use this information to personalize your experience</p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={data.fullName || ""}
              onChange={(e) => updateData({ fullName: e.target.value })}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={data.phoneNumber || ""}
              onChange={(e) => updateData({ phoneNumber: e.target.value })}
              className="h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailAddress" className="text-sm font-medium text-gray-700">
            Email Address *
          </Label>
          <Input
            id="emailAddress"
            type="email"
            placeholder="Enter your email address"
            value={data.emailAddress || ""}
            onChange={(e) => updateData({ emailAddress: e.target.value })}
            className="h-12"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
        <Button variant="ghost" className="text-gray-500" disabled>
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-gray-800 hover:bg-gray-700 text-white px-6">
          Continue →
        </Button>
      </div>
    </div>
  )
}
