import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body: {
      userId: string;
      email: string;
      content: string;
    } = await req.json();

    if (!body.email || !body.content)
      return NextResponse.json(
        { success: false, message: "Missing Params" },
        { status: 400 }
      );

    await prisma.enquiry.create({
      data: {
        id: uuid(),
        userId: body.userId,
        email: body.email,
        content: body.content,
      },
    });

    return NextResponse.json(
      { success: true, message: "Sent" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
