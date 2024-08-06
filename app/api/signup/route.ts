import { connectToDb } from "@/utils";
import { NextResponse } from "next/server";
import prisma from "@/prisma";
import bcrypt from "bcrypt";

// Define the structure for user signup data
type UserSignup = {
    name: string;
    email: string;
    password: string;
}

export const POST = async (req: Request) => {
    try {
        // Extract user data from the request body
        const { name, email, password }: UserSignup = await req.json();

        // Validate that all required fields are present
        if (!name && !email && !password) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // Connect to the database
        await connectToDb();

        // Check if a user with the given email already exists
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: "User already registered, please login" }, { status: 403 });
        }

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        // Return the created user data
        return NextResponse.json({ user }, { status: 201 });
    } catch (error: any) {
        // Log and return any errors that occur
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        // Ensure the database connection is closed
        await prisma.$disconnect();
    }
};