import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
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

  } catch (err: any) {
    console.error("Error generating public URL:", err);
    return NextResponse.json({
      error: "Failed to generate public URL",
      details: err.message
    }, { status: 500 });
  }
}