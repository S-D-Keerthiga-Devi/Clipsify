import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/videos",
      useUniqueFileName: false, // Keep original filename
      isPrivateFile: false, // Make file publicly accessible
      responseFields: ["filePath", "name", "size", "url"], // Only get necessary fields
      // Remove transformations property - it doesn't exist in UploadOptions
    });

    // Return the direct URL without any transformations
    const fullVideoUrl = uploaded.url; // Use the URL directly from ImageKit response

    return NextResponse.json({
      videoUrl: fullVideoUrl,
      // Don't add any transformations to the thumbnail
      thumbnailUrl: fullVideoUrl
    });
    
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}