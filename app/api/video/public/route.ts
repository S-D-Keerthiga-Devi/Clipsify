import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

// Initialize ImageKit only if environment variables are available
const getImageKit = () => {
  if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_URL_ENDPOINT) {
    return null;
  }

  return new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
  });
};

export async function POST(req: NextRequest) {
  const imagekit = getImageKit();

  if (!imagekit) {
    return NextResponse.json(
      { error: "ImageKit configuration missing" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { videoUrl } = body;

    if (!videoUrl) {
      return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
    }

    console.log("Generating public URL for:", videoUrl);

    // Clean the URL to remove any existing transformations/query params
    let cleanUrl = videoUrl;
    try {
      const urlObj = new URL(videoUrl);
      // Remove query parameters
      urlObj.search = '';

      // Remove path transformations (e.g., /tr:w-300,h-300/)
      // ImageKit path transformations usually start with tr:
      const pathParts = urlObj.pathname.split('/');
      const cleanPathParts = pathParts.filter(part => !part.startsWith('tr:'));
      urlObj.pathname = cleanPathParts.join('/');

      cleanUrl = urlObj.toString();
      console.log("Cleaned URL:", cleanUrl);
    } catch (e) {
      console.error("Invalid URL format:", videoUrl);
    }

    // Generate a signed public URL without any transformations
    const publicUrl = imagekit.url({
      src: cleanUrl,
      signed: true,
      expireSeconds: 3600, // 1 hour
      transformation: [], // Explicitly empty to avoid any transformations
    });

    console.log("Generated publicUrl:", publicUrl);

    return NextResponse.json({
      publicUrl
    });

  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error generating public URL:", error);
    return NextResponse.json({
      error: "Failed to generate public URL",
      details: error.message
    }, { status: 500 });
  }
}