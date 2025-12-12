import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

// PUT - Update user name in all videos
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { newName } = body;

        if (!newName) {
            return NextResponse.json(
                { error: "New name is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const userId = session.user.id;

        // Update all videos where this user is the poster
        const result = await Video.updateMany(
            { 'postedBy.id': userId },
            { $set: { 'postedBy.name': newName } }
        );

        return NextResponse.json({
            message: "Name updated successfully in videos",
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Error updating name in videos:", error);
        return NextResponse.json(
            { error: "Failed to update name in videos" },
            { status: 500 }
        );
    }
}
