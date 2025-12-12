"use client"
import React, { useState, useEffect } from 'react'
import { User, Mail, Calendar, Edit2, Camera, Save, X, Loader2, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSession } from "next-auth/react"

function Profilepage() {
  const { data: session, update } = useSession()
  const user = session?.user

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    joinDate: '',
    profileCompleted: false,
  })

  const [stats, setStats] = useState([
    { label: 'Images', value: '0' },
    { label: 'Videos', value: '0' },
    { label: 'Total Projects', value: '0' },
  ])

  const [editData, setEditData] = useState(profileData)

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')

        // Try to fetch profile from API
        const response = await fetch('/api/profile')

        if (response.ok) {
          // Profile exists in database
          const data = await response.json()

          const formattedData = {
            name: data.name || user.name || '',
            email: data.email || user.email || '',
            bio: data.bio || '',
            location: data.location || '',
            joinDate: data.joinDate ? new Date(data.joinDate).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            }) : 'Recently',
            profileCompleted: data.profileCompleted || false,
          }

          setProfileData(formattedData)
          setEditData(formattedData)

          // Auto-open edit mode for new users
          if (!data.profileCompleted) {
            setIsEditing(true)
          }
        } else {
          // Profile doesn't exist or error occurred - use session data
          console.log('Profile not found in database, using session data')
          const formattedData = {
            name: user.name || '',
            email: user.email || '',
            bio: '',
            location: '',
            joinDate: 'Recently',
            profileCompleted: false,
          }
          setProfileData(formattedData)
          setEditData(formattedData)
          setIsEditing(true) // Auto-open edit for new users
        }

        // Try to fetch statistics (optional)
        try {
          const statsResponse = await fetch('/api/stats')
          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            setStats([
              { label: 'Images', value: statsData.images.toString() },
              { label: 'Videos', value: statsData.videos.toString() },
              { label: 'Total Projects', value: statsData.totalProjects.toString() },
            ])
          }
        } catch (statsError) {
          console.log('Stats not available:', statsError)
          // Keep default stats
        }

      } catch (err) {
        console.log('Error fetching profile, using session data:', err)

        // Fallback to session data
        const fallbackData = {
          name: user.name || '',
          email: user.email || '',
          bio: '',
          location: '',
          joinDate: 'Recently',
          profileCompleted: false,
        }
        setProfileData(fallbackData)
        setEditData(fallbackData)
        setIsEditing(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError('')
      setSuccessMessage('')

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editData.name,
          bio: editData.bio,
          location: editData.location,
        }),
      })

      // Check if save was successful
      let saveSuccessful = false
      let responseData = null

      if (response.ok) {
        responseData = await response.json()
        saveSuccessful = true
      } else {
        // Try to get error details
        try {
          responseData = await response.json()
          console.log('Profile update response:', response.status, responseData)
        } catch (e) {
          console.log('Profile update failed with status:', response.status)
        }

        // Show user-friendly error message
        if (response.status === 404) {
          setError('Profile not found. Please try logging out and back in.')
        } else if (response.status === 401) {
          setError('Session expired. Please log in again.')
        } else {
          setError(`Unable to save profile (Error ${response.status}). Please try again.`)
        }

        // Still update local state so user sees their changes
        setProfileData(editData)
        setIsEditing(false)
        setIsSaving(false)
        return
      }

      // If name changed, update it in all images and videos
      if (profileData.name !== editData.name) {
        try {
          // Update name in images (don't wait for response)
          fetch('/api/image/update-name', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newName: editData.name }),
          }).catch(err => console.log('Image name update failed:', err))

          // Update name in videos (don't wait for response)
          fetch('/api/video/update-name', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newName: editData.name }),
          }).catch(err => console.log('Video name update failed:', err))
        } catch (err) {
          console.log('Error updating name in content:', err)
        }
      }

      setProfileData(editData)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')

      // Update session to reflect profile completion
      if (update) {
        await update().catch(err => console.log('Session update failed:', err))
      }

      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.log('Error saving profile:', err)
      setError('Network error. Please check your connection and try again.')

      // Still update local state
      setProfileData(editData)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
    setError('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#12121A] to-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#12121A] to-[#0A0A0F]">
      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/3 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 mt-2 sm:mt-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
            Profile
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-green-400 text-sm sm:text-base">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 sm:gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {/* New User Prompt */}
        {!profileData.profileCompleted && (
          <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/50 rounded-lg">
            <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">Welcome! Complete Your Profile</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Please fill in your profile information to get started. Add your bio and location to personalize your account.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-b from-[#1E1E2E]/95 to-[#1A1A28]/95 backdrop-blur-2xl border border-gray-800/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <CardTitle className="text-white text-xl sm:text-2xl">Personal Information</CardTitle>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm sm:text-base cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Edit Profile</span>
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm sm:text-base cursor-pointer"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
                            <span className="hidden sm:inline">Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Save</span>
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        disabled={isSaving}
                        variant="outline"
                        className="border-gray-700 text-gray-500 hover:bg-gray-800 rounded-full text-sm sm:text-base cursor-pointer"
                      >
                        <X className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Cancel</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-800">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                      {profileData.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold">{profileData.name || 'User'}</h3>
                    <p className="text-gray-400 text-sm">Member since {profileData.joinDate}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full bg-[#0A0A0F]/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-white text-lg">{profileData.name || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Email</label>
                    <p className="text-white text-lg">{profileData.email}</p>
                    <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        rows={3}
                        className="w-full bg-[#0A0A0F]/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        placeholder="Tell us about yourself"
                      />
                    ) : (
                      <p className="text-white text-lg">{profileData.bio || 'No bio added yet'}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="w-full bg-[#0A0A0F]/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="City, Country"
                      />
                    ) : (
                      <p className="text-white text-lg">{profileData.location || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Settings */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card className="bg-gradient-to-b from-[#1E1E2E]/95 to-[#1A1A28]/95 backdrop-blur-2xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white text-xl">Your Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#0A0A0F]/30 rounded-lg">
                    <span className="text-gray-400 text-sm">{stat.label}</span>
                    <span className="text-white text-lg font-semibold">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profilepage