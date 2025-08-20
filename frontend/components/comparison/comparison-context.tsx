"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { University, Course } from "@/types/university"

interface ComparisonItem {
  university: University
  course: Course
}

interface ComparisonContextType {
  items: ComparisonItem[]
  addToComparison: (university: University, course: Course) => void
  removeFromComparison: (universityId: string, courseId: string) => void
  clearComparison: () => void
  isInComparison: (universityId: string, courseId: string) => boolean
  maxItems: number
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ComparisonItem[]>([])
  const maxItems = 4 // Maximum universities to compare

  const addToComparison = (university: University, course: Course) => {
    setItems((prev) => {
      // Check if already exists
      const exists = prev.some((item) => item.university.id === university.id && item.course.id === course.id)
      if (exists || prev.length >= maxItems) return prev

      return [...prev, { university, course }]
    })
  }

  const removeFromComparison = (universityId: string, courseId: string) => {
    setItems((prev) => prev.filter((item) => !(item.university.id === universityId && item.course.id === courseId)))
  }

  const clearComparison = () => {
    setItems([])
  }

  const isInComparison = (universityId: string, courseId: string) => {
    return items.some((item) => item.university.id === universityId && item.course.id === courseId)
  }

  return (
    <ComparisonContext.Provider
      value={{
        items,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        maxItems,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider")
  }
  return context
}
