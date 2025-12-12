import { connectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request: NextRequest){
    try {
        const {email, password, name} = await request.json()

        if(!email || !password || !name){
            return NextResponse.json(
                {error: "Email and Password are required"},
                {status: 400}
            )
        }

        await connectToDatabase()

        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            )
        }

        await User.create({
            name,
            email,
            password
        })

        return NextResponse.json(
            {message: "User registered successfully"},
            {status: 200}
        )
    } catch (error) {
        console.error("Registeration error", error)
        return NextResponse.json(
            {error: "Failed to register user"},
            {status: 400}
        )
    }
}