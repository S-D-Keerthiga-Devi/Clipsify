"use client"
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function RegisterPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return;
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      console.log(data)
      router.push("/login")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsSocialLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Google sign in error:", error)
    } finally {
      setIsSocialLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setIsSocialLoading(true)
    try {
      await signIn("github", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Github sign in error:", error)
    } finally {
      setIsSocialLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#0A0A0F] via-[#12121A] to-[#0A0A0F] p-4">
      {/* Ambient purple glow */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl"></div>

      {/* Register Card */}
      <Card className="w-full max-w-[420px] bg-gradient-to-b from-[#1E1E2E]/95 to-[#1A1A28]/95 backdrop-blur-2xl border-2 border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.15)] rounded-[32px] relative z-10 mt-20 mb-20">
        <CardHeader className="space-y-1 pt-4 pb-1 px-8">
          <CardTitle className="text-4xl font-bold text-white text-center tracking-tight">
            Clipsify
          </CardTitle>
          <p className="text-center text-gray-400 text-sm">
            Create a new account to get started.
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-4">
          <form onSubmit={handleSubmit} className="space-y-3 mt-1">
            {/* Name Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="name"
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter your Name'
                className="h-12 px-5 bg-white rounded-full text-gray-900 placeholder-gray-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
            
            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your Email Address'
                className="h-12 px-5 bg-white rounded-full text-gray-900 placeholder-gray-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder='Enter your Password'
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-5 bg-white rounded-full text-gray-900 placeholder-gray-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <Label htmlFor="confirm-password" className="text-gray-300 text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                placeholder='Confirm your Password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 px-5 bg-white rounded-full text-gray-900 placeholder-gray-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold rounded-full text-base shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center mt-4"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative py-1 mt-2 mb-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#1A1A28] px-3 text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isSocialLoading}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </Button>

            <Button
              onClick={handleGithubSignIn}
              disabled={isSocialLoading}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Button>
          </div>

          {/* Login Link - at bottom */}
          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
            <Button
              variant="link"
              className="text-purple-400 hover:text-purple-300 font-semibold p-0 h-auto cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage