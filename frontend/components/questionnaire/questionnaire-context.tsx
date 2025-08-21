"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { QuestionnaireData } from "@/types/questionnaire"

interface QuestionnaireContextType {
  data: QuestionnaireData
  updateData: (updates: Partial<QuestionnaireData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  isComplete: boolean
  resetQuestionnaire: () => void
}

const initialData: QuestionnaireData = {
  educationLevel: "",
  stream: "",
  percentage: "",
  interests: [],
  careerAspirations: [],
  preferredSubjects: [],
  preferredLocation: [],
  budgetRange: "",
  studyMode: "",
  extracurriculars: [],
  languagePreferences: [],
  specialRequirements: "",
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined)

export function QuestionnaireProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<QuestionnaireData>(initialData)
  const [currentStep, setCurrentStep] = useState(1)

  const updateData = (updates: Partial<QuestionnaireData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const isComplete = currentStep > 3

  const resetQuestionnaire = () => {
    setData(initialData)
    setCurrentStep(1)
  }

  return (
    <QuestionnaireContext.Provider
      value={{
        data,
        updateData,
        currentStep,
        setCurrentStep,
        isComplete,
        resetQuestionnaire,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  )
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext)
  if (context === undefined) {
    throw new Error("useQuestionnaire must be used within a QuestionnaireProvider")
  }
  return context
}
