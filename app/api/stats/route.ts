import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Image from "@/models/Image";
import Video from "@/models/Video";

// GET - Fetch user statistics
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const userId = session.user.id;

        // Count images uploaded by user
        const imageCount = await Image.countDocuments({ 'postedBy.id': userId });

        // Count videos uploaded by user
        const videoCount = await Video.countDocuments({ 'postedBy.id': userId });

        // Calculate total projects (unique uploads)
        const totalProjects = imageCount + videoCount;

        return NextResponse.json({
            images: imageCount,
            videos: videoCount,
            totalProjects: totalProjects,
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return NextResponse.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        );
    }
}
