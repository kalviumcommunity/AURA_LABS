import type { QuestionnaireData } from "@/types/questionnaire"
import type { University, Course, Recommendation } from "@/types/university"
import { universitiesData } from "@/data/universities"

export class RecommendationEngine {
  private universities: University[] = universitiesData

  async generateRecommendations(userData: QuestionnaireData): Promise<Recommendation[]> {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const recommendations: Recommendation[] = []

    for (const university of this.universities) {
      for (const course of university.courses) {
        const matchScore = this.calculateMatchScore(userData, university, course)

        if (matchScore > 0.3) {
          // Only include if match score is above threshold
          const recommendation: Recommendation = {
            university,
            course,
            matchScore,
            reasoning: this.generateReasoning(userData, university, course, matchScore),
            pros: this.generatePros(university, course),
            cons: this.generateCons(university, course, userData),
            eligibilityStatus: this.checkEligibility(userData, university),
            scholarshipOpportunities: this.findScholarships(userData, university),
          }
          recommendations.push(recommendation)
        }
      }
    }

    // Sort by match score and return top recommendations
    return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10)
  }

  private calculateMatchScore(userData: QuestionnaireData, university: University, course: Course): number {
    let score = 0
    let factors = 0

    // Education level compatibility
    if (this.isEducationCompatible(userData.educationLevel, course.degree)) {
      score += 0.2
    }
    factors++

    // Stream compatibility
    if (this.isStreamCompatible(userData.stream, university.eligibility.streamRequirements)) {
      score += 0.25
    }
    factors++

    // Interest alignment
    const interestMatch = this.calculateInterestMatch(userData.interests, course.careerPaths)
    score += interestMatch * 0.2
    factors++

    // Career aspiration alignment
    const careerMatch = this.calculateCareerMatch(userData.careerAspirations, course.careerPaths)
    score += careerMatch * 0.15
    factors++

    // Location preference
    if (this.isLocationPreferred(userData.preferredLocation, university.location)) {
      score += 0.1
    }
    factors++

    // Budget compatibility
    if (this.isBudgetCompatible(userData.budgetRange, university.fees.annual)) {
      score += 0.1
    }
    factors++

    return Math.min(score, 1) // Cap at 1.0
  }

  private isEducationCompatible(educationLevel: string, degree: string): boolean {
    const compatibilityMap: Record<string, string[]> = {
      grade12: ["BTech", "BE", "BSc", "BCom", "BA", "BBA", "BCA"],
      diploma: ["BTech", "BE", "BSc", "BCA", "Diploma"],
      equivalent: ["BTech", "BE", "BSc", "BCom", "BA", "BBA", "BCA"],
    }
    return compatibilityMap[educationLevel]?.includes(degree) || false
  }

  private isStreamCompatible(stream: string, requirements: string[]): boolean {
    const streamMap: Record<string, string[]> = {
      science: ["Science (PCM)", "Science (PCB)", "Science", "Any Stream"],
      commerce: ["Commerce", "Any Stream"],
      arts: ["Arts", "Any Stream"],
      vocational: ["Any Stream"],
      engineering: ["Science (PCM)", "Science", "Any Stream"],
      medical: ["Science (PCB)", "Science", "Any Stream"],
    }

    const userStreams = streamMap[stream] || ["Any Stream"]
    return requirements.some((req) => userStreams.includes(req))
  }

  private calculateInterestMatch(interests: string[], careerPaths: string[]): number {
    if (interests.length === 0) return 0.5

    const interestKeywords = interests.flatMap((interest) => interest.toLowerCase().split(/[&\s]+/))

    const careerKeywords = careerPaths.flatMap((career) => career.toLowerCase().split(/[&\s]+/))

    const matches = interestKeywords.filter((keyword) =>
      careerKeywords.some((careerKeyword) => careerKeyword.includes(keyword) || keyword.includes(careerKeyword)),
    )

    return Math.min(matches.length / Math.max(interestKeywords.length, 1), 1)
  }

  private calculateCareerMatch(aspirations: string[], careerPaths: string[]): number {
    if (aspirations.length === 0) return 0.5

    const matches = aspirations.filter((aspiration) =>
      careerPaths.some(
        (path) =>
          path.toLowerCase().includes(aspiration.toLowerCase()) ||
          aspiration.toLowerCase().includes(path.toLowerCase()),
      ),
    )

    return matches.length / aspirations.length
  }

  private isLocationPreferred(preferences: string[], location: University["location"]): boolean {
    if (preferences.includes("Anywhere in India")) return true
    if (preferences.includes("International")) return false // Our data is India-focused

    if (location.type === "metro" && preferences.includes("Metro Cities (Mumbai, Delhi, Bangalore, etc.)")) return true
    if (location.type === "tier2" && preferences.includes("Tier 2 Cities")) return true
    if (preferences.includes("Same State")) return true // We'd need user's state for exact match
    if (preferences.includes("Nearby States")) return true

    return preferences.length === 0 // If no preference, all locations are fine
  }

  private isBudgetCompatible(budgetRange: string, annualFees: number): boolean {
    const budgetRanges: Record<string, [number, number]> = {
      "under-1lakh": [0, 100000],
      "1-3lakh": [100000, 300000],
      "3-5lakh": [300000, 500000],
      "5-10lakh": [500000, 1000000],
      "above-10lakh": [1000000, Number.POSITIVE_INFINITY],
    }

    const range = budgetRanges[budgetRange]
    return range ? annualFees >= range[0] && annualFees <= range[1] : true
  }

  private generateReasoning(
    userData: QuestionnaireData,
    university: University,
    course: Course,
    matchScore: number,
  ): string[] {
    const reasons: string[] = []

    if (matchScore > 0.8) {
      reasons.push("Excellent match based on your profile and preferences")
    } else if (matchScore > 0.6) {
      reasons.push("Good match with strong alignment to your goals")
    } else {
      reasons.push("Decent match with some alignment to your interests")
    }

    if (this.calculateCareerMatch(userData.careerAspirations, course.careerPaths) > 0.7) {
      reasons.push("Strong alignment with your career aspirations")
    }

    if (university.ranking.nirf && university.ranking.nirf <= 10) {
      reasons.push("Top-ranked institution with excellent reputation")
    }

    if (university.placements.placementRate > 90) {
      reasons.push("Outstanding placement record with high success rate")
    }

    if (this.isBudgetCompatible(userData.budgetRange, university.fees.annual)) {
      reasons.push("Fits within your specified budget range")
    }

    return reasons
  }

  private generatePros(university: University, course: Course): string[] {
    const pros: string[] = []

    if (university.ranking.nirf && university.ranking.nirf <= 20) {
      pros.push("Highly ranked institution")
    }

    if (university.placements.placementRate > 85) {
      pros.push(`${university.placements.placementRate}% placement rate`)
    }

    if (university.type === "government") {
      pros.push("Government institution with lower fees")
    }

    pros.push(`Average package: ${university.placements.averagePackage}`)

    if (university.facilities.length > 0) {
      pros.push(`Excellent facilities: ${university.facilities.slice(0, 2).join(", ")}`)
    }

    return pros
  }

  private generateCons(university: University, course: Course, userData: QuestionnaireData): string[] {
    const cons: string[] = []

    if (!this.isBudgetCompatible(userData.budgetRange, university.fees.annual)) {
      cons.push("May exceed your budget range")
    }

    if (university.eligibility.minimumPercentage > 80) {
      cons.push("High academic requirements for admission")
    }

    if (university.eligibility.entranceExams.length > 0) {
      cons.push(`Requires entrance exam: ${university.eligibility.entranceExams[0]}`)
    }

    if (university.location.type === "tier3") {
      cons.push("Located in smaller city with limited industry exposure")
    }

    return cons
  }

  private checkEligibility(
    userData: QuestionnaireData,
    university: University,
  ): "eligible" | "borderline" | "not-eligible" {
    const percentage = Number.parseFloat(userData.percentage.replace(/[^\d.]/g, ""))

    if (isNaN(percentage)) return "borderline"

    if (percentage >= university.eligibility.minimumPercentage + 10) {
      return "eligible"
    } else if (percentage >= university.eligibility.minimumPercentage - 5) {
      return "borderline"
    } else {
      return "not-eligible"
    }
  }

  private findScholarships(userData: QuestionnaireData, university: University): string[] {
    const scholarships: string[] = []

    if (university.type === "government") {
      scholarships.push("Government Merit Scholarship")
    }

    const percentage = Number.parseFloat(userData.percentage.replace(/[^\d.]/g, ""))
    if (percentage > 90) {
      scholarships.push("Merit-based Scholarship")
    }

    if (userData.budgetRange === "under-1lakh" || userData.budgetRange === "1-3lakh") {
      scholarships.push("Need-based Financial Aid")
    }

    scholarships.push("State Government Scholarship")

    return scholarships
  }
}

export const recommendationEngine = new RecommendationEngine()
