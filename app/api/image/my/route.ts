import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Image from "@/models/Image";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch only the logged-in user's images
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        await connectToDatabase()

        // Filter images by the logged-in user's ID
        const images = await Image.find({ 'postedBy.id': session.user.id })
            .sort({ createdAt: -1 })
            .lean()

        if (!images || images.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(images)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch images" },
            { status: 500 }
        )
    }
}
