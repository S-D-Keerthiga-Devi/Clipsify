"use client"
import React from 'react'
import { MapPin, Mail } from 'lucide-react'
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

function Footer() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleNavigation = (link: string) => {
    // Check if the link requires authentication (dashboard routes)
    const requiresAuth = link.startsWith('/dashboard');

    if (requiresAuth && !session) {
      // Redirect to login with callback URL
      router.push(`/login?callbackUrl=${encodeURIComponent(link)}`);
    } else {
      // Navigate directly
      router.push(link);
    }
  };

  return (
    <footer className="relative w-full py-8 sm:py-12 md:py-16 bg-gradient-to-b from-gray-900 via-black to-black overflow-hidden border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl overflow-hidden">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12 pb-8 sm:pb-10 md:pb-12 border-b border-white/10">
          {/* Left - Brand & Tagline */}
          <div className="space-y-4 min-w-0">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              Build seamless media experiences fast using{' '}
              <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
                Clipsify
              </span>
            </h3>
          </div>

          {/* Right - Contact Info */}
          <div className="flex flex-col justify-center space-y-3 sm:space-y-4 min-w-0 overflow-hidden">
            <div className="flex items-start gap-2 sm:gap-3 text-gray-400">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-purple-400" />
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-white text-sm sm:text-base break-words overflow-wrap-anywhere">1234 Unknown Rd. Mystery, World</p>
                <p className="text-sm sm:text-base text-gray-400 break-words">0000, India</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-400 min-w-0 overflow-hidden">
              <Mail className="w-5 h-5 flex-shrink-0 text-purple-400" />
              <a
                href="mailto:support@clipsify.xyz"
                className="text-white hover:text-purple-400 transition-colors text-sm sm:text-base break-all overflow-wrap-anywhere truncate max-w-full block"
              >
                support@clipsify.xyz
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 gap-4 sm:gap-6">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 md:gap-8">
            <a
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium cursor-pointer"
              onClick={() => handleNavigation("/about")}
            >
              About
            </a>
            <a
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium cursor-pointer"
              onClick={() => handleNavigation("/dashboard/image")}
            >
              Images
            </a>
            <a
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium cursor-pointer"
              onClick={() => handleNavigation("/dashboard/video")}
            >
              Videos
            </a>
            <a
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium cursor-pointer"
              onClick={() => handleNavigation("/dashboard/profile")}
            >
              Profile
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © Copyright 2025. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer