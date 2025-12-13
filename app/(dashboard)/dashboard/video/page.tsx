"use client"
import React, { useEffect, useState } from 'react'
import { Search, Bell, Upload, X, Play } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Videos } from '@/types.video'

function VideoPage() {
  const [videos, setVideos] = useState<Videos[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Videos | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [publicVideoUrl, setPublicVideoUrl] = useState<string | null>(null)

  const categories = ['All', 'Trending', 'Music', 'Travel', 'Gaming', 'Edits', 'Cinematic', 'VFX']

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/video')
        if (!res.ok) throw new Error("failed to fetch videos")
        const data: Videos[] = await res.json()
        setVideos(data)
      } catch (error) {
        console.log("error fetching videos", error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // Get public URL when a video is selected
  useEffect(() => {
    const getPublicUrl = async () => {
      if (!selectedVideo) return;

      try {
        const res = await fetch('/api/video/public', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoUrl: selectedVideo.videoUrl }),
        });

        if (!res.ok) throw new Error("Failed to get public URL");

        const data = await res.json();
        setPublicVideoUrl(data.publicUrl);
      } catch (error) {
        console.error("Error getting public URL:", error);
        // Fallback to original URL
        setPublicVideoUrl(selectedVideo.videoUrl);
      }
    };

    getPublicUrl();
  }, [selectedVideo]);

  const closeVideoModal = () => {
    setSelectedVideo(null)
    setPublicVideoUrl(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-xl font-medium">Loading videos...</p>
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        No videos found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">

      {/* VIDEO GRID */}
      <main className="max-w-[1920px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} onClick={() => setSelectedVideo(video)} />
          ))}
        </div>
      </main>

      {/* VIDEO MODAL */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && closeVideoModal()}>
        <VisuallyHidden>
          <DialogTitle>{selectedVideo?.title || "Video Player"}</DialogTitle>
          <DialogDescription>Video playback dialog</DialogDescription>
        </VisuallyHidden>

        <DialogContent className="max-w-6xl w-[95vw] p-0 bg-black/90 backdrop-blur-xl border border-purple-500/40 rounded-2xl overflow-hidden">
          {selectedVideo && (
            <>
              {/* CLOSE BUTTON */}
              <Button
                onClick={closeVideoModal}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full z-10 cursor-pointer"
              >
                <X />
              </Button>

              {/* VIDEO PLAYER - Using native video element */}
              <div className="relative bg-black aspect-video">
                {publicVideoUrl ? (
                  <video
                    src={publicVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    // Add these attributes to avoid transformation issues
                    preload="metadata"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="p-6 bg-[#1A1A28] border-t border-gray-800">
                <h2 className="text-white text-xl font-bold">{selectedVideo.title}</h2>
                <p className="text-gray-400 text-sm mt-2">{selectedVideo.description}</p>
                <p className="text-gray-500 text-[11px] mt-1">
                  @ <span className="text-purple-400">{selectedVideo.postedBy?.name || "Unknown"}</span>
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default VideoPage

function VideoCard({ video, onClick }: { video: Videos; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (hover) {
      videoRef.current?.play().catch(e => console.log("Play failed", e));
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [hover]);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer bg-transparent border-0 group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

          {/* Play Icon Overlay (visible when not hovering) */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hover ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="text-white fill-white w-6 h-6" />
            </div>
          </div>

          {/* Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-white text-sm font-bold line-clamp-1">{video.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                {video.postedBy?.name?.[0] || "U"}
              </div>
              <p className="text-gray-300 text-xs truncate">
                {video.postedBy?.name || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}