"use client"
import React from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function CallToAction() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard/home')
    } else {
      router.push('/register')
    }
  }

  return (
    <section className="relative w-screen py-16 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center">
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Get Full Access to{' '}
            <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
              Clipsify
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-lg sm:text-xl font-medium text-gray-300">
            Unlimited uploads, advanced features, and premium support
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center px-4 mt-6 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex-row lg:mt-8 sm:px-0">
            <button
              onClick={handleGetStarted}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-500 border border-transparent rounded-full transition-all duration-200 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105 cursor-pointer"
            >
              {session ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => router.push(session ? '/dashboard/video' : '/login')}
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-transparent border-2 border-white/30 rounded-full transition-all duration-200 hover:bg-white hover:text-black hover:border-white backdrop-blur-sm cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 mr-2 -ml-1" />
              {session ? 'Explore Videos' : 'Contact Sales'}
            </button>
          </div>

          {/* Bottom Link */}
          <p className="mt-6 text-sm text-gray-400">
            {session ? (
              <>
                Want to manage your account?{' '}
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="text-purple-400 transition-all duration-200 hover:text-purple-300 hover:underline font-medium cursor-pointer"
                >
                  Go to Profile
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-purple-400 transition-all duration-200 hover:text-purple-300 hover:underline font-medium cursor-pointer"
                >
                  Log in
                </button>
              </>
            )}
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction