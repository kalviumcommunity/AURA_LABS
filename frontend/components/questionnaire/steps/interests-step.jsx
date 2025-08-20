"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useQuestionnaire } from "../questionnaire-context"

const interestOptions = [
  "Technology & Programming",
  "Healthcare & Medicine",
  "Business & Entrepreneurship",
  "Arts & Design",
  "Science & Research",
  "Education & Teaching",
  "Engineering & Manufacturing",
  "Finance & Banking",
  "Sports & Fitness",
  "Music & Entertainment",
  "Social Work",
  "Government & Public Service",
  "Environmental Science",
  "Psychology & Counselling",
  "Journalism and Media",
  "Law & Legal Studies",
]

const careerOptions = [
  "Software Developer",
  "Doctor",
  "Engineer",
  "Fashion Designer",
  "Teacher/Professor",
  "Scientist",
  "Designer",
  "Banker/Financial Analyst",
  "Lawyer",
  "Journalist",
  "Consultant",
  "Government Officer",
  "Architect",
  "Psychologist",
  "Marketing Professional",
  "Data Scientist",
  "Content Creator",
  "Social Worker",
  "Sports Professional",
  "Musician/Artist",
]

export function InterestsStep() {
  const { data, updateData, setCurrentStep } = useQuestionnaire()

  const handleNext = () => {
    if (data.interests.length > 0 && data.careerAspirations.length > 0) {
      setCurrentStep(4)
    }
  }

  const handleBack = () => {
    setCurrentStep(2)
  }

  const toggleInterest = (interest) => {
    const updated = data.interests.includes(interest)
      ? data.interests.filter((i) => i !== interest)
      : [...data.interests, interest]
    updateData({ interests: updated })
  }

  const toggleCareer = (career) => {
    const updated = data.careerAspirations.includes(career)
      ? data.careerAspirations.filter((c) => c !== career)
      : [...data.careerAspirations, career]
    updateData({ careerAspirations: updated })
  }

  const isValid = data.interests.length > 0 && data.careerAspirations.length > 0

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-8 mt-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">What Interests You?</h2>
        <p className="text-gray-600">
          Select your areas of interest and career aspirations (multiple selections allowed)
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">Areas of Interest (Select at least 1)</Label>
          <div className="grid grid-cols-4 gap-3">
            {interestOptions.map((interest) => (
              <div
                key={interest}
                className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  id={interest}
                  checked={data.interests.includes(interest)}
                  onCheckedChange={() => toggleInterest(interest)}
                />
                <Label htmlFor={interest} className="text-sm cursor-pointer">
                  {interest}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">Career Aspirations (Select at least 1)</Label>
          <div className="grid grid-cols-4 gap-3">
            {careerOptions.map((career) => (
              <div
                key={career}
                className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  id={career}
                  checked={data.careerAspirations.includes(career)}
                  onCheckedChange={() => toggleCareer(career)}
                />
                <Label htmlFor={career} className="text-sm cursor-pointer">
                  {career}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={handleBack} className="text-gray-500">
          ← Previous
        </Button>
        <Button onClick={handleNext} disabled={!isValid} className="bg-gray-800 hover:bg-gray-700 text-white px-6">
          Continue →
        </Button>
      </div>
    </div>
  )
}

