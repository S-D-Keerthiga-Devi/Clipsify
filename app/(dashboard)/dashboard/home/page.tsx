"use client"
import React, { useEffect, useState } from 'react'
import { Upload, Image as ImageIcon, Video as VideoIcon, ArrowRight, TrendingUp, Clock, Folder, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import type { Images } from '@/types.images'
import type { Videos } from '@/types.video'

function HomePage() {
  const { data: session } = useSession()
  const router = useRouter();

  const user = session?.user
  const userName = user?.name

  const [stats, setStats] = useState([
    { label: 'Images', value: '0', icon: ImageIcon, trend: '+0%' },
    { label: 'Videos', value: '0', icon: VideoIcon, trend: '+0%' },
    { label: 'Total Projects', value: '0', icon: TrendingUp, trend: '+0%' },
  ])

  const [images, setImages] = useState<Images[]>([])
  const [videos, setVideos] = useState<Videos[]>([])
  const [loadingContent, setLoadingContent] = useState(true)

  // Fetch statistics and content on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch statistics
        const statsResponse = await fetch('/api/stats')
        if (statsResponse.ok) {
          const data = await statsResponse.json()
          setStats([
            { label: 'Images', value: data.images.toString(), icon: ImageIcon, trend: '+12%' },
            { label: 'Videos', value: data.videos.toString(), icon: VideoIcon, trend: '+8%' },
            { label: 'Total Projects', value: data.totalProjects.toString(), icon: TrendingUp, trend: '+10%' },
          ])
        }

        // Fetch user's images (only their uploads)
        const imagesResponse = await fetch('/api/image/my')
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json()
          setImages(imagesData.slice(0, 6)) // Show only first 6
        }

        // Fetch user's videos (only their uploads)
        const videosResponse = await fetch('/api/video/my')
        if (videosResponse.ok) {
          const videosData = await videosResponse.json()
          setVideos(videosData.slice(0, 6)) // Show only first 6
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoadingContent(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const features = [
    {
      icon: Upload,
      title: 'Upload Content',
      description: 'Upload your videos and images with ease.',
      gradient: 'from-purple-600 to-purple-500',
      link: '/dashboard/fileUpload'
    },
    {
      icon: ImageIcon,
      title: 'Image Gallery',
      description: 'Organize and manage your image collections with ease.',
      gradient: 'from-pink-600 to-pink-500',
      link: '/dashboard/image'
    },
    {
      icon: VideoIcon,
      title: 'Video Gallery',
      description: 'Browse, edit, and share your video content seamlessly.',
      gradient: 'from-blue-600 to-blue-500',
      link: '/dashboard/video'
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#12121A] to-[#0A0A0F]">
      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/3 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">{userName}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Here's what's happening with your content today
          </p>
        </div>

        {/* Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="bg-gradient-to-b from-[#1E1E2E]/95 to-[#1A1A28]/95 backdrop-blur-2xl border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                        <p className="text-white text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  onClick={() => handleNavigation(feature.link)}
                  className="bg-gradient-to-b from-[#1E1E2E]/95 to-[#1A1A28]/95 backdrop-blur-2xl border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* My Images Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">My Images</h2>
            <Button
              onClick={() => handleNavigation('/dashboard/image')}
              variant="ghost"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {loadingContent ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <Card className="bg-gradient-to-b from-[#1E1E2E]/50 to-[#1A1A28]/50 backdrop-blur-xl border border-gray-800/50">
              <CardContent className="p-12 text-center">
                <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No images uploaded yet</p>
                <Button
                  onClick={() => handleNavigation('/dashboard/fileUpload')}
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  Upload Your First Image
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {images.map((image) => (
                <Card
                  key={image._id}
                  onClick={() => handleNavigation('/dashboard/image')}
                  className="bg-gradient-to-b from-[#1E1E2E]/95 to-[#1A1A28]/95 backdrop-blur-2xl border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group overflow-hidden"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="text-white text-sm font-medium truncate">{image.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* My Videos Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">My Videos</h2>
            <Button
              onClick={() => handleNavigation('/dashboard/video')}
              variant="ghost"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {loadingContent ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <Card className="bg-gradient-to-b from-[#1E1E2E]/50 to-[#1A1A28]/50 backdrop-blur-xl border border-gray-800/50">
              <CardContent className="p-12 text-center">
                <VideoIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No videos uploaded yet</p>
                <Button
                  onClick={() => handleNavigation('/dashboard/fileUpload')}
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  Upload Your First Video
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {videos.map((video) => (
                <Card
                  key={video._id}
                  onClick={() => handleNavigation('/dashboard/video')}
                  className="bg-gradient-to-b from-[#1E1E2E]/95 to-[#1A1A28]/95 backdrop-blur-2xl border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group overflow-hidden"
                >
                  <div className="aspect-[9/16] relative overflow-hidden bg-gray-900">
                    <video
                      src={video.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-3">
                    <p className="text-white text-sm font-medium truncate">{video.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage