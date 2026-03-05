"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Trophy, Lock } from "lucide-react"
import { loginMember } from "@/lib/api"
import Link from "next/link"
import { toast } from "sonner"

export default function MemberLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get("redirect")
  const redirectTo =
    rawRedirect && rawRedirect.startsWith("/member/") ? rawRedirect : "/member/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // If already logged in and has redirect, go there
  useEffect(() => {
    if (typeof window !== "undefined") {
      const memberData = localStorage.getItem("memberData")
      if (memberData && redirectTo) {
        router.push(redirectTo)
      }
    }
  }, [router, redirectTo])

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      setLoading(true)
      setError("")
      const response = await loginMember(email, password)
      
      if (response.success) {
        // Store member data in localStorage
        localStorage.setItem('memberData', JSON.stringify(response.data))
        router.push(redirectTo)
      } else {
        setError(response.message || "Login failed")
      }
    } catch (error) {
      console.error('Login error:', error)
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
            ← Back to Home
          </Link>
        </div>

        <Card className="shadow-2xl border-orange-100">
          <CardHeader className="text-center space-y-3">
            <div className="w-16 h-16 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-8 w-8 text-orange-500" />
            </div>
            <CardTitle className="text-2xl">Member Portal</CardTitle>
            <CardDescription>
              Access your XP dashboard and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                disabled={loading}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleLogin} 
              className="w-full bg-orange-500 hover:bg-orange-600" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Login
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              <p>Don't have access yet?</p>
              <p className="mt-1">Contact your chapter administrator to get your credentials.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
