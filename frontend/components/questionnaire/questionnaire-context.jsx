"use client"

import { createContext, useContext, useState } from "react"

const initialData = {
  educationLevel: "",
  stream: "",
  completionYear: "",
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

const QuestionnaireContext = createContext(undefined)

export function QuestionnaireProvider({ children }) {
  const [data, setData] = useState(initialData)
  const [currentStep, setCurrentStep] = useState(1)

  const updateData = (updates) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const isComplete = currentStep > 4

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

