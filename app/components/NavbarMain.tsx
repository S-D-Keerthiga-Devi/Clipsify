"use client"
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react";

const ReelsPlatformLogo = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      width="40"
      height="40"
      className="drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="purpleFillNav" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>

      {/* Play Triangle in White */}
      <path
        d="M 70 50 L 70 150 L 150 100 Z"
        fill="#ffffff"
        opacity="1"
      />

      {/* Stylized C — fully filled with gradient */}
      <path
        d="M 100 30
         C 145 30, 180 65, 180 110
         C 180 155, 145 190, 100 190
         C 65 190, 35 165, 25 130
         L 50 125
         C 57 150, 76 165, 100 165
         C 130 165, 155 140, 155 110
         C 155 80, 130 55, 100 55
         C 76 55, 57 70, 50 95
         L 25 90
         C 35 55, 65 30, 100 30 Z"
        fill="url(#purpleFillNav)"
        opacity="0.9"
      />

      {/* Accent Dot */}
      <circle
        cx="130"
        cy="110"
        r="6"
        fill="url(#purpleFillNav)"
        opacity="0.9"
      />
    </svg>
  );
};

export default function NavbarMain() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()
  const user = session?.user;

  // Hide navbar on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenProfile(false);
      }
    };

    if (openProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openProfile]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
            <ReelsPlatformLogo />
            <span className="text-white font-bold text-xl tracking-tight">Clipsify</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                if (pathname === '/') {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  router.push('/#features')
                }
              }}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => router.push('/about')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => {
                if (pathname === '/') {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  router.push('/#faq')
                }
              }}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
            >
              FAQ
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Button
                  onClick={() => router.push('/login')}
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-purple-500/10 font-medium cursor-pointer"
                >
                  Login
                </Button>
                <Button
                  onClick={() => router.push('/register')}
                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-6 rounded-full shadow-lg shadow-purple-500/30 transition-all duration-200 cursor-pointer"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Profile bubble */}
                <div
                  onClick={() => setOpenProfile(!openProfile)}
                  className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer select-none text-white font-bold"
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {/* Dropdown */}
                {openProfile && (
                  <div className="absolute right-0 mt-3 w-40 bg-[#13131A] border border-purple-500/20 rounded-xl shadow-xl p-2 flex flex-col animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => {
                        router.push("/dashboard/home");
                        setOpenProfile(false);
                      }}
                      className="px-4 py-2 text-left text-gray-300 hover:bg-purple-500/10 rounded-lg cursor-pointer"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2 text-left text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-purple-500/20 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-3">
            {/* Navigation Links */}
            <button
              onClick={() => {
                if (pathname === '/') {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  router.push('/#features')
                }
                setIsMobileMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors text-sm font-medium"
            >
              Features
            </button>
            <button
              onClick={() => {
                router.push('/about')
                setIsMobileMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors text-sm font-medium"
            >
              About
            </button>
            <button
              onClick={() => {
                if (pathname === '/') {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  router.push('/#faq')
                }
                setIsMobileMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors text-sm font-medium"
            >
              FAQ
            </button>

            {/* Auth Buttons */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              {!user ? (
                <>
                  <Button
                    onClick={() => {
                      router.push('/login')
                      setIsMobileMenuOpen(false)
                    }}
                    variant="ghost"
                    className="w-full text-gray-300 hover:text-white hover:bg-purple-500/10 justify-start"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      router.push('/register')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      router.push('/dashboard/home')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => {
                      signOut()
                      setIsMobileMenuOpen(false)
                    }}
                    variant="ghost"
                    className="w-full text-red-400 hover:bg-red-500/10 justify-start"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}