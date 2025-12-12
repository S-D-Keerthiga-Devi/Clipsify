import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

// Helper function to validate MongoDB ObjectId format
function isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

// GET - Fetch user profile
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

        // Validate ObjectId before using findById to prevent casting errors
        let user = null;
        if (session.user.id && isValidObjectId(session.user.id)) {
            user = await User.findById(session.user.id).select('-password');
        }

        // Fall back to email lookup if ID is invalid or user not found
        if (!user && session.user.email) {
            user = await User.findOne({ email: session.user.email }).select('-password');
        }

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            bio: user.bio || '',
            location: user.location || '',
            image: user.image || '',
            profileCompleted: user.profileCompleted || false,
            joinDate: user.createdAt,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

// PUT - Update user profile
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.log('PUT /api/profile - No session found');
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log('PUT /api/profile - Session user:', session.user.email);

        const body = await req.json();
        const { name, bio, location } = body;

        console.log('PUT /api/profile - Request body:', { name, bio, location });

        await connectToDatabase();

        let user = await User.findOne({ email: session.user.email });

        console.log('PUT /api/profile - User found:', user ? 'Yes' : 'No');

        if (!user) {
            // User doesn't exist (OAuth user) - create them
            console.log('Creating new user profile for:', session.user.email);

            try {
                user = await User.create({
                    name: name || session.user.name,
                    email: session.user.email,
                    bio: bio || '',
                    location: location || '',
                    image: session.user.image || '',
                    provider: 'google', // or detect from session
                    profileCompleted: !!(name && bio && location),
                });

                console.log('User created successfully with ID:', user._id.toString());
            } catch (createError) {
                console.error('Error creating user:', createError);
                throw createError;
            }
        } else {
            // Update existing user
            console.log('Updating existing user:', user.email);

            if (name) user.name = name;
            if (bio !== undefined) user.bio = bio;
            if (location !== undefined) user.location = location;

            // Mark profile as completed if bio and location are provided
            if (name && bio && location) {
                user.profileCompleted = true;
            }

            try {
                await user.save();
                console.log('User updated successfully');
            } catch (saveError) {
                console.error('Error saving user:', saveError);
                throw saveError;
            }
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                bio: user.bio,
                location: user.location,
                profileCompleted: user.profileCompleted,
            }
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json(
            {
                error: "Failed to update profile",
                details: error instanceof Error ? error.message : 'Unknown error',
                type: error instanceof Error ? error.constructor.name : typeof error
            },
            { status: 500 }
        );
    }
}
