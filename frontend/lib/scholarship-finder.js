import { scholarshipsData } from "@/data/scholarships"
import { entranceExamsData } from "@/data/entrance-exams"

export class ScholarshipFinder {
  constructor() {
    this.scholarships = scholarshipsData
    this.exams = entranceExamsData
  }

  findRelevantScholarships(userData) {
    return this.scholarships
      .filter((scholarship) => this.isScholarshipEligible(scholarship, userData))
      .sort((a, b) => this.calculateScholarshipScore(b, userData) - this.calculateScholarshipScore(a, userData))
  }

  findRelevantExams(userData) {
    return this.exams
      .filter((exam) => this.isExamRelevant(exam, userData))
      .sort((a, b) => this.calculateExamRelevance(b, userData) - this.calculateExamRelevance(a, userData))
  }

  isScholarshipEligible(scholarship, userData) {
    // Check education level
    if (!scholarship.eligibility.educationLevel.includes(userData.educationLevel)) {
      return false
    }

    // Check minimum percentage
    const userPercentage = Number.parseFloat(userData.percentage.replace(/[^\d.]/g, ""))
    if (isNaN(userPercentage) || userPercentage < scholarship.eligibility.minimumPercentage) {
      return false
    }

    // Check course compatibility if specified
    if (scholarship.eligibility.course && scholarship.eligibility.course.length > 0) {
      const userStream = userData.stream.toLowerCase()
      const eligibleCourses = scholarship.eligibility.course.map((c) => c.toLowerCase())
      if (!eligibleCourses.some((course) => userStream.includes(course) || course.includes(userStream))) {
        return false
      }
    }

    return scholarship.isActive
  }

  isExamRelevant(exam, userData) {
    // Check education level
    if (!exam.eligibility.educationLevel.includes(userData.educationLevel)) {
      return false
    }

    // Check stream compatibility
    const userStream = userData.stream.toLowerCase()
    const examStreams = exam.applicableFor.streams.map((s) => s.toLowerCase())

    if (!examStreams.some((stream) => stream.includes(userStream) || userStream.includes(stream))) {
      return false
    }

    // Check minimum percentage
    const userPercentage = Number.parseFloat(userData.percentage.replace(/[^\d.]/g, ""))
    if (isNaN(userPercentage) || userPercentage < exam.eligibility.minimumPercentage) {
      return false
    }

    return exam.isActive
  }

  calculateScholarshipScore(scholarship, userData) {
    let score = 0

    // Higher amount = higher score
    score += (scholarship.amount.max / 100000) * 10

    // Government scholarships get preference
    if (scholarship.provider === "government") score += 20

    // Merit-based scholarships for high performers
    const userPercentage = Number.parseFloat(userData.percentage.replace(/[^\d.]/g, ""))
    if (scholarship.type === "merit" && userPercentage > 80) score += 15

    // Need-based for budget-conscious students
    if (
      scholarship.type === "need-based" &&
      (userData.budgetRange === "under-1lakh" || userData.budgetRange === "1-3lakh")
    ) {
      score += 25
    }

    return score
  }

  calculateExamRelevance(exam, userData) {
    let score = 0

    // National exams get higher priority
    if (exam.type === "national") score += 30
    else if (exam.type === "state") score += 20
    else score += 10

    // Match with career aspirations
    const careerMatch = userData.careerAspirations.some((career) =>
      exam.applicableFor.courses.some(
        (course) =>
          career.toLowerCase().includes(course.toLowerCase()) || course.toLowerCase().includes(career.toLowerCase()),
      ),
    )
    if (careerMatch) score += 25

    // Stream perfect match
    const streamMatch = exam.applicableFor.streams.some((stream) =>
      stream.toLowerCase().includes(userData.stream.toLowerCase()),
    )
    if (streamMatch) score += 20

    return score
  }

  getExamById(examId) {
    return this.exams.find((exam) => exam.id === examId)
  }

  getScholarshipById(scholarshipId) {
    return this.scholarships.find((scholarship) => scholarship.id === scholarshipId)
  }
}

export const scholarshipFinder = new ScholarshipFinder()

