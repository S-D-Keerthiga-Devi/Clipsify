import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Helper function to validate MongoDB ObjectId format
function isValidObjectId(id: string): boolean {
    // MongoDB ObjectId is a 24-character hex string
    return /^[0-9a-fA-F]{24}$/.test(id);
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Email", type: "text" }
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password")
                }
                try {
                    await connectToDatabase()
                    const user = await User.findOne({ email: credentials.email })

                    if (!user) {
                        throw new Error("No user found with this")
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isValid) {
                        throw new Error("Invalid Password")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name
                    }
                } catch (error) {
                    console.error("Auth error")
                    throw error
                }
            },

        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google' || account?.provider === 'github') {
                try {
                    await connectToDatabase();

                    // Check if user exists
                    let existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        // Create new user for OAuth
                        existingUser = await User.create({
                            name: user.name || profile?.name || 'User',
                            email: user.email,
                            image: user.image || profile?.image,
                            provider: account.provider,
                            profileCompleted: false,
                        });
                    } else {
                        // Update existing user's image if available
                        if (user.image && existingUser.image !== user.image) {
                            existingUser.image = user.image;
                            await existingUser.save();
                        }
                    }

                    // Attach database user ID to the user object
                    user.id = existingUser._id.toString();
                } catch (error) {
                    console.error('Error in signIn callback:', error);
                    // Don't block login if database operation fails
                    // The user will still be authenticated, but without database record
                    // This prevents "Access Denied" errors
                }
            }
            return true;
        },
        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id
                token.email = user.email;
                token.name = user.name;
            }

            // Fetch fresh user data from database on each token refresh
            if (trigger === 'update' || !token.profileCompleted) {
                try {
                    await connectToDatabase();

                    let dbUser = null;

                    // Only use findById if token.id is a valid MongoDB ObjectId
                    // OAuth provider IDs (like Google's numeric IDs) are not valid ObjectIds
                    if (token.id && isValidObjectId(token.id as string)) {
                        dbUser = await User.findById(token.id);
                    }

                    // Fall back to email lookup if ID lookup failed or ID was invalid
                    if (!dbUser && token.email) {
                        dbUser = await User.findOne({ email: token.email });
                    }

                    if (dbUser) {
                        // Always update token.id with the correct MongoDB _id
                        token.id = dbUser._id.toString();
                        token.profileCompleted = dbUser.profileCompleted;
                        token.bio = dbUser.bio;
                        token.location = dbUser.location;
                        token.image = dbUser.image;
                        token.name = dbUser.name;
                    }
                } catch (error) {
                    console.error('Error fetching user in JWT callback:', error);
                }
            }

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                (session.user as any).profileCompleted = token.profileCompleted;
                (session.user as any).bio = token.bio;
                (session.user as any).location = token.location;
                (session.user as any).image = token.image;
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};