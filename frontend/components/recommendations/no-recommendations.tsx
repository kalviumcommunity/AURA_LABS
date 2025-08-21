"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Lightbulb, TrendingUp, Target, BookOpen } from "lucide-react"

interface NoRecommendationsProps {
  message: string
  suggestions: string[]
}

export function NoRecommendations({ message, suggestions }: NoRecommendationsProps) {
  const getSuggestionIcon = (suggestion: string) => {
    if (suggestion.toLowerCase().includes('budget')) return <TrendingUp className="h-4 w-4" />
    if (suggestion.toLowerCase().includes('location')) return <Target className="h-4 w-4" />
    if (suggestion.toLowerCase().includes('percentage') || suggestion.toLowerCase().includes('score')) return <BookOpen className="h-4 w-4" />
    return <Lightbulb className="h-4 w-4" />
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-yellow-600" />
        </div>
        <CardTitle className="text-xl text-yellow-800">No Recommendations Found</CardTitle>
        <CardDescription className="text-base text-gray-600 mt-2">
          {message}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            Suggestions to improve your search:
          </h3>
          
          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="mt-0.5 text-blue-600">
                  {getSuggestionIcon(suggestion)}
                </div>
                <span className="text-sm text-gray-700">{suggestion}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Try adjusting your preferences or improving your academic profile to get better matches.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

