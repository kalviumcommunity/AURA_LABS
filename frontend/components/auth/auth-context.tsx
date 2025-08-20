"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  educationLevel: "grade12" | "diploma" | "equivalent" | null
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://aura-labs.onrender.com"

  useEffect(() => {
    const savedUser = localStorage.getItem("futurepath_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, authMethod: "local" }),
      })

      if (!response.ok) {
        setIsLoading(false)
        return false
      }

      const data = await response.json()

      const loggedInUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        educationLevel: null,
      }

      setUser(loggedInUser)
      localStorage.setItem("futurepath_user", JSON.stringify(loggedInUser))
      localStorage.setItem("futurepath_token", data.token)
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, authMethod: "local" }),
      })

      if (!response.ok) {
        setIsLoading(false)
        return false
      }

      const data = await response.json()

      const createdUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        educationLevel: null,
      }

      setUser(createdUser)
      localStorage.setItem("futurepath_user", JSON.stringify(createdUser))
      localStorage.setItem("futurepath_token", data.token)
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("futurepath_user")
    localStorage.removeItem("futurepath_token")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
