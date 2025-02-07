import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import { createId } from "@paralleldrive/cuid2";
import { sendMail } from "@/utils/email";
import { forgetPasswordEmail } from "@/utils/emails/forget-password";

export async function POST(req: NextRequest) {
  try {
    const body: UserForgetPassword = await req.json();

    if (!body.email) {
      return errorResponse("Invalid Parameters", 400);
    }

    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        provider: true,
      },
      where: {
        email: body.email,
      },
    });

    if (!user || user.provider != "credentials") {
      return errorResponse("Invalid Parameters", 400);
    }

    const pastVerification = await prisma.verifications.findFirst({
      where: {
        userId: user.id,
        type: "forget-password",
        OR: [
          { expiredAt: { gte: new Date() } },
          { expiredAt: null },
        ],
        deletedAt: null,
        createdAt: {
          gte: new Date(new Date().getTime() - 1000 * 60 * 5),
        },
      },
    });

    if (pastVerification !== null) {
      return errorResponse("Only ONE reset password action can be requested in 5 minutes", 400);
    }

    const verificationId = createId();
    const getForgetPasswordEmail = await forgetPasswordEmail(
      user,
      verificationId
    );

    await prisma.verifications.create({
      data: {
        id: verificationId,
        userId: user.id,
        type: "forget-password",
        expiredAt: new Date(new Date().getTime() + 1000 * 60 * 60),
      },
    });
    await sendMail("Reset Password", user.email, getForgetPasswordEmail);

    return successResponse("Please check email to confirm the action");
  } catch (error: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
