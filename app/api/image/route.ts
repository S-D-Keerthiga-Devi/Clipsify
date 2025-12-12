import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Image, { IImage, IMAGE_DIMENSIONS } from "@/models/Image";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase()
        const images = await Image.find({}).sort({ createdAt: -1 }).
            lean()

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

        const body: IImage = await request.json()

        if (!body.title || !body.description || !body.imageUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const imageData = {
            title: body.title,
            description: body.description,
            imageUrl: body.imageUrl,
            transformation: {
                height: body.transformation?.height ?? IMAGE_DIMENSIONS.height,
                width: body.transformation?.width ?? IMAGE_DIMENSIONS.width,
                quality: body.transformation?.quality ?? 100
            },
            postedBy: {
                id: session.user.id,
                name: session.user.name || "Unknown",
                email: session.user.email,
            },
            controls: body.controls ?? true,
        };

        const newImage = await Image.create(imageData)

        return NextResponse.json(
            { message: "Image saved successfully", image: newImage },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error saving image:", error);
        return NextResponse.json(
            { error: "Failed to save image" },
            { status: 500 }
        )
    }
}