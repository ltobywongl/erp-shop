import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { createId } from "@paralleldrive/cuid2";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import { sendMail } from "@/utils/email";
import { verificationEmail } from "@/utils/emails/verification";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body: UserRegister = await req.json();

    if (!body.email || !body.password || !/\S+@\S+\.\S+/.test(body.email))
      return errorResponse("Bad Request", 400);

    const emailUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (emailUser !== null)
      return errorResponse("An user with this email already exists", 400);

    body.password = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        id: createId(),
        email: body.email,
        password: body.password,
        provider: "credentials",
      },
    });

    const verification = await prisma.verifications.create({
      data: {
        id: createId(),
        type: "register",
        userId: user.id,
      },
    });

    await sendMail(
      "Verify your email",
      user.email,
      verificationEmail(user, verification.id)
    );

    return successResponse("");
  } catch (error: any) {
    return errorResponse("Internal Server Error", 500);
  }
}

export const dynamic = "force-dynamic";
