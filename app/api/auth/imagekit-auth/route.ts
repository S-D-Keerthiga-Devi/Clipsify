import { getUploadAuthParams } from "@imagekit/next/server"
import { NextResponse } from "next/server"

export async function GET() {

    try {
        // Generate auth parameters with expiration (default is 1 hour)
        const { token, expire, signature } = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
        })
    
        return NextResponse.json({ 
            token,
            expire,
            signature,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
        })
    } catch (error) {
        console.error("ImageKit auth error:", error);
        return NextResponse.json(
            {
                error: "Authentication for Imagekit failed"
            },
            {
                status: 500
            }
        )
    }
}