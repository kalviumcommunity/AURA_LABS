"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/aura-logo.png" alt="AURA Logo" className="w-12 h-12" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/questionnaire" className="text-sm font-medium hover:text-primary transition-colors">
            Get Started
          </Link>
          <Link href="/recommendations" className="text-sm font-medium hover:text-primary transition-colors">
            Result
          </Link>
          <Link href="/compare" className="text-sm font-medium hover:text-primary transition-colors">
            Compare
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window as any).botpressWebChat?.sendEvent({ type: "show" })}
              >
                Chat
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/signup">
              <Button
                size="sm"
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white bg-transparent"
              >
                Login/Signup
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/questionnaire"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
            <Link
              href="/recommendations"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Result
            </Link>
            <Link
              href="/compare"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Compare
            </Link>
            <div className="pt-4 border-t">
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
                  <Button variant="outline" size="sm" onClick={logout} className="w-full bg-transparent">
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-black text-black hover:bg-black hover:text-white bg-transparent"
                  >
                    Login/Signup
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
