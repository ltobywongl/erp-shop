import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import { createId } from '@paralleldrive/cuid2';
import { errorResponse, successResponse } from "@/utils/httpResponse";

export async function POST(req: NextRequest) {
  try {
    const body: {
      userId: string;
      email: string;
      content: string;
    } = await req.json();

    if (!body.email || !body.content)
      return errorResponse("Bad Request", 400);

    await prisma.enquiry.create({
      data: {
        id: createId(),
        userId: body.userId,
        email: body.email,
        content: body.content,
      },
    });

    return successResponse("Sent");
  } catch (error: any) {
    console.log(error);
    return errorResponse("Internal Server Error", 500);
  }
}

export const dynamic = "force-dynamic";
