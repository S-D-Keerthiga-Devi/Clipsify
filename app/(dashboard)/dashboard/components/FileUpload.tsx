"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { Upload } from "lucide-react"; // Make sure to import the Upload icon

interface FileUploadProps {
    onSuccess: (res: any) => void
    onProgress?: (progress: number) => void
    fileType?: "image" | "video"
}

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const FileUpload = ({
    onSuccess,
    onProgress,
    fileType
}: FileUploadProps) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // optional validation

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file")
                return false
            }
        }
        if (fileType === "image") {
            if (!file.type.startsWith("image/")) {
                setError("Please upload a valid image file")
                return false
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File size must be less than 100 MB")
            return false
        }
        return true
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file || !validateFile(file)) return

        setUploading(true)
        setError(null)

        try {
            const authRes = await fetch("/api/auth/imagekit-auth")
            const { token, expire, signature, publicKey, urlEndpoint } = await authRes.json();

            const res = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                // Remove any transformations
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent))
                    }
                },
            });

            onSuccess(res)
        } catch (error) {
            console.error("Upload Failed", error)
            setError("Upload failed. Please try again.")
        } finally {
            setUploading(false)
        }
    }


    return (
        <>
            <input
                type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                className="hidden"
                id={`file-upload-${fileType}`}
            />
            <label
                htmlFor={`file-upload-${fileType}`}
                className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer bg-gray-900/50 hover:bg-gray-900/70 transition-colors"
            >
                <div className="flex flex-col items-center justify-center pt-4 pb-5 sm:pt-5 sm:pb-6">
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 text-gray-400" />
                    <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                        {fileType === "video" ? "MP4, MOV, AVI (MAX. 100MB)" : "PNG, JPG, GIF (MAX. 100MB)"}
                    </p>
                </div>
            </label>
            {uploading && (
                <div className="mt-3 sm:mt-4 flex items-center justify-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 sm:ml-3 text-gray-400 text-sm sm:text-base">Uploading...</span>
                </div>
            )}
            {error && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-xs sm:text-sm">{error}</p>
                </div>
            )}
        </>
    );
};

export default FileUpload;