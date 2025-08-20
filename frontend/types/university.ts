export interface University {
  id: string
  name: string
  location: {
    city: string
    state: string
    type: "metro" | "tier2" | "tier3"
  }
  type: "government" | "private" | "deemed"
  ranking: {
    nirf?: number
    overall?: number
  }
  courses: Course[]
  facilities: string[]
  placements: {
    averagePackage: string
    highestPackage: string
    placementRate: number
    topRecruiters: string[]
  }
  fees: {
    annual: number
    total: number
    currency: "INR"
  }
  eligibility: {
    minimumPercentage: number
    entranceExams: string[]
    streamRequirements: string[]
  }
  mode: ("regular" | "distance" | "online")[]
  established: number
  accreditation: string[]
}

export interface Course {
  id: string
  name: string
  degree: "BTech" | "BE" | "BSc" | "BCom" | "BA" | "BBA" | "BCA" | "Diploma" | "Other"
  duration: string
  specializations?: string[]
  careerPaths: string[]
}

export interface Recommendation {
  university: University
  course: Course
  matchScore: number
  reasoning: string[]
  pros: string[]
  cons: string[]
  eligibilityStatus: "eligible" | "borderline" | "not-eligible"
  scholarshipOpportunities: string[]
}
