"use client"
import React, { useState } from 'react'
import FileUpload from '../components/FileUpload'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Image, Video, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useSession } from "next-auth/react";

// Type definitions for payloads
interface ImagePayload {
  title: string;
  description: string;
  postedBy: {
    id: string;
    name: string | null | undefined;
    email: string | null | undefined;
  };
  imageUrl: string;
  transformation: {
    width: number;
    height: number;
    quality: number;
  };
}

interface VideoPayload {
  title: string;
  description: string;
  postedBy: {
    id: string;
    name: string | null | undefined;
    email: string | null | undefined;
  };
  videoUrl: string;
  thumbnailUrl: string;
}

const FileUploadpage = () => {
  const [activeTab, setActiveTab] = useState<"image" | "video">("image")
  const [uploadResponse, setUploadResponse] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")

  const { data: session } = useSession();
  const user = session?.user;

  const handleImageUploadSuccess = async (res: { url: string; fileId: string }) => {
    if (!user) {
      setMessage("You must be logged in to upload files.");
      setMessageType("error");
      return;
    }

    setIsUploading(true)
    setMessage("Saving image details to database...")
    setMessageType("info")

    try {
      const payload: ImagePayload = {
        title,
        description,
        postedBy: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        imageUrl: res.url,
        transformation: {
          width: 1080,
          height: 1920,
          quality: 100,
        },
      };

      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error("Failed to save image metadata")
      }

      setMessage("Image uploaded successfully!");
      setMessageType("success")
      setUploadResponse(res)

      // Clear form
      setTitle("")
      setDescription("")

    } catch (error) {
      console.log("error saving image:", error)
      setMessage("Failed to save image. Please try again.")
      setMessageType("error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleVideoUploadSuccess = async (res: { url: string; fileId: string }) => {
    if (!user) {
      setMessage("You must be logged in to upload files.");
      setMessageType("error");
      return;
    }

    setIsUploading(true)
    setMessage("Saving video details to database...")
    setMessageType("info")

    try {
      const payload: VideoPayload = {
        title,
        description,
        postedBy: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        videoUrl: res.url,
        thumbnailUrl: res.url,
      };

      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error("Failed to save video metadata")
      }

      setMessage("Video uploaded successfully!");
      setMessageType("success")
      setUploadResponse(res)

      // Clear form
      setTitle("")
      setDescription("")

    } catch (error) {
      console.log("error saving video:", error)
      setMessage("Failed to save video. Please try again.")
      setMessageType("error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUploadError = (error: Error) => {
    setMessage(`Image upload failed: ${error.message}`);
    setMessageType("error");
  }

  const handleVideoUploadError = (error: Error) => {
    setMessage(`Video upload failed: ${error.message}`);
    setMessageType("error");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#12121A] to-[#0A0A0F]">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed top-1/4 right-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8 max-w-full sm:max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
            Upload Media
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Add images and videos to your creative library.
          </p>
        </div>

        {/* Main Upload Card */}
        <Card className="bg-gradient-to-b from-[#1E1E2E]/95 to-[#1A1A28]/95 backdrop-blur-2xl border-2 border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.15)] rounded-2xl sm:rounded-3xl">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-lg">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl sm:text-2xl">File Upload</CardTitle>
                <CardDescription className="text-gray-400 text-sm sm:text-base">
                  Choose file type and enter details
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "image" | "video")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#12121A] border border-gray-800/50 p-1 rounded-xl sm:rounded-2xl h-12 sm:h-14">
                <TabsTrigger
                  value="image"
                  className="rounded-lg sm:rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400 font-medium transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Image className="w-4 h-4 hidden sm:inline" />
                  <span>Upload Image</span>
                </TabsTrigger>
                <TabsTrigger
                  value="video"
                  className="rounded-lg sm:rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400 font-medium transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Video className="w-4 h-4 hidden sm:inline" />
                  <span>Upload Video</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-4 sm:space-y-5 mt-4 sm:mt-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="image-title" className="text-gray-300 text-sm font-medium">
                    Image Title
                  </Label>
                  <Input
                    id="image-title"
                    type="text"
                    placeholder="Enter image title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 sm:h-12 px-4 sm:px-5 bg-[#12121A] border-gray-800/50 rounded-xl text-white placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-0 focus-visible:border-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Description Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="image-description" className="text-gray-300 text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="image-description"
                    placeholder="Enter image description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px] sm:min-h-[100px] px-4 sm:px-5 py-2 sm:py-3 bg-[#12121A] border-gray-800/50 rounded-xl text-white placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-0 focus-visible:border-transparent resize-none text-sm sm:text-base"
                  />
                </div>

                {/* File Upload Component */}
                <div className="pt-2">
                  <FileUpload
                    fileType="image"
                    onSuccess={handleImageUploadSuccess}
                    onError={handleImageUploadError}
                  />
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4 sm:space-y-5 mt-4 sm:mt-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="video-title" className="text-gray-300 text-sm font-medium">
                    Video Title
                  </Label>
                  <Input
                    id="video-title"
                    type="text"
                    placeholder="Enter video title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 sm:h-12 px-4 sm:px-5 bg-[#12121A] border-gray-800/50 rounded-xl text-white placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-0 focus-visible:border-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Description Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="video-description" className="text-gray-300 text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="video-description"
                    placeholder="Enter video description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px] sm:min-h-[100px] px-4 sm:px-5 py-2 sm:py-3 bg-[#12121A] border-gray-800/50 rounded-xl text-white placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-0 focus-visible:border-transparent resize-none text-sm sm:text-base"
                  />
                </div>

                {/* File Upload Component */}
                <div className="pt-2">
                  <FileUpload
                    fileType="video"
                    onSuccess={handleVideoUploadSuccess}
                    onError={handleVideoUploadError}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Status Messages */}
            {isUploading && (
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <p className="text-blue-400 font-medium text-sm sm:text-base">{message}</p>
              </div>
            )}

            {message && !isUploading && messageType === "success" && (
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <p className="text-green-400 font-medium text-sm sm:text-base">{message}</p>
              </div>
            )}

            {message && !isUploading && messageType === "error" && (
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-medium text-sm sm:text-base">{message}</p>
              </div>
            )}

            {/* Upload Response */}
            {uploadResponse && !isUploading && (
              <Card className="bg-[#12121A] border-gray-800/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-1">File uploaded successfully!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FileUploadpage