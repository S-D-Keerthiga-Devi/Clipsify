import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase()
        const videos = await Video.find({}).sort({ createdAt: -1 }).
            lean()

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch videos" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        await connectToDatabase()

        const body: IVideo = await request.json()

        if (!body.title || !body.description || !body.videoUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Use the video URL directly without any transformations
        const videoData = {
            title: body.title,
            description: body.description,
            videoUrl: body.videoUrl,
            thumbnailUrl: body.thumbnailUrl || body.videoUrl, // Use video URL as thumbnail if not provided

            postedBy: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
            },

            controls: true,
            // Remove all transformations
        };

        const newVideo = await Video.create(videoData)

        return NextResponse.json(
            { message: "Video saved successfully", video: newVideo },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error saving video:", error);
        return NextResponse.json(
            { error: "Failed to save video" },
            { status: 500 }
        )
    }
}