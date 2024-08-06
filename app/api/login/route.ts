import { connectToDb } from "@/utils";
import { NextResponse } from "next/server";
import prisma from "@/prisma";
import bcrypt from "bcrypt";

// Define the structure for user login data
type UserLogin = {
  name?: string;  // Optional name field
  email: string;  // Required email field
  password: string;  // Required password field
};

export const POST = async (req: Request) => {
  try {
    // Extract email and password from the request body
    const { email, password }: UserLogin = await req.json();

    // Validate that both email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { message: "Invalid data, please provide email and password" },
        { status: 422 }  // Unprocessable Entity status code
      );
    }

    // Establish a connection to the database
    await connectToDb();

    // Search for a user with the provided email
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not registered, please sign up" },
        { status: 401 }  // Unauthorized status code
      );
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password, please try again" },
        { status: 401 }  // Unauthorized status code
      );
    }

    // If login is successful, return a success message
    return NextResponse.json({ message: "Logged in successfully" }, { status: 200 });
  } catch (error: any) {
    // Log any errors that occur during the process
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });  // Internal Server Error status code
  } finally {
    // Ensure the database connection is closed after the operation
    await prisma.$disconnect();
  }
};
