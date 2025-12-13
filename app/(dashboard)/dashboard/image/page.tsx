"use client"
import React, { useEffect, useState } from 'react'
import { Image as ImageIconLucide, Loader2, X } from 'lucide-react'
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Images } from '@/types.images'

function Imagepage() {
  const [images, setImages] = useState<Images[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<Images | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/image')
        if (!res.ok) throw new Error("failed to fetch images")
        const data: Images[] = await res.json()
        setImages(data)
      } catch (error) {
        console.log("error fetching images", error)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#12121A] to-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading images...</p>
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#12121A] to-[#0A0A0F]">
        {/* Ambient Background Effects */}
        <div className="fixed inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-1/3 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ImageIconLucide className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Images Found</h2>
            <p className="text-gray-400">Start by uploading your first image.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#12121A] to-[#0A0A0F]">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/3 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Image Gallery
          </h1>
          <p className="text-gray-400 text-lg">
            Browse and manage your image collection.
          </p>
        </div>

        {/* Images Grid - Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image) => (
            <div key={image._id} className="break-inside-avoid">
              <Card
                onClick={() => setSelectedImage(image)}
                className="bg-gradient-to-b from-[#1E1E2E]/95 to-[#1A1A28]/95 backdrop-blur-2xl border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <div className="w-full bg-gray-900 flex items-center justify-center">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-auto object-contain transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        console.error('Failed to load image:', image.imageUrl);
                      }}
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h2 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">
                    {image.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {image.description}
                  </p>

                  {/* Posted By Info */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-800/50">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-purple-600 text-[10px] text-white">
                        {image.postedBy?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-gray-500 text-xs">
                      @ <span className="text-purple-400">{image.postedBy?.name || "Unknown"}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* IMAGE MODAL */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <VisuallyHidden>
          <DialogTitle>{selectedImage?.title || "Image Viewer"}</DialogTitle>
          <DialogDescription>Image viewer dialog</DialogDescription>
        </VisuallyHidden>

        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl overflow-hidden">
          {selectedImage && (
            <div className="flex flex-col max-h-[90vh]">
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* IMAGE CONTAINER */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
                <img
                  src={selectedImage.imageUrl} // Use direct URL for full quality in modal
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>

              {/* INFO */}
              <div className="p-6 bg-[#1A1A28] border-t border-gray-800 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-white text-xl font-bold">{selectedImage.title}</h2>
                    <p className="text-gray-400 text-sm mt-2">{selectedImage.description}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-purple-600 text-xs text-white">
                        {selectedImage.postedBy?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Posted by</span>
                      <span className="text-sm text-purple-400 font-medium">{selectedImage.postedBy?.name || "Unknown"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Imagepage