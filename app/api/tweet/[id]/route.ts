import { connectToDb } from "@/utils";
import { NextResponse } from "next/server";
import prisma from "@/prisma";

// Get a tweet by its ID
export const GET = async (req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        // Connect to the database
        await connectToDb();
        // Find the tweet with the given ID
        const tweet = await prisma.tweets.findFirst({ where: { id: params.id } });
        
        // If no tweet is found, return a 404 error
        if (!tweet) {
            return NextResponse.json({ message: "Tweet not found" }, { status: 404 });
        }
        
        // Return the found tweet with a 200 status
        return NextResponse.json({ tweet }, { status: 200 });
    } catch (error: any) {
        // Log any errors and return a 500 status
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        // Ensure the database connection is closed
        await prisma.$disconnect();
    }
};

// Update a tweet by its ID
export const PUT = async (req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        // Extract the updated tweet content from the request body
        const {tweet} = await req.json(); 
        // Connect to the database
        await connectToDb();
        // Update the tweet with the given ID
        const updatedTweet = await prisma.tweets.update({
            data: { tweet },
            where: { id: params.id } 
        });
        
        // If no tweet is found to update, return a 404 error
        if (!updatedTweet) {
            return NextResponse.json({ message: "Tweet not found" }, { status: 404 });
        }
        
        // Return the updated tweet with a 200 status
        return NextResponse.json({ tweet: updatedTweet }, { status: 200 });
    } catch (error: any) {
        // Log any errors and return a 500 status
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        // Ensure the database connection is closed
        await prisma.$disconnect();
    }
};

// Delete a tweet by its ID
export const DELETE = async (req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        // Connect to the database
        await connectToDb();
        // Delete the tweet with the given ID
        const deletedTweet = await prisma.tweets.delete({
            where: { id: params.id } 
        });
        
        // If no tweet is found to delete, return a 404 error
        if (!deletedTweet) {
            return NextResponse.json({ message: "Tweet not found" }, { status: 404 });
        }
        
        // Return the deleted tweet with a 200 status
        return NextResponse.json({ tweet: deletedTweet }, { status: 200 });
    } catch (error: any) {
        // Log any errors and return a 500 status
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        // Ensure the database connection is closed
        await prisma.$disconnect();
    }
};
