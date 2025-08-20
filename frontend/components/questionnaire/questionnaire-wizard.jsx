"use client"

import { ProgressIndicator } from "./progress-indicator"
import { PersonalInfoStep } from "./steps/personal-info-step"
import { EducationStep } from "./steps/education-step"
import { InterestsStep } from "./steps/interests-step"
import { PreferencesStep } from "./steps/preferences-step"
import { useQuestionnaire } from "./questionnaire-context"

export function QuestionnaireWizard() {
  const { currentStep } = useQuestionnaire()

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />
      case 2:
        return <EducationStep />
      case 3:
        return <InterestsStep />
      case 4:
        return <PreferencesStep />
      default:
        return <PersonalInfoStep />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <ProgressIndicator currentStep={currentStep} totalSteps={4} />
        {renderStep()}
      </div>
    </div>
  )
}

