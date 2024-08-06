import { connectToDb } from "@/utils";
import { NextResponse } from "next/server";
import prisma from "@/prisma";

export const GET = async (req : Request ) => {
    try {
        await connectToDb();
        const users = await prisma.user.findMany({include: {tweets: true, _count: true}});
        return NextResponse.json({users}, {status: 200});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({error: error.message}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
};