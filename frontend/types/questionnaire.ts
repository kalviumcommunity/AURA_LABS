export interface QuestionnaireData {
  // Step 0: Basic Info
  fullName?: string
  phoneNumber?: string
  emailAddress?: string
  // Step 1: Education Background
  educationLevel: "grade12" | "diploma" | "equivalent" | ""
  stream: "science" | "commerce" | "arts" | "vocational" | "engineering" | "medical" | "other" | ""
  // For science stream, capture specialization to differentiate PCM vs PCB
  scienceSpecialization?: "pcm" | "pcb"
  completionYear: string
  percentage: string
  // Conditional exam scores captured by specialization/stream
  jeeMainsScore?: number
  jeeAdvancedScore?: number
  neetScore?: number
  cuetScore?: number

  // Step 2: Interests & Aspirations
  interests: string[]
  careerAspirations: string[]
  preferredSubjects: string[]

  // Step 3: Preferences
  preferredLocation: string[]
  budgetRange: "under-1lakh" | "1-3lakh" | "3-5lakh" | "5-10lakh" | "above-10lakh" | ""
  studyMode: "regular" | "distance" | "online" | "hybrid" | ""
  // Numeric budget amount from slider (optional)
  budgetAmount?: number

  // Step 4: Additional Info
  extracurriculars: string[]
  languagePreferences: string[]
  specialRequirements: string
  // Optional fields used in Preferences step UI
  importantFactors?: string[]
  additionalInfo?: string
}

export interface QuestionnaireStep {
  id: number
  title: string
  description: string
  fields: string[]
}
