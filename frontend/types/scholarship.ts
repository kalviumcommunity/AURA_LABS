export interface Scholarship {
  id: string
  name: string
  provider: "government" | "private" | "university"
  type: "merit" | "need-based" | "category" | "sports" | "other"
  amount: {
    min: number
    max: number
    currency: "INR"
    type: "one-time" | "annual" | "full-tuition"
  }
  eligibility: {
    educationLevel: string[]
    minimumPercentage: number
    incomeLimit?: number
    category?: string[]
    state?: string[]
    course?: string[]
  }
  applicationDeadline: string
  description: string
  benefits: string[]
  applicationProcess: string[]
  documents: string[]
  website?: string
  isActive: boolean
}

export interface EntranceExam {
  id: string
  name: string
  fullName: string
  conductedBy: string
  type: "national" | "state" | "university"
  applicableFor: {
    courses: string[]
    degrees: string[]
    streams: string[]
  }
  examPattern: {
    mode: "online" | "offline" | "both"
    duration: string
    subjects: string[]
    totalMarks: number
    negativeMarking: boolean
  }
  eligibility: {
    educationLevel: string[]
    minimumPercentage: number
    ageLimit?: number
    attempts?: number
  }
  importantDates: {
    applicationStart: string
    applicationEnd: string
    examDate: string
    resultDate: string
  }
  fees: {
    general: number
    reserved: number
  }
  syllabus: string[]
  preparationTips: string[]
  website: string
  isActive: boolean
}
