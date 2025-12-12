"use client"
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import DarkVeil from './DarkVeil'

export default function Hero() {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background - Full Viewport */}
      <div className="fixed inset-0 -z-10">
        <DarkVeil
          hueShift={0.5}
          noiseIntensity={0.02}
          scanlineIntensity={0.05}
          speed={0.3}
          scanlineFrequency={1.5}
          warpAmount={0.5}
          resolutionScale={1.8}
        />
      </div>

      {/* Gradient Overlay for Better Text Contrast */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Content Overlay - Centered */}
      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 py-12">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Main Heading */}
          <div className="space-y-6 max-w-5xl">
            <h1 className="tracking-tight text-white">
              {/* Top Line - Small accent text */}
              <span className="font-sans font-medium text-sm sm:text-base md:text-lg uppercase tracking-[0.3em] text-purple-400/90 block mb-4">
                Where Creators Shine
              </span>

              {/* Main Headline - Large and Bold */}
              <span className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-7xl block leading-[0.95] mb-3">
                Lights.{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-purple-400 via-white to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Camera.
                  </span>
                  
                </span>
              </span>

              <span className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-7xl block leading-[0.95]">
                <span className="relative inline-block">
                  <span className="font-serif italic bg-gradient-to-r from-purple-400 via-purple-300 to-white bg-clip-text text-transparent">
                    Influence
                  </span>
                  
                </span>
                .
              </span>
            </h1>

            <p className="mt-8 font-sans text-base sm:text-lg md:text-xl font-normal leading-relaxed text-white/70 max-w-2xl mx-auto">
              Transform everyday moments into viral sensations. Your creativity, amplified. Your voice, heard worldwide.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex items-center justify-center mt-6">
            <Button
              onClick={handleGetStarted}
              className="
                cursor-pointer
                inline-flex
                items-center
                justify-center
                px-8
                py-3
                font-sans
                text-base
                font-semibold
                transition-all
                duration-300
                rounded-full
                bg-gradient-to-r
                from-purple-500
                to-purple-600
                sm:text-lg
                text-white
                hover:from-purple-600
                hover:to-purple-700
                hover:shadow-xl
                hover:shadow-purple-500/50
                hover:scale-105
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-purple-500
                active:scale-100
              "
            >
              {session ? 'Go to Dashboard' : 'Get Started'}
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}