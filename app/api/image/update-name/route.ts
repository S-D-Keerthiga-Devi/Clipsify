import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Image from "@/models/Image";

// PUT - Update user name in all images
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

        // Update all images where this user is the poster
        const result = await Image.updateMany(
            { 'postedBy.id': userId },
            { $set: { 'postedBy.name': newName } }
        );

        return NextResponse.json({
            message: "Name updated successfully in images",
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Error updating name in images:", error);
        return NextResponse.json(
            { error: "Failed to update name in images" },
            { status: 500 }
        );
    }
}
