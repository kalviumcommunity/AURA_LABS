export interface CareerStep {
  id: string
  title: string
  description: string
  duration: string
  type: "education" | "experience" | "certification" | "milestone"
  requirements?: string[]
  skills?: string[]
}

export interface CareerPath {
  id: string
  title: string
  field: string
  description: string
  averageSalary: string
  growthRate: string
  steps: CareerStep[]
  alternativePaths?: string[]
  keySkills: string[]
  workEnvironment: string
  jobOutlook: "excellent" | "good" | "average" | "challenging"
}

export interface CareerVisualizationData {
  currentStep: number
  selectedPath: CareerPath
  alternativePaths: CareerPath[]
}
