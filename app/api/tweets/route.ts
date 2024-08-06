import { connectToDb } from "@/utils";
import { NextResponse } from "next/server";
import prisma from "@/prisma";

export const GET = async (req : Request ) => {
    try {
        await connectToDb();
        const tweets = await prisma.tweets.findMany();
        return NextResponse.json({tweets}, {status: 200});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({error: error.message}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
};

type Tweet = {
    tweet: string;
    userId: string;
}

export const POST = async (req : Request ) => {
    try {
        const { tweet, userId }: Tweet = await req.json();
        if (!tweet && !userId) {
            return NextResponse.json({error: "Invalid data"}, {status: 400});
        }
        await connectToDb();
        const isUser = await prisma.user.findFirst({where: {id: userId}});
        if (!isUser) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }
        const newTweet = await prisma.tweets.create({
            data: {tweet, userId}
        });
        return NextResponse.json({tweet: newTweet}, {status: 201});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({error: error.message}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
};