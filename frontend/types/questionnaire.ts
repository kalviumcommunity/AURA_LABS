export interface QuestionnaireData {
  // Step 1: Education Background
  educationLevel: "grade12" | "diploma" | "equivalent" | ""
  stream: "science" | "commerce" | "arts" | "vocational" | "engineering" | "medical" | "other" | ""
  completionYear: string
  percentage: string

  // Step 2: Interests & Aspirations
  interests: string[]
  careerAspirations: string[]
  preferredSubjects: string[]

  // Step 3: Preferences
  preferredLocation: string[]
  budgetRange: "under-1lakh" | "1-3lakh" | "3-5lakh" | "5-10lakh" | "above-10lakh" | ""
  studyMode: "regular" | "distance" | "online" | "hybrid" | ""

  // Step 4: Additional Info
  extracurriculars: string[]
  languagePreferences: string[]
  specialRequirements: string
}

export interface QuestionnaireStep {
  id: number
  title: string
  description: string
  fields: string[]
}
