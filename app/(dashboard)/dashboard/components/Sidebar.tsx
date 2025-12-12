"use client";
import React, { useState, useEffect, useRef } from "react";
import { Home, Video, Image, Users, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"

export default function Sidebar() {
  const [openProfile, setOpenProfile] = useState(false)
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession()

  const user = session?.user
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Extract the first letter safely
  const firstLetter =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  const menuItems = [
    { icon: Home, label: "Home", link: "/dashboard/home" },
    { icon: Video, label: "Videos", link: "/dashboard/video" },
    { icon: Image, label: "Images", link: "/dashboard/image" },
    { icon: Users, label: "Profile", link: "/dashboard/profile" },
  ];

  const handleNavigation = (link: string) => router.push(link);

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
    <div className="fixed left-0 top-0 min-h-screen h-full w-16 md:w-20 bg-[#0A0A0F] border-r border-gray-800/50 flex flex-col items-center py-4 md:py-6 pb-4 z-50">

      {/* Logo */}
      <div className="mb-6 md:mb-8 w-10 h-10 md:w-12 md:h-12 cursor-pointer"
      onClick={()=> handleNavigation("/")}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="purpleFill" x1="0%" y1="0%" x2="100%" y2="100%">
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
            fill="url(#purpleFill)"
            opacity="0.9"
          />

          {/* Accent Dot */}
          <circle
            cx="130"
            cy="110"
            r="6"
            fill="url(#purpleFill)"
            opacity="0.9"
          />
        </svg>
      </div>


      {/* Upload Button */}
      <Button
        size="icon"
        className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 mb-6 md:mb-8 transition-all cursor-pointer"
        onClick={() => handleNavigation("/dashboard/fileUpload")}
      >
        <Plus className="w-5 h-5 text-gray-300" />
      </Button>

      {/* Sidebar Menu */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3 ">
        {menuItems.map(({ icon: Icon, link, label }, index) => {
          let isActive = false;
          if (label === "Home") {
            isActive = pathname === "/dashboard" || pathname === "/dashboard/home";
          } else {
            isActive = pathname.startsWith(link);
          }

          return (
            <Button
              key={index}
              size="icon"
              variant="ghost"
              className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl transition-all cursor-pointer ${isActive
                ? "bg-gradient-to-br from-purple-600 to-purple-500 shadow-lg shadow-purple-500/20"
                : "hover:bg-gray-800/50"
                }`}
              onClick={() => handleNavigation(link)}
            >
              <Icon className={isActive ? "text-white" : "text-gray-400"} />
            </Button>
          );
        })}
      </nav>

      <div className="relative mt-4" ref={dropdownRef}>
        {/* Profile Circle */}
        {user && (
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-purple-500/50 transition-all"
            onClick={() => setOpenProfile(!openProfile)}
          >
            <span className="text-white font-bold text-base md:text-lg">
              {firstLetter}
            </span>
          </div>
        )}

        {/* Dropdown Menu */}
        {openProfile && (
          <div className="absolute left-14 md:left-16 bottom-0 mb-2 w-36 bg-[#111] rounded-xl shadow-lg border border-gray-800/50 p-2 animate-fadeIn z-50">
            <button
              onClick={() => {
                router.push("/");
                setOpenProfile(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-lg transition cursor-pointer"
            >
              Home
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>

    </div>
  );
}