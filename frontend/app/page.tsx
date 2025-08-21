"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, BookOpen, MessageCircle, TrendingUp, Shield, BarChart3, User, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      

      

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Future Starts with the Right Choice
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Navigate your post-12th journey with confidence. Get personalized university recommendations, career
                guidance, and scholarship insights powered by advanced AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link href="/questionnaire">
                    <Button size="lg" className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700">
                      Take Assessment
                    </Button>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </Link>
                )}
                {!user && (
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                      Already have an account? Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="/hero-illustration.jpg"
                alt="Students collaborating with innovative ideas"
                className="w-full max-w-md h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions for Logged-in Users */}
      {user && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Quick Actions</h2>
              <p className="text-muted-foreground">Continue your journey with these quick actions</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link href="/questionnaire">
                <Card className="border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <CardHeader className="p-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Take Assessment</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Complete or retake your assessment for better recommendations
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/recommendations">
                <Card className="border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <CardHeader className="p-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">View Recommendations</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      See your personalized university recommendations
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/chat">
                <Card className="border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <CardHeader className="p-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">AI Counsellor</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Chat with our AI for instant guidance and support
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      )}

      

      {/* Why Choose AURA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose AURA?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides everything you need to make informed decisions about your future.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-black" />
                  </div>
                  <CardTitle className="text-lg">Personalized Recommendations</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Get AI-powered suggestions based on your academic background and career aspirations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-black" />
                  </div>
                  <CardTitle className="text-lg">Comprehensive Database</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Access information about thousands of universities, courses, and career paths.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-black" />
                  </div>
                  <CardTitle className="text-lg">24/7 AI Counsellor</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Chat with our AI counsellor anytime for instant guidance and support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-black" />
                  </div>
                  <CardTitle className="text-lg">Scholarship Guidance</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Discover scholarships and financial aid opportunities you may be eligible for.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-black" />
                  </div>
                  <CardTitle className="text-lg">Smart Analysis</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Compare universities side-by-side with detailed metrics and insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-black" />
                  </div>
                  <CardTitle className="text-lg">Career Visualization</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Explore potential career paths and growth opportunities in your field of interest.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-12 text-center text-white">
            {user ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Your Path?</h2>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                  Complete your assessment to get personalized university recommendations and career guidance.
                </p>
                <Link href="/questionnaire">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-3 bg-white text-black hover:bg-gray-100">
                    Take Assessment Now →
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Your Path?</h2>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of students who have found their perfect university and career match with AURA.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-3 bg-white text-black hover:bg-gray-100">
                      Get Started Now →
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent text-white border-white hover:bg-white hover:text-black">
                      Already have an account? Login
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
